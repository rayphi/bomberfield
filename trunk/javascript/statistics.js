/**
 * Diese Klasse ist zur Erhebung von Statistiken gedacht. Hier können Informationen hinterlegt werden,
 * die statistische Relevanz für Bomberfield haben.
 */
function Statistics() {
	/**
	 * Die Stati zu denen Informationen hinzugefuegt oder abgefragt werden koennen
	 */
	this.state = {"win":1, "lose":2, "start":3, "discarded":4};
	
	/**
	 * Hier werden die Anzahl der gesamten Spiele festgehalten, aufgeschluesselt nach ihrer Schwierigkeit
	 */
	var gamesTotal = {};
	
	/**
	 * Hier wird die Anzahl der gewonnenen Spiele je Schwierigkeit gespeichert
	 */
	var gamesWon = {};
	
	/**
	 * Hier wird die Anzahl der verlorenen Spiele je Schwierigkeit gespeichert
	 */
	var gamesLost = {};

	/**
	 * Hier wird die Anzahl der insgesamt in Game verbrachten Sekunden pro Schwierigkeit abgespeichert
	 */
	var secondsTotal = {};
	
	/**
	 * Hier wird die Anzahl der Sekunden aller gewonnenen Spiele pro Schwierigkeit abgespeichert
	 */
	var secondsWon = {};
	
	/**
	 * Hier wird die Anzahl der Sekunden aller verlorenen Spiele pro Schwierigkeit abgespeichert
	 */
	var secondsLost = {};
	
	/**
	 * Hier werden die Bestzeiten je Schwierigkeit des Spielers abgespeichert
	 */
	var secondsBest = {};
	
	/**
	 * Hier wird abgespeichert, wieviel % der Spieler je Schwierigkeit bei verlorenen Spielen aufgedeckt hat
	 */
	var discoveredPercentLost = {};
	
	/**
	 * Hier wird abgespeichert, wieviel % der Spieler je Schwierigkeit bei gewonnenen Spielen aufgedeckt hat
	 */
	var discoveredPercentWon = {};
	
	/**
	 * Hier wird abgelegt, wieviel % der Spieler je Schwierigkeit bei abgebrochenen Spielen aufgedeckt hat
	 */
	var discoveredPercentDiscarded = {};
	
	/**
	 * Mit dieser Funktion kann man die Anzahl der Spiele des gewünschten Status und der gewünschten Schwierigkeit auslesen
	 */
	this.getGames = function(difficulty, state) {
		
		// Ueber den state switchen
		switch(state) {
		
		// Es soll die Anzahl der insgesamt gestarteten Spiele zurückgegeben werden
		case this.state.start: {
			// Prüfen ob für die gewünschte Schwierigkeit ein Wert gesetzt wurde
			if(gamesTotal[difficulty]) {
				return gamesTotal[difficulty];
			}
			return 0;
		}
		break;
		
		// Es soll die Anzahl der gewonnenen Spiele zurückgegeben werden		
		case this.state.win: {
			// Prüfen ob für die gewünschte Schwierigkeit ein Wert gesetzt wurde
			if(gamesWon[difficulty]) {				
				return gamesWon[difficulty];
			}
			return 0;
		}
		break;
		
		// Es soll die Anzahl der verlorenen Spiele zurückgegeben werden
		case this.state.lose: {
			// Prüfen ob für die gewünschte Schwierigkeit ein Wert gesetzt wurde
			if(gamesLost[difficulty]) {
				return gamesLost[difficulty];
			}
			return 0;
		}
		break;
		
		// Es soll die Anzahl der abgebrochenen Spiele zurückgegeben werden
		case this.state.discarded: {
			var winPlusLost = 0;
			// Prüfen ob für die gewünschte Schwierigkeit an den gewonnenen Spielen ein Wert gesetzt wurde
			if(gamesWon[difficulty]) {
				winPlusLost = winPlusLost + gamesWon[difficulty]; 
			}
			// Prüfen ob für die gewünschte Schwierigkeit an den verlorenen Spielen ein Wert gesetzt wurde
			if(gamesLost[difficulty]) {
				winPlusLost = winPlusLost + gamesLost[difficulty];
			}
			// Prüfen ob für die gewünschte Schwierigkeit an den insgesamt gestarteten Spielen ein Wert gesetzt wurde
			if(gamesTotal[difficulty]) {
				return gamesTotal[difficulty] - winPlusLost;
			}
			return 0;
		}
		break;
		
		// Es gibt keine weiteren Stati
		default: return -1;
		}
	};

	/**
	 * Mit dieser Funktion kann man die gespielte Zeit des gewünschten Status und der gewünschten Schwierigkeit auslesen
	 */
	this.getSeconds = function(difficulty, state) {
		
		// Ueber die state switchen
		switch(state) {
		
		// Die insgesamt gespielte Zeit in Sekunden der gewünschten Schwierigkeit zurückgeben
		case this.state.start: {
			// Pruefen, ob Zeiten fuer die gewuenschte schwierigkeit gesetzt sind
			if(secondsTotal[difficulty]) {
				return secondsTotal[difficulty];
			}
			return 0;
		}
		break;
		
		// Die gespielte Zeit aller gewonnenen Spiele der gewünschten Schwierigkeit zurückgeben
		case this.state.win: {
			// Pruefen, ob Zeiten fuer die gewuenschte schwierigkeit gesetzt sind
			if(secondsWon[difficulty]) {
				return secondsWon[difficulty];
			}
			return 0;
		}
		break;
		
		// Die gespielte Zeit aller verlorenen Spiele der gewünschten Schwierikeit zurückgeben
		case this.state.lose: {
			if(secondsLost[difficulty]) {
				return secondsLost[difficulty];
			}
			return 0;
		}
		break;
		
		// Die gespielte Zeit aller abgebrochenen Spiele der gewünschten Schwierigkeit zurückgeben
		case this.state.discarded: {
			var wonPlusLost = 0;
			// Prüfen ob für die gewünschte Schwierigkeit an den gewonnenen Spielen ein Wert gesetzt wurde
			if(secondsWon[difficulty]) {
				wonPlusLost = wonPlusLost + secondsWon[difficulty]; 
			}
			// Prüfen ob für die gewünschte Schwierigkeit an den verlorenen Spielen ein Wert gesetzt wurde
			if(secondsLost[difficulty]) {
				wonPlusLost = wonPlusLost + secondsLost[difficulty];
			}
			// Prüfen ob für die gewünschte Schwierigkeit an den insgesamt gestarteten Spielen ein Wert gesetzt wurde
			if(secondsTotal[difficulty]) {
				return secondsTotal[difficulty] - wonPlusLost;
			}
			return 0;
		}
		break;
		
		// Weitere Stati gibt es nicht
		default: return -1;
		}
	};
	
	/**
	 * Diese Funktion gibt die Bestzeit der gewuenschten Schwierigkeit zurück
	 */
	this.getBestSeconds = function(difficulty) {
		if(secondsBest[difficulty]) {
			return secondsBest[difficulty];
		}
		return 0;
	};
	
	/**
	 * Diese Funktion gibt die % der freigelegten Zellen der gewünschten Schwierigkeit und dem gewünschten Status zurück
	 */
	this.getDiscoveredPercent = function(difficulty, state) {
		
		// Ueber den state switchen
		switch(state) {
		
		// Gibt die % der aufgedeckten Zellen aller gespielten Spiele der gewünschten Schwierigkeit zurück
		case this.state.start: {
			var games = 0;
			var totalPercent = 0;
			// erst die abgebrochenen
			if(discoveredPercentDiscarded[difficulty]) {
				games = games + this.getGames(difficulty, this.state.discarded);
				totalPercent = totalPercent + (this.getGames(difficulty, this.state.discarded) * discoveredPercentDiscarded[difficulty]);
			}
			// dann sie verlorenen
			if(discoveredPercentLost[difficulty]) {
				games = games + this.getGames(difficulty, this.state.lose);
				totalPercent = totalPercent + (this.getGames(difficulty, this.state.lose) * discoveredPercentLost[difficulty]);
			}
			// dann die gewonnenen
			if(discoveredPercentWon[difficulty]) {
				games = games + this.getGames(difficulty, this.state.win);
				totalPercent = totalPercent + (this.getGames(difficulty, this.state.win) * discoveredPercentWon[difficulty]);
			}
			
			if(games > 0) {				
				return totalPercent / games;
			}
			return 0;
		}
		break;
		
		// Gibt die % der aufgedeckten Zellen aller gewonnenen Spiele der gewünschten Schwierigkeit zurück
		case this.state.win: {
			if(discoveredPercentWon[difficulty]) {
				return discoveredPercentWon[difficulty];
			}
			return 0;
		}
		break;
		
		// Gibt die % der aufgedeckten Zellen aller verlorenen Spiele der gewünschten Schwierigkeit zurück
		case this.state.lose: {
			if(discoveredPercentLost[difficulty]) {
				return discoveredPercentLost[difficulty];
			}
			return 0;
		}
		break;
		
		// Gibt die % der aufgedeckten Zellen aller abgebrochenen Spiele der gewünschten Schwierigkeit zurück
		case this.state.discarded: {
			if(discoveredPercentDiscarded[difficulty]) {
				return discoveredPercentDiscarded[difficulty];
			}
			return 0;
		}
		break;
		
		// Weitere Stati werden nicht unterstützt
		default: return -1;
		}
	};
	
	/**
	 * Mit dieser Funktion fügt man der Statistik ein Spiel hinzu. über die Stati state.win, state.lose, state.start und state.discard
	 * gib man an, welcher Art die Informtion ist.
	 * 
	 * state.win = ein gewonnenes Spiel
	 * state.lose = ein verlorenes Spiel
	 * state.start = ein gestartetes Spiel
	 * state.discard = ein abgebrochenes Spiel
	 */
	this.addGame = function(difficulty, state) {
		// über den gewünschten Status switchen
		switch(state) {
		
		// Handelt es sich um ein gewonnenes Spiel
		case this.state.win: {
			if(!gamesWon[difficulty]) {
				gamesWon[difficulty] = 0;
			}
			gamesWon[difficulty]++;
		}
		break;
			
		// Handelt es sich um ein verlorenes Spiel
		case this.state.lose: {
			if(!gamesLost[difficulty]) {
				gamesLost[difficulty] = 0;
			}
			gamesLost[difficulty]++;
		}break;
		
		// Handelt es sich um ein gestartetes Spiel
		case this.state.start: {
			if(!gamesTotal[difficulty]) {
				gamesTotal[difficulty] = 0;
			}
			gamesTotal[difficulty]++;
		}
		break;
		
		// Aktuell kann man die Anzahl der abgebrochenen Spiele aus den anderen Werten ableiten
		default: break;
		}
	};

	/**
	 * Diese Funktion fügt den Statistiken die Anzahl von benötigten Sekunden hinzu, geordnet nach
	 * Schwierigkeit.
	 */
	this.addSeconds = function(difficulty, state, seconds) {
		
		// Die benoetigten Sekunden auf den gesamtzaehler der entsprechenden Schwierigkeit addieren 
		if(!secondsTotal[difficulty]) {
			secondsTotal[difficulty] = 0;
		}
		secondsTotal[difficulty] = secondsTotal[difficulty] + seconds;
		
		// ueber den gewuenschten Status switchen
		switch(state) {
		
		// Handelt es sich um ein gewonnenes Spiel muss geprueft werden, ob es sich um eine neue Bestzeit handelt
		case this.state.win: {
			// Die Sekunden der gewonnenen Spiele hinzufügen
			if(secondsWon[difficulty]) {
				secondsWon[difficulty] = 0;
			} 
			secondsWon[difficulty] = secondsWon[difficulty] + seconds;
		
			// Auf neue Bestzeit prüfen
			if(typeof secondsBest[difficulty] == "undefined") {
				secondsBest[difficulty] = seconds;
				return true;
			} else {
				if(secondsBest[difficulty] > seconds) {
					secondsBest[difficulty] = seconds;
					return true;
				}
			}
		}
		break;
		
		// Wenn es sich um ein verlorenes Spiel handelt
		case this.state.lose: {
			// Die Sekunden den verlorenen Spielen hinzufügen
			if(!secondsLost[difficulty]) {
				secondsLost[difficulty] = 0;
			} 
			secondsLost[difficulty] = secondsLost[difficulty] + seconds;
		}
		break;
		
		// Die Zeiten für abgebrochene Spiele können aktuell noch aus den gegebenen Statistiken abgeleitet werden
		
		default: break;
		}
	};
	
	/**
	 * Hier koennen Informationen über die durchschnittliche % Menge der aufgedeckten Zellen je Spiel hinzugefuegt
	 * werden. Für gewonnene Spiele muss nichts gepflet werden, da der insgesamte Durchschnitt aus den 
	 * Statistiken abgeleitet werden kann
	 */
	this.addDiscovered = function(difficulty, state, discoveredPercent) {
		
		// Ueber den state switchen
		switch(state) {
		
		case this.state.win: {
			if(!discoveredPercentWon[difficulty]) {
				discoveredPercentWon[difficulty] = discoveredPercent;
			}
			else 
				discoveredPercentWon[difficulty] = (discoveredPercentWon[difficulty] + discoveredPercent) / 2;
		}
		break;
		
		// Wenn es sich um ein verlorenes Spiel handelt, dann addiere die % auf den Zaehler der entsprechenden schwierigkeit
		case this.state.lose: {
			if(!discoveredPercentLost[difficulty]) {
				discoveredPercentLost[difficulty] =  discoveredPercent;
			}
			else 
				discoveredPercentLost[difficulty] = (discoveredPercentLost[difficulty] + discoveredPercent) / 2;
		}
		break;
		
		// Wenn es sich um ein abgebrochenes Spiel handelt, dann addiere die % auf den Zaehler der entsprechenden schwierigkeit
		case this.state.discarded: {
			if(!discoveredPercentDiscarded[difficulty]) {
				discoveredPercentDiscarded[difficulty] =  discoveredPercent;
			}
			else 
				discoveredPercentDiscarded[difficulty] = (discoveredPercentDiscarded[difficulty] + discoveredPercent) / 2;
		}
		break;
		
		default: break;
		}
		
	};
	
	/**
	 * Diese Funktion erzeugt aus allen Attributen des Objektes einen PropertyString
	 * und gibt diesen zurück
	 * @returns string propertyString
	 */
	this.getPropertyString = function() {
		
		// Statistics ist ein JSON Array aus allen Daten der Statistic
		
		//SO HAB ICH DAS NICHT HINBEKOMMEN
		/* 
		var statistics = new Array({
			"wonGamesEasy" 	: gamesWon[10],
			"wonGamesMid" 	: gamesWon[20],
			"wonGamesHar" 	: gamesWon[30],
			"lostGamesEasy" : gamesLost[10],
			"lostGamesMid" 	: gamesLost[20],
			"lostGamesHar" 	: gamesLost[30],
			"disGamesEasy" 	: this.getGames(10, this.state.discarded ),
			"disGamesMid" 	: this.getGames(20, this.state.discarded ),
			"disGamesHar" 	: this.getGames(30, this.state.discarded),
			"secWonEasy"	: secondsWon[10],
			"secWonMid"		: secondsWon[20],
			"secWonHar"		: secondsWon[30],
			"secLostEasy"	: secondsLost[10],
			"secLostMid"	: secondsLost[20],
			"secLostHar"	: secondsLost[30],
			"secDisEasy"	: this.getSeconds(10, this.state.discarded),
			"secDisMid"		: this.getSeconds(20, this.state.discarded),
			"secDisHar"		: this.getSeconds(30, this.state.discarded),
			"persWonEasy"	: discoveredPercentWon[10],
			"persWonMid"	: discoveredPercentWon[20],
			"persWonHar"	: discoveredPercentWon[30],
			"persLostEasy"	: discoveredPercentLost[10],
			"persLostMid"	: discoveredPercentLost[20],
			"persLostHar"	: discoveredPercentLost[30],
			"persDisEasy"	: discoveredPercentDiscarded[10],
			"persDisMid"	: discoveredPercentDiscarded[20],
			"persDisHar"	: discoveredPercentDiscarded[30]
		});
		*/
		
		// Erstellung eines Arrays mit den GameDaten für die Statistik
		
		var statistics = new Array(
				this.getGames(10, this.state.win),
				this.getGames(20, this.state.win),
				this.getGames(30, this.state.win),
				this.getGames(10, this.state.lose),
				this.getGames(20, this.state.lose),
				this.getGames(30, this.state.lose),
				this.getGames(10, this.state.discarded),
				this.getGames(20, this.state.discarded),
				this.getGames(30, this.state.discarded),
				this.getSeconds(10, this.state.win),
				this.getSeconds(20, this.state.win),
				this.getSeconds(30, this.state.win),
				this.getSeconds(10, this.state.lose),
				this.getSeconds(20, this.state.lose),
				this.getSeconds(30, this.state.lose),
				this.getSeconds(10, this.state.discarded),
				this.getSeconds(20, this.state.discarded),
				this.getSeconds(30, this.state.discarded),
				this.getDiscoveredPercent(10, this.state.win),
				this.getDiscoveredPercent(20, this.state.win),
				this.getDiscoveredPercent(30, this.state.win),
				this.getDiscoveredPercent(10, this.state.lose),
				this.getDiscoveredPercent(20, this.state.lose),
				this.getDiscoveredPercent(30, this.state.lose),
				this.getDiscoveredPercent(10, this.state.discarded),
				this.getDiscoveredPercent(20, this.state.discarded),
				this.getDiscoveredPercent(30, this.state.discarded)
		);
	
		// Aus dem Array statistics wird ein string mit einem (,) als delimiter und wird in statString geschrieben. 
		var statString = statistics.join(",");
		//Test ausgabe
		alert(statString);
		//Rückgabe des Arrays als String
		return statString;
	};
	
	/**
	 * Diese Funktion parst den übergebenen Propertystring und setzt alle enthaltenen Werte
	 * in dem Objekt
	 * @param string propertyString der PropertyString
	 */
	this.parsePropertyString = function(propertyString) {
		// TODO property String parsen
	};
}