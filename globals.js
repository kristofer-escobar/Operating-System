/* ------------
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation.)
   
   This code references page numbers in the text book:
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global Constants
//
var APP_NAME = "Kris OS";  // 'cause I was at a loss for a better name.
var APP_VERSION = "1.0";

var CPU_CLOCK_INTERVAL = 100;   // in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ    = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                       // NOTE: The timer is different from hardware clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

//
// Global Variables
//
var _CPU = null;

var _OSclock = 0;       // Page 23.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var currentBase = 0;

var currentLimit = 0;

var currentOffset = 0;

// TODO: Fix the naming convention for these next five global vars.
var CANVAS = null;              // Initialized in hostInit().
var DRAWING_CONTEXT = null;     // Initialized in hostInit().
var DEFAULT_FONT = "sans";      // Ignored, just a place-holder in this version.
var DEFAULT_FONT_SIZE = 13;
var FONT_HEIGHT_MARGIN = 4;     // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

//
// Global Device Driver Objects - page 12
//
var krnKeyboardDriver = null;

// This array will store the restoration points of the canvas
var restorePoints = [];

// Valid 6502 Instructions.
var opCodes = ["A9", "AD", "8D", "6D", "A2", "AE", "A0", "AC", "EA", "00", "EC", "D0", "EE", "FF"];

// Current Process Control block.
var currentPCB = null;

// Currently running program.
var runningProgram = null;

// Global user quantum.
var userQuantum = null;

var timeSlice = 0;

// Flag to determine whether to kill a process.
var killFlag = false;

var processToKill = null;

// Max hdd size in decimal.
var MAX_HDD_SIZE = 256;

// End of track one in decimal.
var END_OF_DIRECTORY = 63;

var FREE_BLOCK = "00";

var OCCUPIED_BLOCK = "01";

var HORIZONTAL_LINE = "==============";
