<?php
	
include 'variables.php';
include 'functions.php';
include 'DBFactory.php';

// Top Level Exception handler
set_exception_handler('uncaught_exception_handler');

// Datenbank Objekt holen
$db = DBFactory::getInstance();

{	// Wenn es die Tabelle nicht gibt, dann soll diese erzeugt werden
	$sql = 'CREATE TABLE IF NOT EXISTS Statistics (
		`key` VARCHAR(50) NOT NULL,
		`index` VARCHAR(50) NOT NULL,
		`value` VARCHAR(50) NOT NULL)';
	
	if (!$stmt = $db->prepare($sql)) {
		echo('ERROR: ' . $db->error);
		return;
	}
	
	if (!$stmt->execute()) {
		echo('ERROR: ' . $stmt->error);
		return;
	}
	
	$stmt->close();
}

// Variable zum auslesen des updatestrings
$update = "nothing defined";
// Wenn ein Updatestring übergeben wurde, ...
if (isset($_POST['update'])){
	// dann diesen auslesen
	$update = $_POST['update'];
	
	// Den updatestring splitten
	$frags = array();
	$frags = explode('-', $update);
	
	// SQL Querry zum auslesen eines datensatzes
	$sql = 'SELECT
				`key`,
				`index`,
				`value`
			FROM
				Statistics
			WHERE
				`key` = ? AND
				`index` = ?';
	
	if (!$stmt = $db->prepare($sql)) {
		echo('ERROR: ' . $db->error);
		return;
	}
	
	// Platzhalter im Querry durch Werte ersetzen
	$stmt->bind_param('ss', $frags[0], $frags[1]);
	
	if (!$stmt->execute()) {
		echo('ERROR: ' . $stmt->error);
		return;
	}
	
	// Datensatz auslesen
	$resultset = array();
	$stmt->bind_result($key, $index, $value);
	while ($stmt->fetch()){
		$entry = array('key'=>$key, 'index'=>$index, 'value'=>$value);
		$resultset[] = $entry;
	}
	
	$stmt->close();
	
	// Wenn es schon einen Eintrag für die key/index kombi gibt, muss dieser 
	// erweitert werden
	if (count($resultset) === 1) {
		// In dieser Variable wird der neue Wert gespeichert
		$newvalue = 0;
		// prüfen, ob in dem key ein 'd' vorkommt
		// steht das 'd' an erster Stelle, dann handelt es sich um den %Wert der aufgedeckten Zellen...
		if (strpos($frags[0], 'd') === 0) {
			// dieser muss dann mit einer speziellen Rechnung geupdated werden
			// FIXME die berechnung muss umgestellt werden
			$newvalue = (floatval($resultset[0]['value']) + floatval($frags[2])) / 2;
		}
		// wenn es sich um eine Bestzeit handelt,...
		else if (strpos($frags[0], 'sB') === 0) {
			//... dann muss geprüft werden, ob diese besser ist, als die alte, wenn ja...
			if (intval($resultset[0]['value'] > intval($frags[2]))) {
				// ...dann muss der neue Wert gesetzt werden
				$newvalue = $frags[2];
			}
		}
		// Wenn an erster Stelle kein 'd' steht,...
		else {
			// ... dan muss der update Wert einfach hinzuaddiert werden
			$newvalue = intval($resultset[0]['value']) + intval($frags[2]);
		}
		
		// SQL Querry zum aktualisieren eines datensatzes
		$sql = 'UPDATE
					Statistics
				SET
					`value` = ?
				WHERE
					`key` = ? AND
					`index` = ?';
		
		if (!$stmt = $db->prepare($sql)) {
			echo('ERROR: ' . $db->error);
			return;
		}
		
		// Platzhalter im Querry ersetzen
		$stmt->bind_param('sss', strval($newvalue), $frags[0], $frags[1]);
		
		if (!$stmt->execute()) {
			echo('ERROR: ' . $stmt->error);
			return;
		}
		
		$stmt->close();
	} 
	
	// Es gibt noch keinen eintrag für die key/index kombi
	else { 
		// Querry zum speichern eines Datensatzes
		$sql = 'INSERT INTO
					Statistics(`key`, `index`, `value`)
				VALUES
					(?,?,?)';
		
		if (!$stmt = $db->prepare($sql)) {
			echo('ERROR: ' . $db->error);
			return;
		}
		
		// Platzhalter im Querry ersetzen
		$stmt->bind_param('sss', $frags[0], $frags[1], $frags[2]);
		
		if (!$stmt->execute()) {
			echo('ERROR: ' . $stmt->error);
			return;
		}
		
		$stmt->close();
	}
}

echo($update);

?>