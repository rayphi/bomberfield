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
	$.cookie("statistics", cookieContent, {expires: 7});
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
	/* if-Abfrage welche prüft ob der cookie schon gesetzt ist.
	 * Wenn TRUE dann den Cookie auslesen und die daten in der Statistik anlegen.
	 * Wenn FALSE dann neue Statistik an legen
	*/
	if($.cookie("statistics") != null){	
		 var cookieContent = $.cookie("statistics");
		 var stat = new Statistics();
		 stat.parsePropertyString(cookieContent);	
		 return stat;
	}
		return new Statistics();
};
