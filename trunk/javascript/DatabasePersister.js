/**
 * Diese Klasse stellt eine KommunikationsAPI mit ein paar php Fuunktionen dar, über
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
 * Diese Funktion speichert die Daten des Übergebenen Statistics-Objektes via
 * php Funktionen in einer MySQL Datenbank
 * 
 * @param Statistics statistics Das Statistics-Objekt
 * @returns true, wenn das Speichern erfolgreich war, false sonst
 */
DatabasePersister.saveStatistics = function(statistics) {
	// Das request Objekt bauen
	var xmlhttp;
	if (window.XMLHttpRequest) { // moderne Browser
		xmlhttp = new XMLHttpRequest();
	} else { // IE5 IE6 
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	// TODO statistics in einen String packen
	var strStats = "";
	
	// Daten asynchron als POST an die entsprechende php senden
	xmlhttp.open("POST", "php/saveStatistics.php", true);
	// Die Daten senden
	xmlhttp.send(strStats);
};

/**
 * Diese Funktion lädt die Statistiken aus der Datenbank und gibt diese als
 * Statistics Objekt zurück
 * 
 * @returns Statistics statistics Ein Statistics Objekt mit allen Statistiken
 */
DatabasePersister.loadStatistics = function() {
	// TODO Statistics via pphp Funktionen laden
	var statistics = new Statistics();
	
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
	var array = strStats
	
	// TODO Statistics String parsen und Daten in das Statistics Objekt einpflegen
	
	return statistics;
};