/*
 * MEMORY GLOBALS.
 */

// Array used to store programs in main memory.
var memory = [];

// Queue to store currently runnning processes.
var readyQueue = new Queue();

// Associative array used to store pcb's (Resident queue).
var residentQueue = {};

var residentPrograms = [];

// Associative array used to store terminated pcb's (Terminated queue).
var terminatedQueue = {};

// Array used to simulate secondary storage. (hard drive)
var hard_drive = window.localStorage;

/*
 * MEMORY CONSTANTS.
 */

// Default time quantum.
var DEFAULT_QUANTUM = 6;

// Constant for page size.
var PAGE_SIZE = 256;

// Constant for track size.
var TRACK_SIZE = 4;

// Constant for sector size.
var SECTOR_SIZE = 8;

// Constant for block size.
var BLOCK_SIZE = 8;

var PARTITION_ONE = 0;

var PARTITION_TWO = 1;

var PARTITION_THREE = 2;

