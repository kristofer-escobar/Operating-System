/* --------
   Utils.js

   Utility functions.
   -------- */
   
// Function to pad a string.
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
 
function pad(str, len, pad, dir) {
 
    if (typeof(len) == "undefined") { var len = 0; }
    if (typeof(pad) == "undefined") { var pad = ' '; }
    if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }
 
    if (len + 1 >= str.length) {
 
        switch (dir){
 
            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
            break;
 
            case STR_PAD_BOTH:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
            break;
 
            default:
                str = str + Array(len + 1 - str.length).join(pad);
            break;
 
        } // switch
 
    }
 
    return str;
 
}

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

        // Check for invalid instruction size.
        if (instr.length > 2 || instr.length < 2)
        {
            _StdIn.putText("Error: Instructions can only be 2 chars long.");
            return false;
        }

        // var noArgs = ["EA", "00", "FF"];

        // var oneArg = ["A9", "A2", "A0", "D0"];

        // var twoArgs = ["AD", "8D", "6D", "AE", "AC", "EC", "EE"];

        // var firstParam = instructions[i + 1].toUpperCase();

        // var secondParam = instructions[i + 2].toUpperCase();

        // // Check for invalid op codes.
        // if(contains(oneArg,instr))
        // {
        //     // If the following instruction is a op code throw error.
        //     if(contains(opCodes, firstParam) && secondParam != "00")
        //     {
        //         _StdIn.putText("Error: " + instr + " requires one parameter.");
        //         return false;
        //     }
        //     // instr = instructions[i + 1].toUpperCase();
        //     i++;
        // }
        // else if(contains(twoArgs,instr))
        // {
        //     if(contains(opCodes, firstParam) && firstParam != "00")
        //     {
        //         _StdIn.putText("Error: " + instr + " requires two parameters.");
        //         return false;
        //     }

        //     if(contains(opCodes, secondParam) && secondParam != "00")
        //     {
        //         _StdIn.putText("Error: " + instr + " requires two parameters." + secondParam);
        //         return false;
        //     }
        //     // instr = instructions[i + 2].toUpperCase();
        //     i = i + 2;
        // }
        // else
        // {
        //     if(!contains(opCodes,instr))
        //         _StdIn.putText("Error: Unknown op code: " + instr);


        //     return false;
        // }

        // if(contains(noArgs, instr))
        // {
        //     // if the next instr is not an op code, then throw an error.
        //     if(!contains(opCodes, firstParam))
        //         return false;
        // }

        // // Check for instructions that take one parameter.
        // if(contains(oneArg, instr))
        // {
        //     // If the following instruction is a op code throw error.
        //     if(contains(opCodes, firstParam))
        //     {
        //         _StdIn.putText("Error: " + instr + " requires one parameter.");
        //         return false;
        //     }

        // }
        // // check for instruction that take two parameters.
        // else if(contains(twoArgs, instr))
        // {
        //     if(contains(opCodes, firstParam))
        //     {
        //         _StdIn.putText("Error: " + instr + " requires two parameters.");
        //         return false;
        //     }

        //     if(contains(opCodes, secondParam))
        //     {
        //         _StdIn.putText("Error: " + instr + " requires two parameters.");
        //         return false;
        //     }

        // }

    }

    return true;
}

// Function to check if instruction is contained in a collection.
function contains(collection, instruction)
{
    //alert(collection);
    //alert("index "+collection.indexOf(instruction.toUpperCase().trim()));
    if(collection.indexOf(instruction) != -1)
    {
        //alert("index " + collection.indexOf(instruction));
        return true;
    }
    else
    {
        return false;
    }
        
}

// Function to load the user program with a default program.
function loadDefaultProgram()
{
    // Set default program 1
    document.getElementById("input6502").value = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 EA EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 EA 00";
    // default  program 2
    //document.getElementById("input6502").value = "A9 00 8D 00 00 A9 00 8D 4B 00 A9 00 8D 4B 00 A2 03 EC 4B 00 D0 07 A2 01 EC 00 00 D0 05 A2 00 EC 00 00 D0 26 A0 4C A2 02 FF AC 4B 00 A2 01 FF A9 01 6D 4B 00 8D 4B 00 A2 02 EC 4B 00 D0 05 A0 55 A2 02 FF A2 01 EC 00 00 D0 C5 00 00 63 6F 75 6E 74 69 6E 67 00 68 65 6C 6C 6F 20 77 6F 72 6C 64 00";
    // default program 3
    //document.getElementById("input6502").value = "A9 00 8D 00 00 A9 00 8D 3B 00 A9 01 8D 3B 00 A9 00 8D 3C 00 A9 02 8D 3C 00 A9 01 6D 3B 00 8D 3B 00 A9 03 6D 3C 00 8D 3C 00 AC 3B 00 A2 01 FF A0 3D A2 02 FF AC 3C 00 A2 01 FF 00 00 00 20 61 6E 64 20 00";

}
