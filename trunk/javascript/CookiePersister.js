/**
 *   Diese Klasse soll das Laden und Speichern von Daten aus einem Cookie übernehemen.
 */
function CookiePersister(){
}

/**
 * Diese Funktion speichert die übergebenen Statistics in einen cookie
 * 
 * @param Statistics statistics
 */
CookiePersister.saveStatistics = function(statistics){

	var cookieContent = statistics.getPropertyString();
	$.cookie("statistics", cookieContent);
};

/**
 * Diese Funktion lädt die Statistics aus dem Cookie und gibt diese
 * als {@link Statistics} Objekt zurück.
 * 
 * Wenn keine Statistiken gefunden werden, dann wird ein leeres {@link Statistics} Objekt
 * zurückgegeben.
 * 
 * @returns Statistics
 */
CookiePersister.loadStatistics = function(){
	// TODO
	return new Statistics();
};
