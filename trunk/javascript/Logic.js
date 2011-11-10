/**
 * TODO Doku
 */
$(document).ready(function() {
	// Hier wird das Image für die Flaggen geladen
	imageFlag = new Image();
	imageFlag.src = "images/flag.png";

	// Hier wird das Image für die Minen geladen
	imageMine = new Image();
	imageMine.src = "images/mine.png";

	// Hier wird der CSS Style für das canvas angepasst
	$('#canvas').css('width', canvasWidth + 'px');
	$('#canvas').css('height', canvasHeight + 'px');

	// Hier wird der Backgroundbuffer des canvas angepasst
	$('#canvas').attr('height', canvasHeight);
	$('#canvas').attr('width', canvasWidth);

	// Hier wird der New Game Button konfiguriert
	$('#newGame').click(function(e){
		newGame();
	});

	// linksklick am canvas registrieren
	$('#canvas').click(function(e){
		
		// Nur wenn man noch lebt
		if(alive) {
			// Hier werden die Koordinaten des Klick in für das Spiel verwertbare Koordinaten umgewandelt
			clickVector = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop).sub(offsetVector);

			// Hier wird die geklickte Zelle ermittelt und letztenendes wirklich geklickt
			for(var i = 0; i < arrayDimensionLine; i++) {
				for(var j = 0; j < arrayDimensionColumn; j++) {
					if(hexatileOnMap(i,j))
						if(gameField[i][j].collides(clickVector)) {
							gameField[i][j].clicked();
						}
				}
			}

			$('#position').html(clickVector.x +', '+ clickVector.y);

			// Das Spielfeld neu zeichnen
			repaint();

			// prüfen, ob man gewonnen hat. An dieser Stelle kann man nur gewinnen, wenn alle leeren Zellen aufgedeckt wurden
			if(checkVictoryClick()) {
				alive = false;
				alert("Sie haben gewonnen!");
			}
		}

	});

	// rechtsklick am canvas registrieren
	$('#canvas').bind("contextmenu", function(e) {
		
		// Nur wenn man noch lebt
		if(alive) {
			// Hier werden die Koordinaten des Klick in für das Spiel verwertbare Koordinaten umgewandelt
			clickVector = new Vector(e.pageX  - this.offsetLeft, e.pageY - this.offsetTop).sub(offsetVector);

			// Hier wird die gerechtsklickte Zelle ermittelt und markiert
			for(var i = 0; i < arrayDimensionLine; i++) {
				for(var j = 0; j < arrayDimensionColumn; j++) {
					if(hexatileOnMap(i,j))
						if(gameField[i][j].collides(clickVector)) {
							gameField[i][j].toggleMarked();
						}
				}
			}

			$('#position').html(clickVector.x +', '+ clickVector.y);
			
			// das Spielfeld neu zeichnen
			repaint();
			
			// Ermitteln ob man gewonnen hat. An dieser Stelle kann man nur gewinnen, wenn alle Minen markiert wurden
			if(checkVictoryMark()) {
				alive = false;
				alert("Sie haben gewonnen!");
			}
		}

		return false;
	});

	// Den context des canvas laden und in der globalen Variablen ctx ablegen
	var canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	// Ein neues Spiel starten
	newGame();
});






/**
 * Diese Funktion startet ein neues Spiel
 */
function newGame() {
	// Das Spielfeld leeren
	ctx.fillStyle = fsBackground;
	ctx.fillRect(0,0,canvasWidth, canvasHeight);

	alive = true;
	arrayBuild();
	repaint();
}






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
var cellWidth = 50;
/**
 * Die Hšhe des Rechtecks in das die Zelle gezeichnet werden soll
 */
var cellHeight = 50;

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
 * canvasHeight gibt die Hšhe des canvas vor
 */
var canvasHeight = 425;

/**
 * Die Anzahl der Hexatiles in einer visuellen Zeile des Spielfeldes
 */
var cellsInLine;
/**
 * Die Anzahl der Hexatiles in einer visuellen Spalte des Spielfeldes
 */
var cellsInColumn;

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
 * Der Schwierigkeitsgrad
 */
var difficulty = 10;

/**
 * Der canvas kontext
 */
var ctx;

/**
 * true wenn man noch am leben ist, false wenn die Bombe explodiert ist
 */
var alive = true;

/**
 * Es folgen alle ctx fillStyle(fs) und strokeStyle(ss) definitionen
 */
var fsText = "rgb(0,0,0)";
var ssBorder = "rgb(0, 0, 0)";
var fs0Mines = "rgb(255, 255, 255)";
var fs1Mines = "rgb(255, 255, 85)";
var fs2Mines = "rgb(255, 170, 170)";
var fs3Mines = "rgb(255, 170, 0)";
var fs4Mines = "rgb(255, 85, 85)";
var fs5Mines = "rgb(255, 0, 85)";
var fs6Mines = "rgb(255, 0, 0)";
var fsClosed = "rgb(50, 50, 255)";
var fsExplode = "rgb(255,0,0)";
var fsBackground = "rgb(255,255,255)";






/**
 * Diese Funktion berechnet die Dimensionen des Spielfeldes, initialisiert das Array entsprechend und
 * erzeugt die Hexatiles.
 */
function arrayBuild(){
	var cellNumber = 0;
	/*
	 * evtl mšchte man in einer spŠteren Version manuell ein Array definieren, welches eine grš§ere Map
	 * beherbergen kann als das canvas, deswegen gibt es diese beiden Variablen, welche in erster Version
	 * lediglich mit der Dimension des Standard Arrays belegt werden.
	 */
	var arrayColumns;
	var arrayRows;


	// In diesem Block finden die Berechnungen statt, welche die Dimension des Spielfeldes berechnen sollen.
	// In der ersten Version des SPiels soll sich das Spielfeld aus der Grš§e des Canvas ableiten.
	// In spŠteren Versionen soll das Spielfeld auch grš§er gewŠhlt werden kšnnen.
	{
		// Hier wird berechnet, wieviele Hexatiles in die erste Zeile des canvas passen
		cellsInLine = canvasWidth  / cellWidth;

		// Hier wird berechnet, wieviele Hexatiles vertikal auf das canvas passen
		var allCellHeight = 0;

		// Dazu wird jeweils abwechselnd der Durchmesser und die SeitenkantenlŠnge auf eine Variable
		// (allCellHeight) addiert, bis die Hšhe des Canvas erreicht wurde.
		while(canvasHeight > allCellHeight){
			if(cellNumber%2 == 1){
				allCellHeight = allCellHeight + (cellHeight / 2);
			}
			else{
				allCellHeight = allCellHeight + cellHeight;	
			}
			cellNumber++;
		}

		// Bei dieser Berechnungsart ist die Anzahl der Hexatiles in einer Spalte an dieser Stelle bereits berechnet
		cellsInColumn = cellNumber;
		// Die Dimension des Arrays leitet sich aus der Anzahl der Hexatiles in einer Zeile und der Anzahl der Hexatiles in
		// einer Spalte ab.
		arrayDimensionLine = cellsInLine + (Math.round(cellsInColumn / 2) - 1);
		arrayDimensionColumn = arrayDimensionLine;
		// Bei dieser Berechnungsart ist die Matrix quadratisch und deswegen gibt es genausoviele Spalten wie Zeilen
		arrayRows = arrayDimensionLine;
		arrayColumns = arrayDimensionColumn;
	}

	// An dieser Stelle wird das Spielfeld als ein Array mit der berechneten Grš§e definiert
	gameField = new Array(arrayRows);
	// Dann wird jedes Feld des Arrays durchlaufen
	for(var i = 0; i < arrayRows; i++ ){
		// und ebenfalls als Array der berechneten Grš§e definiert
		gameField[i] = new Array(arrayColumns);
		// Anschlie§end werden also alle Spalten der eben erzeugten Zeile durchlaufen 
		for(var j = 0; j < arrayColumns; j++){
			// Und geprŸft, ob die entsprechenden Zelle mit einem Hexatile versehen werden muss.
			if(hexatileOnMap(i,j)) {
				// Wenn ja, dann wird ein Hexatile an der entsprechenden Zelle erzeugt und mit 
				// Koordinaten versehen, welche sich von den Original Koordinaten unterscheiden,
				// jedoch notwendig sind, damit dich die hexatiles resourcenschonend selbst 
				// zeichnen und verwalten kšnnen.
				gameField[i][j] = new Hexatile(i - (cellsInLine - 1),j);
				// In diesem Schritt wird anhand der vorher definierten Schwierigkeit zufŠllig ermittelt,
				// ob es sich bei diesem Hexatile um eine Mine handeln soll, oder nicht.
				gameField[i][j].isMine = ((Math.random() * 101) < difficulty);
			}
		}
	}

}






/**
 * Diese Funktion durchlŠuft das gesamte Array und stš§t das Neuzeichnen jeder einuzelnen Zelle an,
 * wenn sie vorhanden ist.
 */
function repaint(){
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			if(hexatileOnMap(i,j)) {
				gameField[i][j].draw(ctx);
			}
		}
	}
}






/**
 * Diese Funktion überprüft, ob ein Sieg besteht
 */
function checkVictoryClick() {
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			if(hexatileOnMap(i,j))
				if(!gameField[i][j].isOpen && !gameField[i][j].isMine)
						return false;
		}
	}

	return true;
}






/**
 * Diese Funktion überprüft, ob alle Minen markiert wurden
 */
function checkVictoryMark() {
	for(var i = 0; i < arrayDimensionLine; i++) {
		for(var j = 0; j < arrayDimensionColumn; j++) {
			if(hexatileOnMap(i,j))
				if(gameField[i][j].isMine && !gameField[i][j].isMarked)
					return false;
		}
	}
	
	return true;
}






/**
 * Diese Funktion fŸhrt den Klick auf allen Zellen in der unmitelbaren Umgebung der †bergebenen Koordinaten
 * aus. Dabei handelt es sich um die Hexatileeigenen Koordinaten, welche innerhalb dieser Funktion auf
 * die Matrixkoordinaten zurŸckgerechnet werden mŸssen.
 */
function clickSurroundingMines(line, column){
	// Da sich die Hexatile-Koordinaten und die Matrix-Koordinaten nur in der Zeile unterscheiden, muss nur diese
	// umgerechnet werden.
	var matLine = line + (cellsInLine - 1);
	// rechts
	if(hexatileOnMap(matLine + 1, column - 1))
		gameField[matLine + 1][column - 1].clicked();
	// oben links
	if(hexatileOnMap(matLine, column - 1))
		gameField[matLine][column - 1].clicked();
	// oben rechts
	if(hexatileOnMap(matLine - 1, column))
		gameField[matLine - 1][column].clicked();
	// rechts
	if(hexatileOnMap(matLine - 1, column + 1))
		gameField[matLine - 1][column + 1].clicked();
	// unten rechts
	if(hexatileOnMap(matLine, column + 1))
		gameField[matLine][column + 1].clicked();
	// unten links
	if(hexatileOnMap(matLine + 1, column))
		gameField[matLine + 1][column].clicked();
}






/**
 * In dieser Funktion werden alle Minen im direkten Umfeld gezŠhlt relativ zu den †bergebenen Hexatile-Koordinaten.
 * Da sich die Hexatile-Koordinaten von den Matrix-Koordinaten unterscheiden, mŸssen dann erst die Hexatile-Koordinaten
 * in die Matrix-Koordinaten zurŸckgerechnet werden.
 */
function countSurroundingMines(line, column) {
	// Hier wird gezŠhlt, wieviele Minen es im direkten Umfeld gibt
	var mineCounter = 0;

	// Da sich die Hexatile-Koordinaten und die Matrix-Koordinaten nur in der Zeile unterscheiden, muss nur diese
	// umgerechnet werden.
	var matLine = line + (cellsInLine - 1);
	// links
	if(hexatileOnMap(matLine + 1, column - 1) && gameField[matLine + 1][column - 1].isMine)
		mineCounter++;
	// oben links
	if(hexatileOnMap(matLine, column - 1) && gameField[matLine][column - 1].isMine)
		mineCounter++;
	// oben rechts
	if(hexatileOnMap(matLine - 1, column) && gameField[matLine - 1][column].isMine)
		mineCounter++;
	// rechts
	if(hexatileOnMap(matLine - 1, column + 1) && gameField[matLine - 1][column + 1].isMine)
		mineCounter++;
	// unten rechts
	if(hexatileOnMap(matLine, column + 1) && gameField[matLine][column + 1].isMine)
		mineCounter++;
	// unten links
	if(hexatileOnMap(matLine + 1, column) && gameField[matLine + 1][column].isMine)
		mineCounter++;

	// Hier wird die Anzahl der gezŠhlten Minen zurŸck gegeben
	return mineCounter;
}






/**
 * Diese Methode berechnet, ob ein Hexatile Ÿberhaupt auf der Map ist.
 * 
 * In der ersten Version bedeutet dies, ob ein Hexatile vollstŠndig auf dem Canvas ist.
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
	if(line < column && line - column < -(cellsInLine - 1))
		return false;

	//unten
	if(line + column > ((cellsInLine - 1) + (cellsInColumn - 1)))
		return false;

	// An dieser Stelle ist klar, dass das Hexatile auf der Map liegt
	return true;
}






/**
 * †berprŸft, ob die Koordinaten im Array Range sind.
 */
function coordinatesInArrayRange(line, column) {
	if(line >=0 && line < arrayDimensionLine && column >= 0 && column < arrayDimensionColumn)
		return true;

	// An dieser Stelle ist klar, dass die Koordinaten nicht im Array Range liegen.
	return false;
}






/**
 * In dieser Funktion wird ŸberprŸft, ob der Punkt vp in dem durch vt1, vt2 und vt3 beschriebenen Dreieck befindet
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
 * Die Klasse Hexatile
 * 
 * TODO Doku
 */
function Hexatile(line, column) {

	/**
	 * Gibt die Zeile in einer logischen Matrix wieder
	 */
	this.line = line;

	/**
	 * Gibt die Spalte in einer logischen Matrix wieder
	 */
	this.column = column;

	/**
	 * Sobald das Hexatile geklickt wurde wird in dieser Variablen gespeichert, wieviele umgebende Minen es gibt
	 */
	this.surroundingMines = 0;

	/**
	 * Wenn true, dann ist diese Zelle eine Mine, sonst false
	 */
	this.isMine = false;

	/**
	 * Wenn true, dann wurde dieses Feld bereits aufgedeckt, sonst false
	 */
	this.isOpen = false;

	/**
	 * Wenn die Zelle markiert wurde, dann ist diese Flag gesetzt
	 */
	this.isMarked = false;

	/**
	 * Diese Funktion switched das isMarked Flag
	 */
	this.toggleMarked = function() {
		if(this.isOpen)
			return;

		this.isMarked = !this.isMarked;
		this.draw(ctx);
	};

	/**
	 * Zeichnet die Zelle
	 */
	this.draw = function(ctx) {
		var topMargin = cellHeight / 4;

		// In diesen Zeilen wird die Position der Zelle berechnet
		var currentLine = lineVector.mult(this.line);
		var currentColumn = columnVector.mult(this.column);
		var relativeCellVector = currentLine.add(currentColumn);
		var cellVector = offsetVector.add(relativeCellVector);

		if(this.isOpen == false) {
			// Hier wird die Hintergrundfare eines unaufgedeckten Hexagon gesetzt
			ctx.fillStyle = fsClosed;

		} else if(this.isOpen == true && this.isMine == false) {

			// In diesen Zeilen wird abhŠngig von der Anzahl der Nachbarminen die Hintergrundfarbe des Hexagon gesetzt
			if(this.surroundingMines == 0)
				ctx.fillStyle = fs0Mines;
			if(this.surroundingMines == 1)
				ctx.fillStyle = fs1Mines;
			if(this.surroundingMines == 2)
				ctx.fillStyle = fs2Mines;
			if(this.surroundingMines == 3)
				ctx.fillStyle = fs3Mines;
			if(this.surroundingMines == 4)
				ctx.fillStyle = fs4Mines;
			if(this.surroundingMines == 5)
				ctx.fillStyle = fs5Mines;
			if(this.surroundingMines == 6)
				ctx.fillStyle = fs6Mines;

		} else if(this.isOpen && this.isMine) {
			// Wenn dies eine Mine ist und sie angeklickt wurde, soll sichtbar sein, durch welche Mine man gestorben ist
			ctx.fillStyle = fsExplode;
		}

		// Hier wird die Bordr Farbe und die Border dicke gesetzt.
		ctx.strokeStyle = ssBorder;
		ctx.lineWidth = 1;

		// In den folgenden Zeilen wird das Hexagon gezeichnet
		ctx.beginPath();
		ctx.moveTo(cellVector.x + cellWidth/2, cellVector.y);
		ctx.lineTo(cellVector.x + cellWidth, cellVector.y + topMargin);
		ctx.lineTo(cellVector.x + cellWidth, cellVector.y + (cellHeight - topMargin));
		ctx.lineTo(cellVector.x + cellWidth/2, cellVector.y + cellHeight);
		ctx.lineTo(cellVector.x + 0, cellVector.y + (cellHeight - topMargin));
		ctx.lineTo(cellVector.x + 0, cellVector.y + topMargin);
		ctx.lineTo(cellVector.x + cellWidth/2, cellVector.y);
		ctx.fill();
		ctx.stroke();

		if(!alive && this.isMine) {
			// Wenn man tot ist, dann sollen alle Minen gezeichnet werden
			ctx.drawImage(imageMine, cellVector.x, cellVector.y);
		}

		// Hier wird die Zelle markiert, wenn dies der Fall ist
		if(this.isMarked) {
			// Wenn ein Hexatile markiert ist, soll es eine Flagge bekommen
			ctx.drawImage(imageFlag, cellVector.x, cellVector.y - (cellHeight / 10));
		}
		// Hier wird das Hexatile mit einer Zahl versehen, sollte es aufgedeckt sein, keine 
		// Mine enthalten und mindestens eine Mine als Nachbarn habn.
		else if(this.isOpen && (!this.isMine) && this.surroundingMines > 0) {
			// TODO schšner machen
			ctx.fillStyle = fsText;
			ctx.fillText(this.surroundingMines, cellVector.x + (cellWidth/2), cellVector.y+(cellHeight/2));
		}

	};

	/**
	 * Wird ausgefŸhrt, wenn auf die Zelle geklickt wurde
	 */
	this.clicked = function() {
		// Wenn die Zelle bereits angeklickt wurde, dann muss nichts gemacht werden
		if (this.isOpen)
			return;

		// Wenn die Zelle markiert ist, dann soll sie nicht reagieren
		if (this.isMarked)
			return;

		// Da die Zelle geklickt wurde, ist sie jetzt aufgedeckt
		this.isOpen = true;

		// Wenn die Zelle eine Mine ist, dann ...
		if(this.isMine) {
			// ... wird diese jetzt explodieren
			// TODO explodierende Mine? verlust sihchtbar darstellen 

			alive = false;
			repaint();
			
			alert('Sie haben verloren!');
			return;
		} 

		// Wenn die Zelle keine Mine ist, dann ...
		this.surroundingMines = countSurroundingMines(this.line, this.column);

		// Wenn es keine Nachbarminen gibt, mŸssen ale Nachbarzellen geklickt werden
		if (this.surroundingMines == 0) {
			clickSurroundingMines(this.line, this.column);
		}

	};

	/**
	 * Gibt einen String zurŸck, welcher die Daten der Zelle textuell wiedergibt
	 */
	this.toString = function() {
		//TODO generate and return nice string
	};

	/**
	 * Diese Funktion berechnet, ob ein vorhergegangener Klick auf der Zelle stattgefunden hat.
	 */
	this.collides = function(vector) {
		var cellVector = offsetVector.add(lineVector.mult(line).add(columnVector.mult(column)));

		if(vector.x > cellVector.x && vector.x < (cellVector.x + cellWidth) &&
				vector.y > cellVector.y && vector.y < (cellVector.y + cellHeight)) {

			/**
			 * Im folgenden wird ŸberprŸft, ob der Klick in einem der vier au§erhalb des Hexagon liegenden
			 * Dreiecke gelandet ist. Wenn ja, dann wurde das Hexagon nicht getroffen.
			 */
			// oben links
			if(pointCollidesWithTriangle(vector, 
					new Vector(cellVector.x, cellVector.y + (cellHeight / 4)),
					cellVector, 
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y)))
				return false;
			// oben rechts
			if(pointCollidesWithTriangle(vector,
					new Vector(cellVector.x + cellWidth, cellVector.y + (cellHeight / 4)),
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y), 
					new Vector(cellVector.x + cellWidth, cellVector.y)))
				return false;
			// unten rechts
			if(pointCollidesWithTriangle(vector,
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y + cellHeight), 
					new Vector(cellVector.x + cellWidth, cellVector.y + (cellHeight - (cellHeight / 4))),
					new Vector(cellVector.x + cellWidth, cellVector.y + cellHeight)))
				return false;
			// unten links
			if(pointCollidesWithTriangle(vector,
					new Vector(cellVector.x, cellVector.y + cellHeight), 
					new Vector(cellVector.x, cellVector.y + (cellHeight - (cellHeight / 4))),
					new Vector(cellVector.x + (cellWidth / 2), cellVector.y + cellHeight)))
				return false;

			return true;
		}

		return false;
	};
}






