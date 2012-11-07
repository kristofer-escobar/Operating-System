/* --------
   Utils.js

   Utility functions.
   -------- */

function trim(str)      // Use a regular expression to remove leading and trailing spaces.
{
	return str.replace(/^\s+ | \s+$/g, "");
    /*
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
    - "\s+$" is the same thing, but at the end of the string.
    - "g" makes is global, so we get all the whitespace.
    - "" is nothing, which is what we replace the whitespace with.
	*/
	
}

function rot13(str)     // An easy-to understand implementation of the famous and common Rot13 obfuscator.
{                       // You can do this in three lines with a complex regular experssion, but I'd have
    var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.
    for (var i in str)
    {
        var ch = str[i];
        var code = 0;
        if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0)
        {
                    code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
            retVal = retVal + String.fromCharCode(code);
        }
        else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0)
        {
            code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
            retVal = retVal + String.fromCharCode(code);
        }
        else
        {
            retVal = retVal + ch;
        }
    }
    return retVal;
}

// Function to return today's date.
function getDateTime()
{
    var dateTime = new Date();

    dateTime =
    (dateTime.getMonth()+1)  + '/' +
    (dateTime.getDate())     + '/' +
    (dateTime.getFullYear()) + ' ' +
    (dateTime.getHours())    + ':' +
    (dateTime.getMinutes())  + ':' +
    (dateTime.getSeconds());
    
    return dateTime;
}

// Function to get the user's current location.
function getLocation()
{
    //TODO: Return the user's current location.
    var retVal = "User's Current Location";

    return retVal;
}

// The function which saves a restore points.
function saveRestorePoint(str)
{
    // add str to array.
    restorePoints.push(str);
}

// Function to restore the canvas from a restore point.
function undoDrawOnCanvas(font,size,x,y)
{
    // If we have some restore points.
    if (restorePoints.length > 0)
    {
        // Get previous character.
        var txt = restorePoints.pop();

        // Get width of previous character.
        var offset = DRAWING_CONTEXT.measureText(font, size, txt);

        // Return to previous x position.
        x = x - offset;

        // Get the height of the previous character.
        var heightOffset = DRAWING_CONTEXT.fontAscent(font, size, txt)  + DRAWING_CONTEXT.fontDescent(font, size, txt);

        // Set the color.
        DRAWING_CONTEXT.fillStyle="#000000";

        // Draw over the previous character.
        DRAWING_CONTEXT.fillRect(x, y - DEFAULT_FONT_SIZE, offset, heightOffset);

        // Return width of pervious character for cursor adjustment.
        return offset;
}
}

// Function to display the current time.
function getCurentTime()
{
// Call timer every second to update time.
setInterval(function(){timer();},1000);
}

// Function to get the current time.
function timer()
{
var d = new Date();
var t = d.toLocaleTimeString();
document.getElementById("time").innerHTML=t;
}

// Function to set the status.
function setStatus(status)
{
    document.getElementById("status").innerHTML = status;
}

// Gets program.
function getUserProgram()
{
    // Get the element that holds the 6502 prorgram.
    return document.getElementById("input6502").value;
}

// Function to check for a valid program.
function validateProgram(instructions)
{
    for(i = 0; i < instructions.length; i++)
    {
        // Get individual instructions.
        var instr = instructions[i].toUpperCase();

        // Check for invalid size instruction.
        if (instr.length > 2 || instr.length < 2)
        {
            _StdIn.putText("Error: Instructions can only be 2 chars long.");
            return false;
        }

        // TODO: execute instruction
        // TODO: make sure args are hexidecimal numbers
        var noArgs = ["EA", "00", "FF"];

        var oneArg = ["A9", "A2", "A0", "D0"];

        var twoArgs = ["AD", "8D", "6D", "AE", "AC", "EC", "EE"];

        if(contains(noArgs, instr))
        {
            //alert(instr + " contains no args");
        }
        else if(contains(oneArg, instr))
        {
            //alert(instr + " contains one args");
            i++;
        }
        else if(contains(twoArgs, instr))
        {
            //alert(instr + " contains two args");
            i += 2;
        }
        else
        {
            // Error.
            //_StdIn.putText("Error: Unknown op code: " + instr);
            //return false;
        }

    }

    return true;
}

// Function to check if instruction is contained in a collection.
function contains(collection, instruction)
{
    if (collection.indexOf(instruction) != -1)
        return true;
    else
        return false;
}

// Function to load the user program with a default program.
function loadDefaultProgram()
{
    // Set default program.
    document.getElementById("input6502").value = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 EA EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 EA 00";

}
