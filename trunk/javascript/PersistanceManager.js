/**
 * 
 */
function PersistanceManager() {
}

/**
 * Diese Funktion entscheidet sich aufgrund von mehreren Faktoren für einen Persister und
 * speichert über diesen die Statistics
 * 
 * @param Statistics statistics
 */
PersistanceManager.saveStatistics = function(statistics) {
	/*
	 *  TODO hier muss geklärt werden, welcher Persister unter welcher Bedingung verwendet wird.
	 */
	
	// Daten über den CookiePersister in einem Cookie speichern
	CookiePersister.saveStatistics(statistics);
};

/**
 * Diese FUnktion lädt die Statistics aus einem Persister, für den sich die
 * Funktion aufgrund von mehreren Faktoren entscheidet und gibt diese als 
 * {@link Statistics} Objekt zurück.
 * 
 * @returns Statistics
 */
PersistanceManager.loadStatistics = function() {
	/*
	 * TODO hier muss geklärt werden, welcher Persister unter welchen Vorraussetzungen
	 * verwendet werden soll, um das Statistics Objekt auszulesen.
	 */
	
	// Aktuell gibt es nur den CookiePersister, deswegen wird dieser einfach benutzt
	return CookiePersister.loadStatistics(); 
};

/**
 * Diese Funktion benutzt einen DatabasePersister, um die globalen statistiken zu laden,
 * sollte dies möglich sein. Wenn dies nicht möglich ist, dann gibt diese methode null zurück
 * 
 * @returns Statistics, wenn die Statistiken geladen werden können, sonst null
 */
PersistanceManager.loadOverallStatistics = function() {
	// Prüfen, ob der DatabasePersister eine Datenbank zur Verfügung hat
	if (DatabasePersister.isDatabaseAvailable()) {
		// Globale Statistiken laden und zurückgeben
		return DatabasePersister.loadStatistics();
	}
	
	// Wenn keine Datenbank zur Verfügung steht, dann null  zurückgeben
	return null;
};

/**
 * Diese Funktion benutzt Persister, um die übergebenen Daten in Datenbestäde hineinzupflegen,
 * diese also zu aktualisieren.
 * 
 * @param String update die Updates
 */
PersistanceManager.updateStatistics = function(update) {
	// Überprüfen, ob der DatabasePersister eine Datenbank zur Verfügung hat
	if (DatabasePersister.isDatabaseAvailable()) {
		// Daten zum updaten übergeben
		DatabasePersister.updateStatistics(update);
	}
};