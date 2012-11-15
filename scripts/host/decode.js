
function decode(instr)
{
	// Decode instruction.
	switch(instr.toUpperCase())
	{
		case "A9":
		// Load accumlator wth a constant.
		_CPU.Acc = memory[_CPU.PC];
		break;

		case "AD":
		// Load the accumulator from memory.
		//_CPU.Acc = memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16), currentPCB)];
		_CPU.Acc = memory[validateMemory((parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16) + (currentPCB.pid * PAGE_SIZE)), currentPCB)];
		break;

		case "8D":
		// Store the accumulator in memory.
		//alert("stored in: " + validateMemory((parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString() ), 16) + (currentPCB.pid * PAGE_SIZE)) , currentPCB));
		//memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString() ), 16) , currentPCB)] = _CPU.Acc;
		memory[validateMemory((parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16) + (currentPCB.pid * PAGE_SIZE)), currentPCB)] = _CPU.Acc;
		break;

		case "6D":
		// Add with carry.
		//Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator.
		//_CPU.Acc = parseInt(memory[parseInt(memory[_CPU.PC], 16)], 10) + parseInt(_CPU.Acc, 10);
		//_CPU.Acc = parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)], 10) + parseInt(_CPU.Acc, 10);
		_CPU.Acc = parseInt(memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16) + (currentPCB.pid * PAGE_SIZE), currentPCB)], 10) + parseInt(_CPU.Acc, 10);
		break;

		case "A2":
		// Load the X register with a constant.
		_CPU.Xreg = parseInt(memory[_CPU.PC], 10);
		//alert("x set to constant: " + parseInt(memory[_CPU.PC], 10));
		break;

		case "AE":
		// Load the X register from memory.
		//alert("* " + memory[_CPU.PC + 1].toString() );
		//alert("# " + memory[parseInt(memory[_CPU.PC].toString(), 16)]);
		//_CPU.Xreg = parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)], 10);
		_CPU.Xreg = parseInt(memory[validateMemory(parseInt(memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString(), 16) + (currentPCB.pid * PAGE_SIZE), currentPCB)], 10);
		//alert("x is set to mem : " + parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)], 10));
		break;

		case "A0":
		// Load the Y register with a constant.
		_CPU.Yreg = memory[_CPU.PC].toString();
		//alert("y set to: " + memory[_CPU.PC].toString());
		break;

		case "AC":
		// Load the Y register from memory.
		//_CPU.Yreg = parseInt(memory[parseInt(memory[_CPU.PC], 16)],10);
		//_CPU.Yreg = parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)], 10);
		_CPU.Yreg = parseInt(memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16) + (currentPCB.pid * PAGE_SIZE), currentPCB)], 10);
		break;

		case "EA":
		// Generate a software interrupt to print.
		systemCall("print");
		break;

		// Terminate program.
		case "00":
		
		// Check if 00 belongs to an instruction.
		var takesParams = ["A9", "A2", "A0", "D0, AD", "8D", "6D", "AE", "AC", "EC", "EE"];

			if((!contains(takesParams, memory[_CPU.PC - 2])) && (!contains(takesParams, memory[_CPU.PC - 3])))
			{
				// No more programs to run, terminate.
				//alert("rq size " + readyQueue.getSize());
				
				// End Process.
				_KernelInterruptQueue.enqueue(new Interrput(TIMER_IRQ, cpu));

				// // Stop if all programs are done.
				if(readyQueue.getSize() === 0)
					_CPU.isExecuting = false;

				// Update the pcb.
				updatePCB(_CPU);

				// Put process on the terminated queue.
				terminatedQueue[currentPCB.pid] = currentPCB;
				krnTrace("Process: " + currentPCB.pid + " terminated.");

				// Update final pu status.
				updateCPUStatus();

				// Update the ready queue.
				updateReadyQueue(currentPCB);

			}

		// Break.
		break;

		case "EC":
		// Compare a byte in memory to the X reg.
		// Sets the Z (zero) flag if equal.
		//alert(parseInt(memory[parseInt(memory[_CPU.PC],10)] , 10) + " " + parseInt(_CPU.Xreg, 10));
		//if( parseInt(memory[parseInt(memory[_CPU.PC],16)] , 10) == parseInt(_CPU.Xreg, 10))
		//alert("x: "+ parseInt(_CPU.Xreg, 10) );
		//alert("mem: " + parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()),16)] , 10));
		//if(parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()),16) + (currentPCB.pid * PAGE_SIZE)] , 10) == parseInt(_CPU.Xreg, 10))
		//if(parseInt(memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()),16)] , 10) == parseInt(_CPU.Xreg, 10))
		if(parseInt(memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()),16) + (currentPCB.pid * PAGE_SIZE), currentPCB)] , 10) == parseInt(_CPU.Xreg, 10))
		{
			//alert("true");
			_CPU.Zflag = 1; // true
		}
		else
		{
			//alert("false");
			_CPU.Zflag = 0; // false
		}
		break;

		case "D0":
		// Branch X bytes if Z flag = 0.
		//alert("Inside D0");
		if(parseInt(_CPU.Zflag, 10) === 0)
		{
			_CPU.PC = (_CPU.PC + 1) + parseInt(memory[_CPU.PC].toString(),16);
			//alert("branch to: " + _CPU.PC);
		}
		//_CPU.PC = (_CPU.PC + 1) + parseInt(memory[_CPU.PC].toString(),16);

		//alert(_CPU.PC);
		// // Loop back around to zero.
		// if(_CPU.PC > 255)
		// {
		// 	_CPU.PC = _CPU.PC - 256;
		// }

		// Loop back around to zero.
		if(_CPU.PC > (currentPCB.limit - 1))
		{
			_CPU.PC = _CPU.PC - 256;
		}

		break;

		case "EE":
		// Increment the value of a byte.**
		//alert(memory[_CPU.PC] + " " + (parseInt((memory[parseInt(memory[_CPU.PC], 10)]), 10) + 1));
		//memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)] = (parseInt((memory[parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)]), 10) + 1);
		memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)  + (currentPCB.pid * PAGE_SIZE), currentPCB)] = (parseInt((memory[validateMemory(parseInt((memory[_CPU.PC + 1].toString() + memory[_CPU.PC].toString()), 16)  + (currentPCB.pid * PAGE_SIZE), currentPCB)]), 10) + 1);

		break;

		case "FF":
		// System call.
		// Generate a software interrupt.
		systemCall("print");
		break;
		default:
		break;

	}

}