/* ------------
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document envorinment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book:
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function cpu()
{
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function()
    {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;
        this.isExecuting = false;
    }
    
    this.pulse = function()
    {
        // TODO: Do we need this?  Probably not.
    }
    
    this.cycle = function()
    {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do real work here. Set this.isExecuting appropriately.
        if(this.isExecuting === true)
        {
          // If there are multiple processes, schedule them.
          if(readyQueue.getSize() > 1)
          {
            // Schedule processes.
            schedule();
          }

          // Get the current pcb's pc.
          updateCPUStatus();

          // FETCH
          var instruction = fetch(_CPU.PC);

          // INCREMENT
          increment();

          // EXECUTE
          if(notData(instruction))
          execute(instruction);

          // Update cpu status
          //updateCPUStatus();

          // Update memory.
          updateMemory();

          // Update current pcb.
          updatePCB(_CPU);

          // Turn off execute flag.
          if(_CPU.PC == currentPCB.limit - currentOffset)
          {
            // Stop Execution.
            this.isExecuting = false;

            alert(currentPCB.base);
            alert(currentPCB.limit);

            // Update cpu.
            updateCPUStatus();

            // Update the ready queue.
            updateReadyQueue(currentPCB);
          }

          // Check if pc is over 255
          // if it throw error?
          //alert("pc: " + _CPU.PC + "mem 40" + memory[40]);
        }
    }
}
    function fetch(pc)
    {
      // Fetch program from memory.
      return memory.slice(currentPCB.base, currentPCB.limit)[pc];
    }

    function increment()
    {
      // Increment Program counter.
      _CPU.PC++;
    }

    function execute(instruction)
    {
      // decode instruction.
      decodeInstruction(instruction);
    }

    function systemCall(msg)
    {
      switch(msg)
      {
        case "print" :
        // Call kernel to print.
        krnPrint();
        break;

        default:
        // Unknown system call.
        break;

      }
    }

    // Check if its an instruction or data.
    function notData(instruction)
    {
      if(contains(opCodes, instruction))
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    function updateCPUStatus()
    {
    //Upadate cpu with pcb values.
    _CPU.PC    = currentPCB.PC;
    _CPU.Acc   = currentPCB.Acc;
    _CPU.Xreg  = currentPCB.Xreg;
    _CPU.Yreg  = currentPCB.Yreg;
    _CPU.Zflag = currentPCB.Zflag;


    // Get reference to cpu table.
    var cpuTable = document.getElementById("tblCPU");

    // Index for instruction position.
    var index = 0;

    var pc  = cpuTable.rows[2].cells[0];
    var acc = cpuTable.rows[2].cells[1];
    var x   = cpuTable.rows[2].cells[2];
    var y   = cpuTable.rows[2].cells[3];
    var z   = cpuTable.rows[2].cells[4];

    pc.innerHTML = _CPU.PC;
    acc.innerHTML = _CPU.Acc;
    x.innerHTML = _CPU.Xreg;
    y.innerHTML = _CPU.Yreg;
    z.innerHTML = _CPU.Zflag;
  }

  //TODO: Check if this is working correctly.
  // Schedule processes. (Round Robin)
  function schedule()
  {
    // Get the first pcb from the ready queue.
    if(timeSlice === 0)
      currentPCB = readyQueue.dequeue();

    // Keep track of time slice.
    if(timeSlice == getQuantum())
    {
      // Add current pcb to the end of the ready queue.
      readyQueue.enqueue(currentPCB);

      // Reset time slice.
      timeSlice = 0;
    }

    // Increment time slice.
    timeSlice = timeSlice + 1;

  }

  function getQuantum()
  {
    // If no user quantum is set, use deafault.
    if(userQuantum === null)
    {
      userQuantum = DEFAULT_QUANTUM;
    }

    return userQuantum;
  }
