<?php

include 'variables.php';
include 'functions.php';
include 'DBFactory.php';

// Top Level Exception handler
set_exception_handler('uncaught_exception_handler');

// Datenbank Objekt holen
$db = DBFactory::getInstance();

{ // Alle Datensätze aus der Datenbank laden und in einen String verpacken
	// SQL Querry zum laden aler datensätze der Statistiken
	$sql = 'SELECT
				`key`,
				`index`,
				`value`
			FROM
				Statistics';
	
	if (!$stmt = $db->prepare($sql)) {
		echo('ERROR: ' . $db->error);
		return null;
	}
	
	if (!$stmt->execute()) {
		echo('ERROR: ' . $stmt->error);
		return null;
	}
	
	// Das resultset auslesen
	$resultset = array();
	$stmt->bind_result($key, $index, $value);
	while ($stmt->fetch()) {
		$resultset[] = array('key'=>$key, 'index'=>$index, 'value'=>$value);
	}
	
	$stmt->close();
	
	// Das resultset für die rückgabe vorbereiten
	$retarray = array();
	foreach ($resultset as $entry) {
		$retarray[] = $retstr . $entry['key'] . '-' . $entry['index'] . '-' . $entry['value'];
	}
	
	echo(implode(',', $retarray));
}

?>