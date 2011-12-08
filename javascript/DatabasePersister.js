/**
 * Diese Klasse stellt eine KommunikationsAPI mit ein paar php Funktionen dar, über
 * die Daten in eine MySQL Datenbank geschrieben und aus dieser geladen
 * werden können. Außerdem stellt diese API eine Funktion zur Verfügung,
 * um zu überprüfen, ob php und MySQL Datenbank überhaupt verwendet werden können
 */
function DatabasePersister() {
	
};

/**
 * Diese Funktion prüft, ob es aktuell möglich ist Daten via php Funktionen
 * in eine MySQL Datenbank zu schreiben.
 * 
 * @returns true, wenn datenbank ansprechbar, false, sonst
 */
DatabasePersister.isDatabaseAvailable = function() {
		// TODO prüfen, ob php und MySQL Server möglich sind
		return false;
};

/**
 * Diese Funktion aktualisiert die Daten der Datenbank via
 * php Funktionen mit den Daten im übergebenen String
 * 
 * @param String update ein String mit den entsprechenden updates
 * @returns true, wenn das Updaten erfolgreich war, false sonst
 */
DatabasePersister.updateStatistics = function(update) {
	// Das request Objekt bauen
	var xmlhttp;
	if (window.XMLHttpRequest) { // moderne Browser
		xmlhttp = new XMLHttpRequest();
	} else { // IE5 IE6 
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// Daten asynchron als POST an die entsprechende php senden
	xmlhttp.open("POST", "php/updateStatistics.php", true);
	// Die Daten senden
	xmlhttp.send(update);
};

/**
 * Diese Funktion lädt die Statistiken aus der Datenbank und gibt diese als
 * Statistics Objekt zurück
 * 
 * @returns Statistics statistics Ein Statistics Objekt mit allen globalen Statistiken
 */
DatabasePersister.loadStatistics = function() {
	var statistics = new Statistics();
	
	// Das Request Objekt bauen
	var xmlhttp;
	if (window.XMLHttpRequest) { // moderne Browser
		xmlhttp = new XMLHttpRequest();
	} else { // IE5 IE6 
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// Daten synchron als POST an die entsprechende php senden
	xmlhttp.open("GET", "php/loadStatistics.php", false);
	// Die Daten senden
	xmlhttp.send();
	
	// Statistics String empfangen
	var strStats = xmlhttp.responseText;
	
	// Statistics String parsen und Daten in das Statistics Objekt einpflegen
	statistics.parsePropertyString(strStats);
	
	return statistics;
};