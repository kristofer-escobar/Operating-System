/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) or interpreter for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell()
{
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit()
{
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;

    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;

    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays the user's current location.";
    sc.function = shellWhereAmI;
    this.commandList[this.commandList.length] = sc;

    // status
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "-  Change the status.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;

    // add
    sc = new ShellCommand();
    sc.command = "add";
    sc.description = "- Calculates the sum of two numbers.";
    sc.function = shellAdd;
    this.commandList[this.commandList.length] = sc;

    // sub
    sc = new ShellCommand();
    sc.command = "sub";
    sc.description = "- Calculates the difference of two numbers.";
    sc.function = shellSub;
    this.commandList[this.commandList.length] = sc;

    // mul
    sc = new ShellCommand();
    sc.command = "mul";
    sc.description = "- Calculates the product of two numbers.";
    sc.function = shellMul;
    this.commandList[this.commandList.length] = sc;

    // div
    sc = new ShellCommand();
    sc.command = "div";
    sc.description = "- Calculates the quotient of two numbers.";
    sc.function = shellDiv;
    this.commandList[this.commandList.length] = sc;

    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Load in a user program.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;

    // run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "- Run a loaded user program.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;

    // run all
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Run all loaded user programs.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;
    
    // quantum
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "- Set Round Robin quantum.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;

    // kill
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "- Kill a running process.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;

    // display
    sc = new ShellCommand();
    sc.command = "display";
    sc.description = "- Display all running processes.";
    sc.function = shellDisplay;
    this.commandList[this.commandList.length] = sc;

    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursosr position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    //
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // Javascript may not support associative arrays (one of the few nice features of PHP, actually)
    // so we have to iterate over the command list in attempt to find a match.  TODO: Is there a better way?
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apoligies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}


function shellParseInput(buffer)
{
    var retVal = new UserCommand();
    //
    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);
    // 2. Lower-case it.
    buffer = buffer.toLowerCase();
    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");
    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in Javascript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;
    //
    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}


function shellExecute(fn, args)
{
    // we just got a command, so advance the line...
    _StdIn.advanceLine();
    // .. call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately),
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect Javascript, we'd be
// able to make then private.  (Actually, we can. Someone look at Crockford's stuff and give me the details, please.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
    _StdIn.putText("Okay. I forgive you. This time.");
    _SarcasticMode = false;
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " Version: " + APP_VERSION);
}

// Shell command to display the current date.
function shellDate(args)
{
    _StdIn.putText("Date: " + getDateTime());
}

// Shell command to return the user's current location.
function shellWhereAmI(args)
{
    _StdIn.putText("Location: " + getLocation());
}

// Shell command to change the status.
function shellStatus(args)
{
    if (args.length > 2)
    {
        _StdIn.putText("Status command only takes in one argument.");
    }
    else
    {
        // Change/Set Status.
        setStatus(args[0]);
    }
    
}

// Shell command to return sum of two numbers.
function shellAdd(args)
{
    var retVal;

    if(args.length > 2)
    {
    // Error message.
    retVal = "Error: Can only add two numbers.";
    }
    else
    {
    // Add the first two arguments.
    retVal = (parseInt(args[0], 10) + parseInt(args[1], 10)).toString();
    }

    _StdIn.putText(retVal);

}

// Shell command to return difference of two numbers.
function shellSub(args)
{
    var retVal;

    if(args.length > 2)
    {
    // Error message.
    retVal = "Error: Can only subtract two numbers.";
    }
    else
    {
    // Subtract the first two arguments.
    retVal = (parseInt(args[0],10) - parseInt(args[1],10)).toString();
    }

    _StdIn.putText(retVal);

}

// Shell command to return product of two numbers.
function shellMul(args)
{
    var retVal;

    if(args.length > 2)
    {
    // Error message.
    retVal = "Error: Can only multiply two numbers.";
    }
    else
    {
    // Multiply the first two arguments.
    retVal = (parseInt(args[0], 10) * parseInt(args[1], 10)).toString();
    }

    _StdIn.putText(retVal);

}

// Shell command to return quotient of two numbers.
function shellDiv(args)
{
    var retVal;

    if(args.length > 2)
    {
    // Error message.
    retVal = "Error: Can only divide two numbers.";
    }
    else
    {
    // Divide the first two arguments.
    retVal = (parseInt(args[0], 10) / parseInt(args[1], 10)).toString();
    }

    _StdIn.putText(retVal);

}

// Shell command to load user program.
function shellLoad(args)
{
    if(args.length > 0)
    {
        _StdIn.putText("Error: Load command does not take parameters.");
    }
    else
    {
        // Call kernel to load routine.
        krnLoadProgram();
    }


}

// Shell command to run user program.
function shellRun(pid)
{
    if(pid.length > 0)
    {
        if(residentQueue[pid] !== undefined)
        {
            // Call kenel to run program.
            krnRunProgram(pid);
        }
        else
        {
            _StdIn.putText("Error: No process loaded with pid:" + pid );
        }

    }
    else
    {
        _StdIn.putText("Error: No pid specified.");
    }

}

// Shell command to run user program.
function shellRunAll(pid)
{
    if(pid.length > 0)
    {
        _StdIn.putText("Error: runall command takes no arguments.");
    }
    else
    {
        if(residentPrograms.length > 0)
        {
            // Call kenel to run all programs.
            for(i = 0; i < residentPrograms.length; i++)
            {
                krnRunProgram(residentPrograms[i].pid);
            }
        }
        else
        {
            _StdIn.putText("Error: No programs loaded.");
        }
    }

}

// Shell command to set the round robin quantum.
function shellQuantum(quantum)
{
    // TODO: Set the global variable that keeps track of the quantum.
    userQuantum = quantum;
}

// Shell command to kill a process.
function shellKill(pid)
{
    // TODO: Place process on resident queue. Take off of ready queue.
    killFlag = true;
    processToKill = pid;
}

function shellDisplay()
{
    if(readyQueue.isEmpty())
    {
        _StdIn.putText("No running processes.");
    }
    else
    {
        //TODO: Display the PID's of all running processes.
        for(i = 0; i < readyQueue.getSize(); i++)
        {
            // Display pid.
            _StdIn.putText(readyQueue.q[i].pid + " ");

        }

        if(_CPU.isExecuting)
            _StdIn.putText(" " + currentPCB.pid);
    }

}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernal shutdown routine.
    krnShutdown();
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help":
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on":
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off":
                _Trace = false;
                _StdIn.putText("Trace OFF");
                break;
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}
