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
	// Aktuell gibt es nur den CookiePersister, deswegen wird dieser einfach benutzt
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
	// Aktuell gibt es nur den CookiePersister, deswegen wird dieser einfach benutzt
	return CookiePersister.loadStatistics(); 
};