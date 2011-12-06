/**
 * Die Klasse Timer
 * 
 * Diese Klasse repräsentiert einen Timer, welcher in einem vordefinierten
 * Zeitintervall eine definierbare Fuktion ausführt.
 */
var Timer = function()
{   
	/**
	 * Der Interval in der die Zeit hochgezählt wird default: 1000(ms) = 1 Sekunde
	 */
    this.Interval = 1000;
    
    /**
     * Wenn true, dann ist der Timer aktiv. Wird dieser gestoppt ist der Wert false.
     */
    this.Enable = new Boolean(false);
    
    /**
     * Enthält eine Funktion die pro Interval aufgerufen wird.
     */
    this.Tick;
    
    /**
     * Enthält die Methode setInterval um diese später über ein clearInterval zu stoppen.
     */
    var timerId = 0;
    
    /**
     * Enthält den Timer.
     */
    var thisObject;
    
    /**
     * Diese Funktion startet den Timer.
     */
    this.Start = function()
    {
    	// Enable wird auf true gesetzt, der Timer gilt nun als aktiv
        this.Enable = new Boolean(true);

        // Der Timer wird in thisObject geschrieben 
        thisObject = this;
        
        /**
         * Wenn der Timer aktiv ist wird setInterval mit der Funktion Tick() und 
         * dem Interval gestartet und in timerId geschrieben. 
         */
        if (thisObject.Enable)
        {
            timerId = setInterval(
            function()
            {
                thisObject.Tick(); 
            }, thisObject.Interval);
        }
    };
    
    /**
     * Diese Funktion stoppt den Timer.
     */
    this.Stop = function()
    {   
    	// Enable wird auf false gesetzt und gilt somit nicht mehr als aktiv
        thisObject.Enable = new Boolean(false);
        /**
         * Mittels clearInterval und der in timerId gesetzten setInterval methode 
         * wird die Intervalschleife unterbrochen.
         */ 
        clearInterval(timerId);
    };

};