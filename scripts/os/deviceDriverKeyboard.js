/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.
function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";

    // Blue screen of death test.
    if(keyCode == 27) // Escape key
    {
        blueScreenOfDeath("keyCode: " + keyCode);
    }


    // Check for backspace.
    if(keyCode == 8) // Backspace
    {
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr);
    }

    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);
    }
    // Check for punctuation.
    else if (keyCode >= 186 && keyCode <= 222)
        {
            if(!isShifted)
            {
                switch (keyCode)
                {
                    case 222: // "'"
                    keyCode = 39;
                    break;
                    case 220: // "\"
                    keyCode = 92;
                    break;
                    case 221: // "]"
                    keyCode = 93;
                    break;
                    case 219: // "["
                    keyCode = 91;
                    break;
                    case 187: // "="
                    keyCode = 61;
                    break;
                    case 189: // "-"
                    keyCode = 45;
                    break;
                    case 192: // "`"
                    keyCode = 96;
                    break;
                    case 186: // ";"
                    keyCode = 59;
                    break;
                    case 190: // "."
                    keyCode = 46;
                    break;
                    case 188: // "<"
                    keyCode = 44;
                    break;
                    case 191: // "/"
                    keyCode = 47;
                    break;

                    default:
                }
            }

            // For Testing Purposes.
            // alert(keyCode);

            // ... then check the shift key and re-adjust if necessary.
            if (isShifted)
            {
                switch (keyCode)
                {
                    case 222: // """
                    keyCode = 34;
                    break;
                    case 220: // "|"
                    keyCode = 124;
                    break;
                    case 221: // "}"
                    keyCode = 125;
                    break;
                    case 219: // "{"
                    keyCode = 123;
                    break;
                    case 187: // "+"
                    keyCode = 43;
                    break;
                    case 189: // "_"
                    keyCode = 95;
                    break;
                    case 192: // "~"
                    keyCode = 126;
                    break;
                    case 186: // ":"
                    keyCode = 58;
                    break;
                    case 190: // ">"
                    keyCode = 62;
                    break;
                    case 188: // ","
                    keyCode = 60;
                    break;
                    case 191: // "?"
                    keycode = 63;
                    break;

                    default:
                }
            }
            chr = String.fromCharCode(keyCode);
            // TODO: Check for caps-lock and handle as shifted if so.
            _KernelInputQueue.enqueue(chr);
        }
        else if ( ((keyCode >= 48) && (keyCode <= 57)) ||   // digits
        (keyCode == 32)                     ||   // space
        (keyCode == 13) )                        // enter
        {
            // Handle Symbols on number keys when shift is held down.
            if(isShifted)
            {
                switch (keyCode)
                {
                    case 48: // ")"
                    keyCode = 41;
                    break;
                    case 49: // "!"
                    keyCode = 33;
                    break;
                    case 50: // "@"
                    keyCode = 64;
                    break;
                    case 51: // "#"
                    keyCode = 35;
                    break;
                    case 52: // "$"
                    keyCode = 36;
                    break;
                    case 53: // "%"
                    keyCode = 37;
                    break;
                    case 54: // "^"
                    keyCode = 94;
                    break;
                    case 55: // "&"
                    keyCode = 38;
                    break;
                    case 56: // "*"
                    keyCode = 42;
                    break;
                    case 57: // "("
                    keyCode = 40;
                    break;

                    default:

                }

            }

            chr = String.fromCharCode(keyCode);
            _KernelInputQueue.enqueue(chr);
        }
    }

// Removes Character from input buffer.
function backspaceDetected()
{
    // If buffer contains a character and a backspace detected.
    if (_StdIn.buffer.length > 0)
        {
            // Remove the last character from the buffer.
            _StdIn.buffer = _StdIn.buffer.substring(0, _StdIn.buffer.length - 1);

        }
        
}

