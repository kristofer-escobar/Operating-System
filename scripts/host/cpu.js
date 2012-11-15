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
        if(this.isExecuting == true && !killFlag)
        {
          schedule(_CPU);

          //alert(_CPU.PC);
          // Get the time slice
          // if it's 6, raise interrupt.

          // If there are multiple processes, schedule them.
          // if(readyQueue.getSize() > 1)
          // {
          //   // Schedule processes.
          //   schedule();
          // }
          // else
          // {
          //   readyQueue.dequeue();
          // }

          // FETCH
          var instruction = fetch(_CPU.PC);
          
          // INCREMENT
          increment();

          // EXECUTE
          if(notData(instruction))
          execute(instruction);

          // Update cpu status
          updateCPUStatus();

          // Update memory.
          updateMemory();

          // Update pcb.
          updatePCB(_CPU);

          // Update the ready queue.
          updateReadyQueue(currentPCB);

          // // Update current pcb.
          // updatePCB(_CPU);

          // Turn off execute flag.
          // if(_CPU.PC == currentPCB.limit - currentOffset)
          // {
          //   // Stop Execution.
          //   this.isExecuting = false;

          //   // Put process on terminated queue.
          //   terminatedQueue[currentPCB.pid] = currentPCB;

          //   // Update cpu.
          //   updateCPUStatus();

          //   // Update the ready queue.
          //   updateReadyQueue(currentPCB);
          // }

          // Check if pc is over 255
          // if it throw error?
          //alert("pc: " + _CPU.PC + "mem 40" + memory[40]);
        }

        if(killFlag === true)
        {
          _CPU.isExecuting = false;
          _KernelInterruptQueue.enqueue(new Interrput(TIMER_IRQ, cpu));
        }

      }
    }

    function fetch(pc)
    {
      // Fetch program from memory.
      //return memory.slice(currentPCB.base, currentPCB.limit)[pc];
      return memory[pc];
    }

    function increment()
    {
      // Increment Program counter.
      _CPU.PC++;
    }

    function execute(instruction)
    {
      // decode instruction.
      //alert("executing " + instruction);
      decode(instruction);
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

function updateCPU(pcb)
{
    //Upadate cpu with pcb values.
    _CPU.PC    = pcb.PC;
    //_CPU.PC    = pcb.PC + (currentOffset * PAGE_SIZE);
    _CPU.Acc   = pcb.Acc;
    _CPU.Xreg  = pcb.Xreg;
    _CPU.Yreg  = pcb.Yreg;
    _CPU.Zflag = pcb.Zflag;
}

  //TODO: Check if this is working correctly. NEEDS TO BE A SOFTWARE INTERRUPT
  // Schedule processes. (Round Robin)
  function schedule(cpu)
  {
    // // Check if new process needs to be executed.
    if(timeSlice === 0)
    {
    // Get the current pcb.
    currentPCB = readyQueue.dequeue();
    krnTrace("CPU getting process: " + currentPCB.pid + " from ready queue.");

    krnTrace("Loading contents of PCB to CPU.");
    // Get the current pcb and store into cpu.
    updateCPU(currentPCB);

    }

    if(timeSlice == (getQuantum() - 1))
    {
      //_CPU.isExecuting = false;
     _KernelInterruptQueue.enqueue(new Interrput(TIMER_IRQ, cpu));
    }


    krnTrace("Incrementing time slice.");
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
