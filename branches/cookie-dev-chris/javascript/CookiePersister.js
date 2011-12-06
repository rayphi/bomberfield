/**
 *   Diese Klasse soll das Laden und Speichern von Daten aus einem Cookie übernehemen.
 */
function CookiePersister(){
}

	CookiePersister.saveStatistics = function(){
		
		stat = new Statistics();
		var cookieContent = stat.getPropertyString();
		$.cookie("statistics", cookieContent);
	};
	
	CookiePersister.loadStatistics = function(){
		
	};
