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
          // FETCH
          var instruction = fetch(_CPU.PC);

          // INCREMENT
          increment();

          //Testing.
          //alert("x " +_CPU.Xreg);
          //alert("y " +_CPU.Yreg);

          // EXECUTE
          if(notData(instruction))
          execute(instruction);

          // update cpu status
          updateCPUStatus();

          // Update memory.
          updateMemory();

          // Turn off execute flag.
          if(_CPU.PC == currentPCB.limit)
          {
            // Stop Execution.
            this.isExecuting = false;
            
            // Update pcb.
            updatePCB(_CPU);

            // Update the ready queue.
            updateReadyQueue(currentPCB);
          }

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
