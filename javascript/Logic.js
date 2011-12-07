/**
 * TODO Doku
 */
$(document).ready(function() {
	
	if (!isCanvasSupported()) {
		$('#like-bar').hide();
		$('.canvas-check').css('display', 'inline');
	}
	
	{ // Timer initialisieren
		// Einen neuen Timer erzeugen
		time = new Timer();
		time.Enable = false;
		/* die function die zur definierten frequenz (default: 1000ms) 
		 * aufgerufen wird wird festgelegt
		 */ 
		time.Tick = timerTick;
	}
	
	{ // Die Statistics initialisieren
		statistics = new Statistics();
	}
	
	// Schwierigkeitsgrade werden geladen 
	loadDifficulties();
	// startet ein trigger on change event (Schwierigkeit wird bei auswahl gesetzt)
	difficultyTrigger();
	
	// Schwierigkeitsgrade für die Statistiken laden 
	loadStatisticsDifficulty();
	
	// startet ein trigger on change event (Statistik wird bei auswahl geändert)
	statisticsTrigger();
	
	// Hier wird das Image für die Flaggen geladen
	imageFlag = new Image();
	imageFlag.src = "images/flag.png";

	// Hier wird das Image für die Minen geladen
	imageMine = new Image();
	imageMine.src = "images/mine.png";

	// Hier wird der CSS Style für das canvas angepasst
	$('#canvas, #main, #footer-content').css('width', canvasWidth + 'px');
	$('#canvas').css('height', canvasHeight + 'px');

	// Hier wird der Backgroundbuffer des canvas angepasst
	$('#canvas').attr('height', canvasHeight);
	$('#canvas').attr('width', canvasWidth);
	$('#HUD').css('width', canvasWidth-100);
	
	// Kontextmenü des Messagefeldes unterdrücken
	$('#Message').bind("contextmenu", function(e) {
		return false;
	});
	
	// Kontextmenü des canvas unterdrücken
	$('#canvas').bind("contextmenu", function(e) {
		return false;
	});
	
	// Hier wird der New Game Button konfiguriert
	$('.newGame').click(function(e){
		// Entfernt beim klicken des NewGame buttons die alte Win|Lose Nachricht aus dem Messagefeld 
		$('p').remove(".wlmessage");
		// Das Messagefeld verschieben
		$('#Message').css({top:0, left:0, width:0, height:0});
		// Das Messagefeld verstecken
		$('#Message').addClass('displayed');
		
		// Wenn man noch am leben ist, ...
		if(alive) {
			// ...dann gilt das Spiel als abgebrochen
			discard();
		}		
		
		// Ein neues Spiel starten		
		newGame();
	});
	
	// Hier wird der New Game Button im MessageFeld konfiguriert
	$('#MessageNewGame').click(function(e){
		// Das Messagefeld verstecken
		$('#Message').addClass('displayed');
		// Das Messagefeld verschieben
		$('#Message').css({top:0, left:0, width:0, height:0});
		// Entfernt beim klicken des NewGame buttons die alte Win|Lose Nachricht aus dem Messagefeld 
		$('p').remove(".wlmessage");
		
		// Ein neues Spiel starten
		newGame();
	});
	
	// Hier wird der Feld anschauen Button im MessageFeld konfiguriert
	$('#showField').click(function(e){
		// Das Messagefeld  verstecken
		$('#Message').addClass('displayed');
	});
	
	// Wenn ein Mousebutton gedrückt wurde
	$('#canvas').mousedown(function(e) {
		// Die aktuelle Position ermitteln
		actualMousedownPosition = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop);
		// Die aktuelle Position auch als initiale Klickposition setzen
		initialMousedownPosition = actualMousedownPosition;
		// Markieren, dass ein mousedown stattgefunden hat
		mousedown = true;
		// Wenn es sich um einen Rechtsklick handelt, dann den boolean setzen
		if(e.button == 2)
			rightMouseDown = true;
		else
			rightMouseDown = false;
	});
	
	// Wenn die Maus bewegt wurde
	$('#canvas').mousemove(function(e) {
		// Wenn ein mousedown stattgefunden hat, ...
		if (mousedown) {
			// ...dann die neue Mausposition ermitteln
			newMousePosition = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop);
			// Den neuen offsetVector berechnen (also das Spielfeld verschieben
			offsetVector = offsetVector.add(newMousePosition.sub(actualMousedownPosition));
			{ // Prüfen, ob der OffsetVector seine Maximalwerte überschreitet
				var maxOffset = getMaxOffset();
				
				// Wenn die X-Koordinate des offsetVector zu groß wird, dann verringern
				if (offsetVector.x >= maxOffset.x)
					offsetVector = offsetVector.sub(new Vector(maxOffset.x, 0));
				// Wenn die X-Koordinate des offsetVector zu klein wird, dann vergrößern
				else if (offsetVector.x <= -maxOffset.x)
					offsetVector = offsetVector.add(new Vector(maxOffset.x, 0));
				
				// Wenn die Y-Koordinate des offsetVector zu groß wird, dann verringern
				if (offsetVector.y >= maxOffset.y)
					offsetVector = offsetVector.sub(new Vector(0, maxOffset.y));
				// Wenn die Y-Koordinate des offsetVector zu klein wird, dann vergrößern
				else if (offsetVector.y <= maxOffset.y)
					offsetVector = offsetVector.add(new Vector(0, maxOffset.y));
			}
			// Die aktuelle Position setzen
			actualMousedownPosition = newMousePosition;
			// Das Spielfeld neu zeichnen
			repaint();
		}
	});
	
	// Wenn man mit der Maus das canvas verlässt
	$('#canvas').mouseout(function(e) {
		// Den Mousdown beenden
		mousedown = false;
	});
	
	// Wenn eine Maustaste losgelassen wird
	$('#canvas').mouseup(function(e) {
		// Die aktuelle Mausposition berechnen
		newMousePosition = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop);
		
		// Wenn ein Rechtsklick stattgefunden hat
		if(rightMouseDown && (newMousePosition.sub(initialMousedownPosition).absolute() <= mouseClickTolerance)) {
			// Wenn der Timer noch nicht gestartet ist wird er gestartet
			if(time.Enable == false && alive){
				// Den Timer starten und die Statistiken anhauen
				start();
			}
			
			// Nur wenn man noch lebt
			if(alive) {
				// Hier werden die Koordinaten des Klick in für das Spiel verwertbare Koordinaten umgewandelt
				clickVector = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop);

				// Hier wird die gerechtsklickte Zelle ermittelt und markiert
				for(var i = 0; i < arrayDimensionLine; i++) {
					for(var j = 0; j < arrayDimensionColumn; j++) {
						if(hexatileOnMap(i,j))
							if(gameField[i][j].collides(clickVector)) {
								if(!gameField[i][j].isMarked) {
									if(exsistingMines > 0) {
										if(gameField[i][j].toggleMarked())
											// Wenn eine Flagge gesetzt wurde, dann Minen runter zählen
											exsistingMines--;
									}
								} else {
									if(gameField[i][j].toggleMarked())
										// sonst hoch zählen
										exsistingMines++;
								}
								// Im Anschluß die Anzahl der Minen schreiben
								$('span#mines').html(exsistingMines);
							}
					}
				}
				
				// das Spielfeld neu zeichnen
				repaint();
				
				// Ermitteln ob man gewonnen hat. An dieser Stelle kann man nur gewinnen, wenn alle Minen markiert wurden
				if(checkVictoryMark()) {
					// Den Sieg verarbeiten
					win();
				}
			}
		} else if(newMousePosition.sub(initialMousedownPosition).absolute() <= mouseClickTolerance) {
			// Wenn der Timer noch nicht gestartet ist wird er gestartet
			if(time.Enable == false && alive){
				// Timer starten und Statistik anhauen
				start();
			}
			
			// Nur wenn man noch lebt
			if(alive) {
				// Hier werden die Koordinaten des Klick in für das Spiel verwertbare Koordinaten umgewandelt
				clickVector = newMousePosition;
	
				// Hier wird die geklickte Zelle ermittelt und letztenendes wirklich geklickt
				for(var i = 0; i < arrayDimensionLine; i++) {
					for(var j = 0; j < arrayDimensionColumn; j++) {
						if(hexatileOnMap(i,j))
							if(gameField[i][j].collides(clickVector)) {
								gameField[i][j].clicked();
							}
					}
				}
	
				// Das Spielfeld neu zeichnen
				repaint();
	
				// prüfen, ob man gewonnen hat. An dieser Stelle kann man nur gewinnen, wenn alle leeren Zellen aufgedeckt wurden
				if(checkVictoryClick()) {
					// Den Sieg verarbeiten
					win();
				}
			}
		}
		
		// Den mousedown beenden, da der Knopf losgelassen wurde
		mousedown = false;
	});
	
	// Mousewheelevent hinzufügen
	$('#canvas').mousewheel(function(e, delta){
		// wir müssen uns die alte dimension merken
		vOldDimension = new Vector(cellWidth, cellHeight);
		
		{ // minimale Dimension eines Hexatile berechnen
			minWidth = (canvasWidth / cellsInLine > 10 ? canvasWidth / cellsInLine : 20);
			minHeight = (canvasHeight / cellsInLine > 10 ? canvasHeight / cellsInLine : 20);
			if (minWidth > minHeight)
				minHeight = minWidth;
			else minWidth = minHeight;
		}
		
		// maximale Dimension eines Hexatile berechnen
		maxWidth = 80;
		maxHeight = 80;
		
		// neue Dimension des Hexatile anpassen
		cellHeight = cellHeight + (delta * mousewheelDelta);
		cellWidth = cellWidth + (delta * mousewheelDelta);
		
		{ // Evtl Dimension des Hexatile korrigieren
			if (cellWidth < minWidth || cellHeight < minHeight) {
				cellWidth = minWidth;
				cellHeight = minHeight;
			} else if (cellWidth > maxWidth || cellHeight > maxHeight) {
				cellWidth = maxWidth;
				cellHeight = maxHeight;
			}
		}
		
		// line und column Vektoren neu berechnen
		lineVector = new Vector(-(cellWidth/2), (cellHeight * 3) / 4);
		columnVector = new Vector(cellWidth/2, (cellHeight * 3) / 4);
		
		{ // offsetVektor neu berechnen
			// dieser Vektor ist der Unterschied zwischen neuer Zelldimension und alter Zelldimension
			vCellDimDelta = new Vector(cellWidth, cellHeight).sub(vOldDimension);
			// die aktuelle Mausposition relativ zum canvas ermitteln
			vMousePos = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop);
			// Den Vektor von offset zur Mausposition berechnen
			vOffsetMouse = vMousePos.sub(offsetVector);
			// Die Verschiebung des Mauszeigers aufgrund der Zelldimensionsveränderung relativ zum Spielfeld berechnen
			vDelta = new Vector((vOffsetMouse.x / vOldDimension.x) * vCellDimDelta.x, (vOffsetMouse.y / vOldDimension.y) * vCellDimDelta.y);
			
			// offset neuberechnung durchführen
			offsetVector = offsetVector.sub(vDelta);
		}
		
		// Spielfeld neu zeichnen
		repaint();
	});

	// Den context des canvas laden und in der globalen Variablen ctx ablegen
	var canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	// Ein neues Spiel starten
	newGame();
});






/* ************************************************
 * Globale Variablen
 * ************************************************/
/**
 * Hier wird das image für die Flagge gespeichert
 */
var imageFlag;

/**
 * Hier wird das Image für die Mine gespeichert
 */
var imageMine;

/**
 * Dieser Vector dient der Verschiebung der Zellen innerhalb des Canvas. Initial
 * und in erster Spieleversion ist das Spielfeld nicht verschoben.
 */
var offsetVector = new Vector(0,0);
/**
 * Die Breite des Rechtecks in das die Zelle gezeichnet werden soll
 */
var cellWidth = 30;
/**
 * Die Höhe des Rechtecks in das die Zelle gezeichnet werden soll
 */
var cellHeight = 30;

/**
 * Der lineVector beschreibt die absolute Entfernung zwischen den Mittelpunkten zweier benachbarter
 * Hexatiles innerhalb derselben Zeile der Matrix
 */
var lineVector = new Vector(-(cellWidth/2), (cellHeight * 3) / 4);
/**
 * Der columnVector beschreibt die absolute Entfernung zwischen den Mittelpunkten zweier benachbarter
 * Hexatiles innerhalb derselben Spalte der Matrix
 */
var columnVector = new Vector(cellWidth/2, (cellHeight * 3) / 4);

/**
 * canvasWidth gibt die Breite des canvas vor
 */
var canvasWidth = 800;
/**
 * canvasHeight gibt die Höhe des canvas vor
 */
var canvasHeight = 425;

/**
 * Die Anzahl der Hexatiles in einer visuellen Zeile des Spielfeldes
 */
var cellsInLine = 50;
/**
 * Die Anzahl der Hexatiles in einer visuellen Spalte des Spielfeldes
 */
var cellsInColumn = 50;

/** 
 * Die Ausdehnung der Matrix (solange diese noch quadratisch ist)
 */
var arrayDimensionLine;
var arrayDimensionColumn;

/**
 * Die Spielfeldmatrix
 */
var gameField;

/**
 * Hier werden alle möglichen Schwierigkeitsgrade als enum gespeichert
 */
var difficulties = {"easy" : 10, "medium" : 20, "hard" : 30, "debug" : 2, "test" : 1};

/**
 * Der Schwierigkeitsgrad
 */
var difficulty = difficulties.easy;

/**
 * Der canvas kontext
 */
var ctx;

/**
 * true wenn man noch am leben ist, false wenn die Bombe explodiert ist
 */
var alive = false;

/**
 * Es folgen alle ctx fillStyle(fs) und strokeStyle(ss) definitionen
 */
var fsText = "#000000";
var ssBorder = "#4a4a4a";
var fs0Mines = "#ffffff";
var fs1Mines = "#eecaa6";
var fs2Mines = "#eda877";
var fs3Mines = "#ed8b6b";
var fs4Mines = "#ed7a53";
var fs5Mines = "#ed6347";
var fs6Mines = "#ed4a3b";
var fsClosed = "#699be0";
var fsExplode = "#ed2f2f";

/**
 * Der Timer
 */
var time;
/**
 * Hier werden die bisher für die aktuelle Runde benötigten Sekunden abgelegt
 */ 
var seconds;

/**
 * Beim Erzeugen des Spielfeldes wird hier gezählt, wieviele Minen erzeugt werden
 */
var exsistingMines;

/**
 * Das Statistics-Objekt
 */
var statistics;

/**
 * Wird bei einem Mousedown gesetzt
 */
var mousedown = false;
var rightMouseDown = false;
/**
 * Hier wird die während eines Klicks letzte Mausposition gespeichert
 */
var actualMousedownPosition;
var initialMousedownPosition;
/**
 * Dieser Wert gibt eine Bewegungstoleranz vor. Dieser Wert besagt, bei welcher
 * Bewegungsdistanz ein Mouseup noch als click gezählt wird. (px)
 */
var mouseClickTolerance = 2;
/**
 * Der mousewheelDelta gibt vor, um wieviele px sich die Dimension eines Hexatile verändert,
 * wenn am Mausrad gedreht wird
 */
var mousewheelDelta = 2;






/**
 * TODO Doku
 * @returns {Boolean}
 */
function isCanvasSupported() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}






/**
 * Die in @var difficulties festgelegten Schwierigkeitsstufen
 * werden in die Auswahlliste geladen.
 */
function loadDifficulties() {
	var select = $('#difficulty');
	var options;
	if(select.prop) {
	  options = select.prop('options');
	}
	else {
	  options = select.attr('options');
	}
	$('option', select).remove();
	
	$.each(difficulties, function(text, value) {
		options[options.length] = new Option(text, value);
	});
	select.val(difficulty);
}






/**
 * Diese Funktion triggert einen 'change' in der Auswahlliste. 
 * Sobald ein 'change' festgestellt wird, wird der Schwierigkeitsgrad
 * neu gesetzt.
 */
function difficultyTrigger() {
	$("#difficulty").change(function () {
		if(alive) {
			$('#resume').animate({
				marginTop: '-15px',
				opacity: 1
			}, 300);
			$('.newGame').toggleClass('restart');
	
			$('#resume').click(function(e){ 
				loadDifficulties();
				$('#resume').animate({
					marginTop: '-88px',
					opacity: 0
				}, 300);
				$('.newGame').removeClass('restart');
			});
			
			$('.restart').click(function(e){ 
				difficulty = $('#difficulty :selected').val();
				$('.newGame').removeClass('restart');
				$('#resume').animate({
					marginTop: '-88px',
					opacity: 0
				}, 300);
				newGame(); 
			});
		} else {
			difficulty = $('#difficulty :selected').val();
		}
	}).trigger('change');
}






/**
 * Diese Funktion startet ein neues Spiel
 */
function newGame() {
	// Das Spielfeld leeren
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	
	// Wenn der Timer widererwarten noch laufen sollte, dann muss er angehalten werden
	if(time.Enable){
		time.Stop();
	}
	
	// Timer zurücksetzen
	seconds = 0;
	$('span#timer').html(seconds);
	
	alive = true;
	// Baue das Spielfeld
	arrayBuild();
	// Zeichne die Anzahl der Minen
	$('span#mines').html(exsistingMines);
	
	// Den Schwierigkeitsgrad des Statistikdiv setzen
	$('#difficulty4statistics').val($('#difficulty').val());
	
	repaint();
}






/**
 * Diese Funktion muss aufgerufen werden, wenn das Spiel gestartet wird.
 * Achtung: Das Spiel startet erst, wenn der Spieler seine erste auf das Spielfeld bezogene
 * Aktion tätigt.
 */
function start() {
	time.Start();
	statistics.addGame(difficulty, statistics.state.start);
}






/**
 * Diese Funktion wird aufgerufen, wenn das Spiel gewonnen wurde.
 */
function win() {
	time.Stop();
	alive = false;
	
	statistics.addGame(difficulty, statistics.state.win);
	best = statistics.addSeconds(difficulty, statistics.state.win, seconds);
	statistics.addDiscovered(difficulty, statistics.state.win, calculateDiscoveredPercent());
	
	message("Sie haben gewonnen!<br>" +
			(best ? "Neue Bestzeit <br>" : "") +
			"Schwierigkeit: " + $('#difficulty :selected').text()   + " <br>" +
			"Benötigte Zeit: " + timeCalculator(seconds) + " <br>" +
			"Aufgedeckte Felder: " + percCalculator(calculateDiscoveredPercent())) + "%";
}






/**
 * Diese Funktion wird aufgerufen, wenn das Spiel verloren wurde.
 */
function lose() {
	time.Stop();
	alive = false;
	
	statistics.addGame(difficulty, statistics.state.lose);
	statistics.addSeconds(difficulty, statistics.state.lose, seconds);
	statistics.addDiscovered(difficulty, statistics.state.lose, calculateDiscoveredPercent());
	
	message("Sie haben verloren!<br> <br>" + 
			"Schwierigkeit: " + $('#difficulty :selected').text()   + " <br>" +
			"Benötigte Zeit: " + timeCalculator(seconds) + " <br>" +
			"Aufgedeckte Felder: " + percCalculator(calculateDiscoveredPercent()) + "%");
}






/**
 * Diese Funktion wird aufgerufen, wenn das Spiel verloren oder gewonnen wurde und öffnet das MessageFenster.
 */
function message(text){
	// Den Offset des canvas lesen
	var offset = $('#canvas').offset();
	// Den Offset des Messagefeldes setzen
	$('#Message').offset({top: offset.top, left: offset.left});
	// Die Dimensionen des Messagefeldes setzen
	$('#Message').css({'width': canvasWidth, 'height': canvasHeight});
	// Die Nachricht dem Messagefeld hinzufügen
	$('#Message').append('<p class="wlmessage">' + text + '</p>');
	// Das Messagefeld anzeigen
	$('#Message').removeClass('displayed');
	statWritter();
}






/**
 * Diese Funktion erstellt die Ausgabe für die Statistik,
 * sie beinhaltet sowohl Anzahl der Spiele als auch Spielzeit.
 *  
 */
function statWritter(){
	// Variable welche die Anzahl der Siege beinhaltet
	var win = statistics.getGames($("#difficulty4statistics").val(), statistics.state.win);
	// Schreibt in winTime die insgesamt gespielte zeit wodrauf ein Sieg folgte.
	var winTime = timeCalculator(statistics.getSeconds($("#difficulty4statistics").val(), statistics.state.win));
	// Schreibt in winPerc die insgesamt aufgedeckten Felder wodrauf ein Sieg folgte & teilt die % durch die Spiele.
	var winPerc = percCalculator(statistics.getDiscoveredPercent($("#difficulty4statistics").val(), statistics.state.win));
	
	
	// Variable welche die Anzahl der Niederlagen beinhaltet
	var lose = statistics.getGames($("#difficulty4statistics").val(), statistics.state.lose);
	// Schreibt in loseTime die insgesamt gespielte zeit wodrauf eine Niederlage folgte.
	var loseTime = timeCalculator(statistics.getSeconds($("#difficulty4statistics").val(), statistics.state.lose));
	// Schreibt in winPerc die insgesamt aufgedeckten Felder wodrauf eine Niederlage folgte & teilt die % durch die Spiele.
	var losePerc = percCalculator(statistics.getDiscoveredPercent($("#difficulty4statistics").val(), statistics.state.lose));
	
	// Variable welche die Anzahl der Aufgaben beinhaltet
	var discard = statistics.getGames($("#difficulty4statistics").val(), statistics.state.discarded);
	// Schreibt in discardTime die insgesamt gespielte zeit wodrauf eine Aufgabe folgte.
	var discardTime= timeCalculator(statistics.getSeconds($("#difficulty4statistics").val(), statistics.state.discarded));
	// Schreibt in winPerc die insgesamt aufgedeckten Felder wodrauf eine Aufgabe folgte & teilt die % durch die Spiele.
	var discardPerc = percCalculator(statistics.getDiscoveredPercent($("#difficulty4statistics").val(), statistics.state.discarded));
	
	// Die Bestzeit der gewählten Schwierigkeit auslesen
	var bestTime = timeCalculator(statistics.getBestSeconds($("#difficulty4statistics").val()));
	
	// Entfernt beim klicken des NewGame buttons die alte Statistik aus dem Statistikfeld und fügt aktuelle ein.
	$("#allStatistics").html("<p> Gewonnen: " + win + " mal" + "<br> Zeit gesamt: " + winTime +"<br> Felder aufgedeckt: " + winPerc +"%<br> Bestzeit: " + bestTime + "</p>" + 
	"<p> Verloren: " + lose + " mal" + "<br> Zeit gesamt: " + loseTime +"<br> Felder aufgedeckt: " + losePerc +"%</p>" + 
	"<p> Abgebrochen: " + discard + " mal" + "<br> Zeit gesamt: " + discardTime + "<br> Felder aufgedeckt: " + discardPerc +"%</p>");
}






/**
 * Diese Funktion Rechnet die nach Komma stellen auf 2 runter. 
 * 
 * @param perc beinhalter die Prozentzahl mit zuvielen Kommastellen
 * @returns gibt die Prozentzahl mit nur noch 2 Kommastellen an
 */
function percCalculator(perc){
	perc = perc * 100;
	perc = Math.round(perc);
	perc = perc / 100;
	
	return perc;
}






/**
 * Diese Funktion überprüft ob time kleiner 60 ist und gibt time dann als sekunden zurück,
 * falls time größer 60 wird time in Minuten zurück gegeben.
 * 
 * @param time beinhaltet die Zeit die übergenen wird.
 * @returns gibt die gespielte Zeit entweder in Sekunden oder Minuten zurück.
 */
function timeCalculator(time){
	if(time < 60){
		var secTime = time + " Sekunden";
		return secTime;
	}
	else{
		var minTime =  (time -(time%60))/60 + ":" + ((time%60) < 10 ? "0"+(time%60) : (time%60)) + " Minute/n";
		return minTime;
	}
}






/**
 * Die in @var difficulties festgelegten Schwierigkeitsstufen
 * werden in die Auswahlliste geladen.
 */
function loadStatisticsDifficulty() {
	var select = $('#difficulty4statistics');
	var options;
	if(select.prop) {
	  options = select.prop('options');
	}
	else {
	  options = select.attr('options');
	}
	$('option', select).remove();
	$.each(difficulties, function(text, value) {
		options[options.length] = new Option(text, value);
	});
	select.val(difficulty);
}






/**
 * Diese Funktion triggert einen 'change' in der Auswahlliste. 
 * Sobald ein 'change' festgestellt wird, wird die Statistik aktualisiert.
 */
function statisticsTrigger() {
	$("#difficulty4statistics").change(function () {
		statWritter();
	}).trigger('change');
}






/**
 * Diese Funktion wird aufgerufen, wenn das Spiel abgebrochen wurde.
 */
function discard() {
	// Wenn der Timer aktiv ist,...
	if(time.Enable) {
		// ...dann anhalten
		time.Stop();
	}
	
	// Die gespielte Zeit in die Statistiken einfließen lassen
	statistics.addSeconds(difficulty, statistics.state.discard, seconds);
	// Die aufgedeckte Fläche in die Statistiken einfließen lassen
	statistics.addDiscovered(difficulty, statistics.state.discard, calculateDiscoveredPercent());
}






/**
 * Diese Funktion berechnet die % der aktuell aufgedeckten leeren Zellen
 */
function calculateDiscoveredPercent() {
	// Zähler für die Zellen
	var cellCount = 0;
	// Zähler für die aufgedeckten Zellen
	var openCells = 0;
	
	// Über alle Zeilen iterieren...
	for(var i = 0; i < arrayDimensionLine; i++) {
		// ...über alle spalten iterieren ...
		for(var j = 0; j < arrayDimensionColumn; j++) {
			// ...prüfen, ob die Zelle auf der Map liegt...
			if(hexatileOnMap(i, j)) {
				// ...prüfen, ob die Zelle keine Miene ist...
				if(!gameField[i][j].isMine) {
					// ...Zähler für die Zellen hoch zählen
					cellCount++;
				}
				// ...prüfen, ob die Zelle aufgedeckt ist...
				if(gameField[i][j].isOpen) {
					// ...Zähler für die aufgedeckten Zellen hochzählen
					openCells++;
				}
			}
		}
	}
	
	// Gibt zurück, wieviel % der Zellen, welche keine Mienen sind aufgedeckt wurden
	return (openCells * 100) / cellCount;
}






/**
 * Diese Funktion soll vom Timer verwendet werden, um die Zeit zu tracken
 * Hier wird der timer um eins erhöht und die aktuelle Zeit wird Ausgegeben
 */ 
function timerTick() {
	seconds  = seconds + 1;
	$('#timer').html(seconds);
}






/**
 * Diese Funktion berechnet die Dimensionen des Spielfeldes, initialisiert das Array entsprechend und
 * erzeugt die Hexatiles.
 */
function arrayBuild(){
	/*
	 * evtl moechte man in einer spaeteren Version manuell ein Array definieren, welches eine groessere Map
	 * beherbergen kann als das canvas, deswegen gibt es diese beiden Variablen, welche in erster Version
	 * lediglich mit der Dimension des Standard Arrays belegt werden.
	 */
	var arrayColumns;
	var arrayRows;


	// In diesem Block finden die Berechnungen statt, welche die Dimension des Spielfeldes berechnen sollen.
	// In der ersten Version des SPiels soll sich das Spielfeld aus der Größe des Canvas ableiten.
	// In spaeteren Versionen soll das Spielfeld auch groesser gewählt werden können.
	{
		// Die Dimension des Arrays leitet sich aus der Anzahl der Hexatiles in einer Zeile und der Anzahl der Hexatiles in
		// einer Spalte ab.
		arrayDimensionLine = cellsInLine + (Math.round(cellsInColumn / 2) - 1);
		arrayDimensionColumn = arrayDimensionLine;
		// Bei dieser Berechnungsart ist die Matrix quadratisch und deswegen gibt es genausoviele Spalten wie Zeilen
		arrayRows = arrayDimensionLine;
		arrayColumns = arrayDimensionColumn;
	}

	// An dieser Stelle wird das Spielfeld als ein Array mit der berechneten Größe definiert
	gameField = new Array(arrayRows);
	// Die Anzahl der existierenden Minen zurücksetzen
	exsistingMines = 0;
	// Dann wird jedes Feld des Arrays durchlaufen
	for(var i = 0; i < arrayRows; i++ ){
		// und ebenfalls als Array der berechneten Größe definiert
		gameField[i] = new Array(arrayColumns);
		// Anschließend werden also alle Spalten der eben erzeugten Zeile durchlaufen 
		for(var j = 0; j < arrayColumns; j++){
			// Und geprüft, ob die entsprechenden Zelle mit einem Hexatile versehen werden muss.
			if(hexatileOnMap(i,j)) {
				// Wenn ja, dann wird ein Hexatile an der entsprechenden Zelle erzeugt und mit 
				// Koordinaten versehen, welche sich von den Original Koordinaten unterscheiden,
				// jedoch notwendig sind, damit dich die hexatiles resourcenschonend selbst 
				// zeichnen und verwalten können.
				gameField[i][j] = new Hexatile(i - (cellsInLine - 1),j);
			}
		}
	}
	
	{// Die Mienen erzeugen
		// berechnen, wieviele Mienen erzeugt werden müssen
		minesToGo = ((cellsInLine * cellsInColumn) * difficulty) / 100;
		
		// solange noch Mienen erzeugt werden müssen..
		while (minesToGo > 0) {
			// ...zufällig eine Zeile ermitteln,...
			line = Math.round(Math.random() * (arrayRows));
			// ...zufällig eine Spalte ermitteln...
			column = Math.round(Math.random() * (arrayColumns));
			
			// ...und prüfen, ob die so ermittelte Zelle auf dem Spielfeld liegt und noch keine Miene ist.
			if (hexatileOnMap(line, column) && !gameField[line][column].isMine) {
				// Die Zelle zu einer Miene machen
				gameField[line][column].isMine = true;
				// Die Anzahl der zu produzierenden Mienen herunterzählen
				minesToGo--;
				// Die Anzahl der exsistierenden Mienen hochzählen
				exsistingMines++;
			}
		}
	}

}






/**
 * Diese Funktion durchläuft das gesamte Array und stößt das Neuzeichnen jeder einuzelnen Zelle an,
 * wenn sie vorhanden ist.
 */
function repaint(){
	// Durchlaufe alle Zeilen...
	for(var i = 0; i < arrayDimensionLine; i++) {
		// ...und Spalten,...
		for(var j = 0; j < arrayDimensionColumn; j++) {
			// ...dann prüfe, ob die Zele auf der Map liegt,...
			if(hexatileOnMap(i,j)) {
				// ...wenn ja, dann zeichne sie
				gameField[i][j].draw(ctx);
			}
		}
	}
}






/**
 * Diese Funktion Ueberprueft, ob ein Sieg besteht
 */
function checkVictoryClick() {
	// Dazu muss die gesamte Matrix durchlaufen werden
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			// Und fuer jede Zelle muss geprueft werden, ob sie auf der Map ist
			if(hexatileOnMap(i,j))
				// Dann wird geprueft, ob diese Zelle noch verdeckt und keine Mine ist
				if(!gameField[i][j].isOpen && !gameField[i][j].isMine)
					// in diesem Fall hat man noch nicht durch aufdecken aller leeren Felder gewonnen
					return false;
		}
	}

	// An dieser Stelle ist klar, dass alle leeren Felder aufgedeckt wurden 
	return true;
}






/**
 * Diese Funktion Ueberprueft, ob alle Minen markiert wurden
 */
function checkVictoryMark() {
	// Dazu muss über die gesamte Matrix iteriert werden
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			// Und fuer jede Zelle muss geprueft werden, ob sie auf der Map ist
			if(hexatileOnMap(i,j)) {
				// Dann wird geprueft, ob diese Zelle eine Mine und unmarkiert ist
				if(gameField[i][j].isMine && !gameField[i][j].isMarked)
					// dies wuerde bedeuten, das man nicht durch markieren gewonnen hat
					return false;
				// oder, ob es keine Mine aber trotzdem markiert ist
				else if(!gameField[i][j].isMine && gameField[i][j].isMarked)
					// Dies wüde auch bedeuten, dass man nicht gewonnen hat
					return false;
			}
		}
	}
	
	// Hier angekommen ist klar, das der Spieler durch markieren gewonnen hat
	return true;
}






/**
 * Diese Funktion führt den Klick auf allen Zellen in der unmittelbaren Umgebung der übergebenen Koordinaten
 * aus. Dabei handelt es sich um die Hexatileeigenen Koordinaten, welche innerhalb dieser Funktion auf
 * die Matrixkoordinaten zurückgerechnet werden müssen.
 */
function clickSurroundingMines(line, column){
	// Da sich die Hexatile-Koordinaten und die Matrix-Koordinaten nur in der Zeile unterscheiden, muss nur diese
	// umgerechnet werden.
	var matLine = line + (cellsInLine - 1);
	
	// links
	{
		if(hexatileOnMap(matLine + 1, column - 1))
			gameField[matLine + 1][column - 1].clicked();
		// Wenn die Zelle am linken Rand der Map liegt
		else
			gameField[(matLine) - (cellsInLine - 2)][(column) + (cellsInColumn - 2)].clicked();
	}
	
	// oben links
	{
		if(hexatileOnMap(matLine, column - 1)) {
			gameField[matLine][column - 1].clicked();
		} 
		// Wenn die Zelle am oberen Rand der Map liegt
		else if(matLine < (cellsInLine-1)) {
			gameField[matLine+(cellsInColumn/2)][column + ((cellsInColumn/2)-1)].clicked();
		} 
		// Wenn die Zelle am linken Rand der Map liegt
		else if(matLine > cellsInLine-1) {
			gameField[matLine-(cellsInLine-1)][column + (cellsInLine-2)].clicked();
		} 
		// Wenn die Zelle in der linken oberen Ecke der Map liegt
		else {
			gameField[cellsInLine / 2][(cellsInLine / 2) + (cellsInColumn-2)].clicked();
		}
	}
	
	// oben rechts
	{
		if(hexatileOnMap(matLine - 1, column)) {
			gameField[matLine - 1][column].clicked();
		} 
		// Wenn die Zelle am oberen Rand der Map liegt
		else if(column < cellsInLine - 1) {
			gameField[matLine + ((cellsInColumn/2)-1)][column + (cellsInColumn/2)].clicked();
		} 
		// Wenn die Zelle am rechten Rand der Map liegt
		else {
			gameField[matLine + (cellsInLine - 2)][column - (cellsInLine - 1)].clicked();
		}
	}
		
	// rechts
	{
		if(hexatileOnMap(matLine - 1, column + 1))
			gameField[matLine - 1][column + 1].clicked();
		// Wenn die Zelle am rechten Rand der Map liegt
		else
			gameField[(matLine) + (cellsInLine - 2)][(column) - (cellsInColumn - 2)].clicked();
	}
	
	// unten rechts
	{
		if(hexatileOnMap(matLine, column + 1))
			gameField[matLine][column + 1].clicked();
		// Wenn die Zelle am rechten Rand der Map liegt
		else if(matLine + column < (cellsInLine - 1) + (cellsInColumn - 1))
			gameField[matLine + (cellsInLine - 1)][column - (cellsInLine - 2)].clicked();
		// Wenn die Zelle unten rechts in der Ecke der Map liegt
		else if((matLine == (cellsInLine/2) - (cellsInColumn - cellsInLine)))
			gameField[cellsInLine - 1][0].clicked();
		// Wenn die Zelle am unteren Rand der Map liegt
		else
			gameField[matLine - (cellsInColumn/2)][column - ((cellsInColumn - 2) / 2)].clicked();
	}
		
	// unten links
	{
		if(hexatileOnMap(matLine + 1, column))
			gameField[matLine + 1][column].clicked();
		// Wenn die Zelle am unteren Rand der Map liegt
		else if(column >= cellsInColumn/2)
			gameField[matLine - ((cellsInColumn - 2) / 2)][column - (cellsInColumn / 2)].clicked();
		// Wenn die Zelle am linken Rand der Map liegt
		else
			gameField[matLine - (cellsInLine - 2)][column + (cellsInLine - 1)].clicked();
	}
}






/**
 * In dieser Funktion werden alle Minen im direkten Umfeld gezählt relativ zu den übergebenen Hexatile-Koordinaten.
 * Da sich die Hexatile-Koordinaten von den Matrix-Koordinaten unterscheiden, müssen dann erst die Hexatile-Koordinaten
 * in die Matrix-Koordinaten zurückgerechnet werden.
 */
function countSurroundingMines(line, column) {
	// Hier wird gezählt, wieviele Minen es im direkten Umfeld gibt
	var mineCounter = 0;

	// Da sich die Hexatile-Koordinaten und die Matrix-Koordinaten nur in der Zeile unterscheiden, muss nur diese
	// umgerechnet werden.
	var matLine = line + (cellsInLine - 1);
	
	// links
	{
		if(hexatileOnMap(matLine + 1, column - 1)) {
			if(gameField[matLine + 1][column - 1].isMine) {
				mineCounter++;
			}
		} 
		// Wenn die Zelle am linken Rand der Map liegt
		else if (gameField[(matLine) - (cellsInLine - 2)][(column) + (cellsInColumn - 2)].isMine) {
			mineCounter++;
		}
	}
	
	// oben links
	{
		if(hexatileOnMap(matLine, column - 1)) {
			if(gameField[matLine][column - 1].isMine) {
				mineCounter++;
			}
		} 
		// Wenn die Zelle am oberen Rand der Map liegt
		else if(matLine < (cellsInLine-1)) { 
			if(gameField[matLine+(cellsInColumn/2)][column + ((cellsInColumn/2)-1)].isMine) {
				mineCounter++;
			}
		}
		// Wenn die Zelle am linken Rand der Map liegt
		else if(matLine > cellsInLine-1) { 
			if(gameField[matLine-(cellsInLine-1)][column + (cellsInLine-2)].isMine) {
				mineCounter++;
			}
		}
		// Wenn die Zelle oben links in der Ecke der Map liegt
		else { 
			if(gameField[cellsInLine / 2][(cellsInLine / 2) + (cellsInColumn-2)].isMine) {
				mineCounter++;
			}
		}
	}
	
	
	// oben rechts
	{
		if(hexatileOnMap(matLine - 1, column)) { 
			if(gameField[matLine - 1][column].isMine) {
				mineCounter++;			
			}
		}
		// Wenn die Zelle am oberen Rad liegt
		else if(column < cellsInLine - 1) { 
			if(gameField[matLine + ((cellsInColumn/2)-1)][column + (cellsInColumn/2)].isMine) {
				mineCounter++;
			}
		} 
		// Wenn die Zelle am rechten Rand liegt
		else { 
			if(gameField[matLine + (cellsInLine - 2)][column - (cellsInLine - 1)].isMine) {
				mineCounter++;
			}
		}
	}
	
	// rechts
	{
		if(hexatileOnMap(matLine - 1, column + 1)) {
			if(gameField[matLine - 1][column + 1].isMine) {
				mineCounter++;
			}
		}
		// Wenn die Zelle am rechten Rand der Map liegt
		else if(gameField[(matLine) + (cellsInLine - 2)][(column) - (cellsInColumn - 2)].isMine) {
			mineCounter++;
		}
	}
	
	// unten rechts
	{
		if(hexatileOnMap(matLine, column + 1)) { 
			if(gameField[matLine][column + 1].isMine) {
				mineCounter++;
			}
		} 
		// Wenn die Zelle am rechten Rand der Map liegt 
		else if(matLine + column < (cellsInLine - 1) + (cellsInColumn - 1)) {
			if(gameField[matLine + (cellsInLine - 1)][column - (cellsInLine - 2)].isMine) {
				mineCounter++;
			}
		}
		// Wenn die Zelle in der rechten unteren Ecke der Map liegt
		else if((matLine == (cellsInLine/2) - (cellsInColumn - cellsInLine))) {
			if(gameField[cellsInLine - 1][0].isMine) {
				mineCounter++;
			}
		}
		// Wenn die Zelle am unteren Rand liegt
		else {
			if(gameField[matLine - (cellsInColumn/2)][column - ((cellsInColumn - 2) / 2)].isMine) {
				mineCounter++;
			}
		}
	}
	
	// unten links
	{
		if(hexatileOnMap(matLine + 1, column)) { 
			if(gameField[matLine + 1][column].isMine) {
				mineCounter++;				
			}
		}
		// Wenn die Zelle am unteren Rand der Map liegt
		else if(column >= cellsInColumn/2) {
			if(gameField[matLine - ((cellsInColumn - 2) / 2)][column - (cellsInColumn / 2)].isMine) {
				mineCounter++;				
			}
		}
		// Wenn die Zelle am linken Rand der Map liegt
		else {
			if(gameField[matLine - (cellsInLine - 2)][column + (cellsInLine - 1)].isMine) {
				mineCounter++;				
			}
		}
	}

	// Hier wird die Anzahl der gezählten Minen zurück gegeben
	return mineCounter;
}






/**
 * Diese Methode berechnet, ob ein Hexatile überhaupt auf der Map ist.
 * 
 * In der ersten Version bedeutet dies, ob ein Hexatile vollständig auf dem Canvas ist.
 */
function hexatileOnMap(line, column) {
	// Wenn die Koordinaten nichtmal in dem Array liegen, dann liegt das Hexatile eh nicht auf der Map
	if(!coordinatesInArrayRange(line, column))
		return false;

	// oben
	if(line + column < (cellsInLine - 1))
		return false;

	//links
	if(line > column && line - column > (cellsInLine - 1))
		return false;

	//rechts
	if(line < column && line - column < -(cellsInLine-2))
		return false;

	//unten
	if(line + column > ((cellsInLine - 1) + (cellsInColumn - 1)))
		return false;

	// An dieser Stelle ist klar, dass das Hexatile auf der Map liegt
	return true;
}






/**
 * überprüft, ob die Koordinaten im Array Range sind.
 */
function coordinatesInArrayRange(line, column) {
	if(line >=0 && line < arrayDimensionLine && column >= 0 && column < arrayDimensionColumn)
		return true;

	// An dieser Stelle ist klar, dass die Koordinaten nicht im Array Range liegen.
	return false;
}






/**
 * In dieser Funktion wird überprüft, ob der Punkt vp in dem durch vt1, vt2 und vt3 beschriebenen Dreieck liegt
 */
function pointCollidesWithTriangle(vp, vt1, vt2, vt3) {
	//  calculate vector vt1->vt2 (AB)
	var vecAB = vt2.sub(vt1);
	// calculate vector vt1->vt3 (AC)
	var vecAC = vt3.sub(vt1);
	// calculate vector vt1->vp (AP)
	var vecAP = vp.sub(vt1);

	// vecAP = s * vecAB + r * vecAC
	var s = (vecAP.x - ((vecAB.x * vecAP.y) / vecAB.y)) / (vecAC.x - ((vecAB.x * vecAC.y) / vecAB.y));
	var r = (vecAP.y - (s * vecAC.y)) / vecAB.y;

	// conditions for true 0 <= u, 0 <= v, u+v <=1
	if((0 <= r) && (0 <= s) && (r + s <= 1))
		return true;

	// an dieser Stelle ist klar, dass sich der Punkt nicht im Dreieck befindet
	return false;
}






/**
 * Diese Funktion prüft, ob die Zelle mit dem cellVector auf dem canvas liegt
 * 
 * @param Vector cellVector
 * @return Vector, falls die Zelle auf dem canvas ist, sonst null
 */
function correctCellVector(cellVector) {
	
	// Obere linke Ecke des Zellrechteckes
	if (cellVector.x >= 0 && cellVector.x < canvasWidth && cellVector.y >= 0 && cellVector.y < canvasHeight)
		return cellVector;
	
	// Obere rechte Ecke des Zellrechteckes
	var upperRightVector = cellVector.add(new Vector(cellWidth, 0));
	if (upperRightVector.x >= 0 && upperRightVector.x < canvasWidth && upperRightVector.y >= 0 && upperRightVector.y < canvasHeight)
		return cellVector;
	
	// Untere linke Ecke des ZellRechteckes
	var lowerLeftVector = cellVector.add(new Vector(0, cellHeight));
	if (lowerLeftVector.x >= 0 && lowerLeftVector.x < canvasWidth && lowerLeftVector.y >= 0 && lowerLeftVector.y < canvasHeight)
		return cellVector;
	
	// untere rechte Ecke des Zellrechteckes
	var lowerRightVector = cellVector.add(new Vector(cellWidth, cellHeight));
	if (lowerRightVector.x >= 0 && lowerRightVector.x < canvasWidth && lowerRightVector.y >= 0 && lowerRightVector.y < canvasHeight)
		return cellVector;
	
	// An dieser Stelle muss berechnet werden, ob der ZellenVector umgerechnet werden muss
	var maxOffset = getMaxOffset();
	// Wenn die Zell links wieder reinkommen muss
	if (cellVector.x >= (maxOffset.x - cellWidth))
		return correctCellVector(cellVector.sub(new Vector(maxOffset.x, 0)));
	// Wenn die Zelle rechts wieder reinkommen muss
	else if (cellVector.x <= -(maxOffset.x - canvasWidth))
		return correctCellVector(cellVector.add(new Vector(maxOffset.x, 0)));
	
	// Wenn die Zelle oben wieder reinkommen muss
	if (cellVector.y >= (maxOffset.y - cellHeight))
		return correctCellVector(cellVector.sub(new Vector(0, maxOffset.y)));
	// Wenn die Zelle unten wieder reinkommen muss
	else if (cellVector.y <= -(maxOffset.y - canvasHeight))
		return correctCellVector(cellVector.add(new Vector(0, maxOffset.y)));
	
	return null;
}






/**
 * Diese Funktion berechnet den Maximalen Offset anhand der Zellen größe und Anzahl
 * 
 * @returns {Vector} maxOffsetVector
 */
function getMaxOffset() {
	return new Vector(cellWidth*(cellsInLine - 1), (cellHeight * (cellsInColumn/2)) + ((cellHeight / 2) * (cellsInColumn/2)));
}