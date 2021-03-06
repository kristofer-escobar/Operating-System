/* ------------
   Control.js

   Requires global.js.
   
   Routines for the hardware simulation, NOT for our client OS itself. In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document envorinment inside a browser is the "bare metal" (so to speak) for which we write code that
   hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using JavaScript in
   both the host and client environments.
   
   This (and other host/simulation scripts) is the only place that we should see "web" code, like
   DOM manipulation and JavaScript event handling, and so on.  (Index.html is the only place for markup.)
   
   This code references page numbers in the text book:
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


//
// Control Services
//
function simInit()
{
	// Get a global reference to the canvas.  TODO: Move this stuff into a Display Device Driver, maybe?
	CANVAS  = document.getElementById('display');
	// Get a global reference to the drawing context.
	DRAWING_CONTEXT = CANVAS.getContext('2d');
	// Enable the added-in canvas text functions (see canvastext.js for provenance and details).
	CanvasTextFunctions.enable(DRAWING_CONTEXT);
	// Clear the log text box.
	document.getElementById("taLog").value="";
	// Set focus on the start button.
   document.getElementById("btnStartOS").focus();     // TODO: This does not seem to work.  Why?

}

function simLog(msg, source)
{
    // Check the source.
    if (!source)
    {
        source = "?";
    }

    // Note the OS CLOCK.
    var clock = _OSclock;

    // Note the REAL clock in milliseconds since January 1, 1970.
    var now = new Date().getTime();

    // Build the log string.
    var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";
    // WAS: var str = "[" + clock   + "]," + "[" + now    + "]," + "[" + source + "]," +"[" + msg    + "]"  + "\n";

    // Update the log console.
    taLog = document.getElementById("taLog");
    taLog.value = str + taLog.value;
    // Optionally udpate a log database or some streaming service.
}


//
// Control Events
//
function simBtnStartOS_click(btn)
{
    // Disable the start button...
    btn.disabled = true;
    
    // .. enable the Emergency Halt and Reset buttons ...
    document.getElementById("btnHaltOS").disabled = false;
    document.getElementById("btnReset").disabled = false;
    document.getElementById("btnStep").disabled = false;
    
    // .. set focus on the OS console display ...
    document.getElementById("display").focus();
    
    // ... Create and initialize the CPU ...
    _CPU = new cpu();
    _CPU.init();

    // ... then set the clock pulse simulation to call ?????????.
    hardwareClockID = setInterval(simClockPulse, CPU_CLOCK_INTERVAL);

    // .. and call the OS Kernel Bootstrap routine.
    krnBootstrap();

}

function simBtnHaltOS_click(btn)
{
    simLog("emergency halt", "host");
    simLog("Attempting Kernel shutdown.", "host");
    // Call the OS sutdown routine.
    krnShutdown();
    // Stop the JavaScript interval that's simulating our clock pulse.
    clearInterval(hardwareClockID);
    // TODO: Is there anything else we need to do here?
}

function simBtnReset_click(btn)
{
    // The easiest and most thorough way to do this is to reload (not refresh) the document.
    location.reload(true);
    // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
    // be reloaded from the server. If it is false or not specified, the browser may reload the
    // page from its cache, which is not what we want.
}

function simBtnStep_click(btn)
{
  //alert("hello");
  if(_CPU.isExecuting == true)
    _CPU.isExecuting = false;
  else
    _CPU.isExecuting = true;
}

function blueScreenOfDeath(error)
{
  // Make canvas blue.
  DRAWING_CONTEXT.fillStyle="#0000FF";
  DRAWING_CONTEXT.fillRect(0,0, 500, 500 );
  
  // Write out an error message.
  var errorMsg = "A problem has been detected   and Kris OS has been shutdown to prevent damage to your     computer." + "                                                                                 " + "Error: " + error;

// Format Message on canvas.
var x = 0;
var y = 30;
  for(i = 0; i < errorMsg.length; i++)
{
  DRAWING_CONTEXT.drawText(DEFAULT_FONT, DEFAULT_FONT_SIZE, x, y , errorMsg[i] );
  x += 13;

  if ( x > 389)
    {
      x = 0;
      y +=16;
    }
}
  // Stop the OS.
  document.getElementById('btnHaltOS').click();

}
