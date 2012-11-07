
// Unsure how to loop back to line with LOOP.
var loopBack = 10;

function decodeInstruction(instr)
{
	// Decode instruction.
	switch(instr.toUpperCase())
	{
		case "A9":
		// Load accumlator wth a constant.
		_CPU.Acc = memory[_CPU.PC];
		//alert("acc: " + _CPU.Acc + "value: " + memory[_CPU.PC] + "pc "  + _CPU.PC);
		break;

		case "AD":
		// Load the accumulator from memory.
		_CPU.Acc = memory[parseInt(memory[_CPU.PC], 16)];
		break;

		case "8D":
		// Store the accumulator in memory.
		memory[parseInt(memory[_CPU.PC], 16)] = _CPU.Acc;
		break;

		case "6D":
		// Add with carry.
		//Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator.
		_CPU.Acc = parseInt(memory[parseInt(memory[_CPU.PC], 16)], 10) + parseInt(_CPU.Acc, 10);
		break;

		case "A2":
		// Load the X register with a constant.
		_CPU.Xreg = parseInt(memory[_CPU.PC], 10);
		break;

		case "AE":
		// Load the X register from memory. *
		_CPU.Xreg = parseInt(memory[parseInt(memory[_CPU.PC], 16)], 10);
		break;

		case "A0":
		// Load the Y register with a constant.
		_CPU.Yreg = parseInt(memory[_CPU.PC], 10);
		break;

		case "AC":
		// Load the Y register from memory. *
		_CPU.Yreg = parseInt(memory[parseInt(memory[_CPU.PC], 16)],10);
		break;

		case "EA":
		// Generate a software interrupt to print.
		systemCall("print");
		break;

		case "00":
		// Break.
		break;

		case "EC":
		// Compare a byte in memory to the X reg.
		// Sets the Z (zero) flag if equal.
		//alert(parseInt(memory[parseInt(memory[_CPU.PC],10)] , 10) + " " + parseInt(_CPU.Xreg, 10));
		if( parseInt(memory[parseInt(memory[_CPU.PC],16)] , 10) == parseInt(_CPU.Xreg, 10))
		{
			_CPU.Zflag = 1; // true
		}
		else
		{
			_CPU.Zflag = 0; // false
		}
		break;

		case "D0":
		// Branch X bytes if Z flag = 0.
		if(parseInt(_CPU.Zflag, 10) === 0)
		_CPU.PC = (_CPU.PC + 1) + parseInt(memory[_CPU.PC].toString(),16);

		// Loop back around to zero.
		if(_CPU.PC > 255)
		{
			_CPU.PC = _CPU.PC - 256;
		}

		break;

		case "EE":
		// Increment the value of a byte.
		//alert(memory[_CPU.PC] + " " + (parseInt((memory[parseInt(memory[_CPU.PC], 10)]), 10) + 1));
		memory[parseInt (memory[_CPU.PC], 16)] = (parseInt((memory[parseInt(memory[_CPU.PC], 16)]), 10) + 1);
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