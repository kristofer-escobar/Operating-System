/* ------------
   pcb.js
   
   Routines for the PCB simulation.
  
   ------------ */

// Keep track of next pid.
var nextPid = 0;

function pcb()
{

    this.pid   = 0;     // Process Id
    this.base  = 0;     // Base
    this.limit = 0;     // Limit
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag
    
    this.init = function()
    {
        this.pid   = nextPid;
        this.base  = 0;
        this.limit = 0;
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;
        this.isExecuting = false;
        this.incrementPID();

    }

    this.incrementPID = function()
    {
      nextPid++;
    }

}

function updatePCB(cpu)
{
  currentPCB.PC    = cpu.PC;
  currentPCB.Acc   = cpu.Acc;
  currentPCB.Xreg  = cpu.Xreg;
  currentPCB.Yreg  = cpu.Yreg;
  currentPCB.Zflag = cpu.Zflag;
}


function updateReadyQueue(currPCB)
{
      // Get reference to cpu table.
    var readyQueue = document.getElementById("tblReadyQueue");

    var pid  = readyQueue.rows[2].cells[0];
    var base  = readyQueue.rows[2].cells[1];
    var limit  = readyQueue.rows[2].cells[2];
    var pc  = readyQueue.rows[2].cells[3];
    var acc = readyQueue.rows[2].cells[4];
    var x   = readyQueue.rows[2].cells[5];
    var y   = readyQueue.rows[2].cells[6];
    var z   = readyQueue.rows[2].cells[7];

    pid.innerHTML = currPCB.pid;
    base.innerHTML = currPCB.base;
    limit.innerHTML = currPCB.limit;
    pc.innerHTML = currPCB.PC;
    acc.innerHTML = currPCB.Acc;
    x.innerHTML = currPCB.Xreg;
    y.innerHTML = currPCB.Yreg;
    z.innerHTML = currPCB.Zflag;
}


