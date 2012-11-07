// Array used to store programs in main memory.
var memory = [];

// Associative Array used to store pcbs (Resident queue).
var processControlBlocks = {};

var DEFAULT_QUANTUM = 6;

var PAGE_SIZE = 256;

var TRACK_SIZE = 4;

var SECTOR_SIZE = 8;

var BLOCK_SIZE = 8;

