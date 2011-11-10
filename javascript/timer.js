/**
 * TODO Doku
 */
var Timer = function()
{        
    this.Interval = 1000;    
    this.Enable = new Boolean(false);  
    this.Tick;

    var timerId = 0; 
    var thisObject;
    
    this.Start = function()
    {
        this.Enable = new Boolean(true);

        thisObject = this;
        if (thisObject.Enable)
        {
            thisObject.timerId = setInterval(
            function()
            {
                thisObject.Tick(); 
            }, thisObject.Interval);
        }
    };
    
    this.Stop = function()
    {            
        thisObject.Enable = new Boolean(false);
        clearInterval(thisObject.timerId);
    };

};