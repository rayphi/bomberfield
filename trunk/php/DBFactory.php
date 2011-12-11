<?php

/**
 * Diese Klasse ist eine Factory für das Datenbank Objekt.
 * 
 * @author Shane
 *
 */
class DBFactory {
	
	// Hier soll die Datenbankverbindung gespeichert werden
	private static $db;
	
	/**
	 * Gibt das Singleton Datenbankobjekt zurück.
	 */
	static public function getInstance() {
		if (!isset(self::$db)) {
			
			// Datenbankverbindung aufbauen
			self::$db = @new MySQLi(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
			
			// Prüfen, ob die Verindung aufgebaut werden konnte
			if (mysqli_connect_errno()) {
				throw new Exception("MySQLi konnte sich nicht verbinden: " . mysqli_connect_error());
			}
		}
		
		return self::$db;
	}
}

?>