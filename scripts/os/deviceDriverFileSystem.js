/*
* File System Device Driver.
*/
DeviceDriverFileSystem.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.
function DeviceDriverFileSystem()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnFileSystemDriverEntry;
    this.init = krnFileSystemInit;
    // "Constructor" code.
}

function krnFileSystemDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnFileSystemInit()
{
	if(hard_drive.length <= 0)
	{
		formatHardDrive();
	}
}

function fileSystemDeleteFile(fileName)
{
	// Get the file address.
	var fileAddress = findFile(fileName);

	// Check if the file was found.
	if(fileAddress != -1)
	{
		// Get file.
		var file = JSON.parse(hard_drive.getItem(fileAddress));

		// Create a new empty block.
		var newBlock = new block();

		// Check if the file spans multiple blocks.
		if(file.nextBlock == "$$$")
		{
			// Delete the block by overwriting it with an empty block.
			hard_drive.setItem(fileAddress, JSON.stringify(newBlock));
		}
		else
		{
			// Else, the file spans multiple blocks
			// so all blocks for that file must be deleted as well.
		}

		// Get the address of the file descriptor.
		var fileDescriptorAddress = findFileDescriptor(fileName);

		if(fileDescriptorAddress != -1)
		{
			// Delete the file descriptor for the file, by overwriting it with a empty block.
			hard_drive.setItem(fileDescriptorAddress, JSON.stringify(newBlock));
		}
		else
		{
			// This shouldn't happen.
			_StdIn.putText("Could not delete file descriptor.");
		}

		return true;
	}
	else
	{
		// Error, file not found.
		_StdIn.putText("File '" + fileName + "' was not found.");
		_StdIn.advanceLine();
		return false;
	}	
}

// TODO check data size, if over 60, it needs to span multiple files.
function fileSystemWriteFile(fileName, data)
{
	// Get file address.
	var fileAddress = findFile(fileName);

	// Check if the file was found.
	if(fileAddress != -1)
	{
		// Get file.
		var file = JSON.parse(hard_drive.getItem(fileAddress));

		// Store the contents in a temp variable.
		var contents = file.contents.toString();

		// File already contains data, warn the user.
		if(contents.length > 0)
		{
			var overwrite = confirm("You are about to overwrite the contents of this file. Do you want to proceed?");

			if( overwrite === true)
			{
				// Overwrite and store the data to the file contents.
				file.contents = data;
			}
			else
			{
				// Make no changes.
				_StdIn.putText("No changes were made.");
			}
		}
		else
		{
			// Else, first time writing to file.
			// Store the data to the file contents.
			file.contents = data;
		}

		// Store the file with it's new contents to the HDD.
		hard_drive.setItem(fileAddress, JSON.stringify(file));
		return true;

	}
	else
	{
		// Error, file not found.
		_StdIn.putText("File '" + fileName + "' was not found.");
		_StdIn.advanceLine();
		return false;
	}
}

function fileSystemReadFile(fileName)
{
	// Look for the file.
	var fileAddress = findFile(fileName);

	// Check if file was found.
	if(fileAddress != -1)
	{
		// Get file.
		var file = JSON.parse(hard_drive.getItem(fileAddress));

		// Variable to hold file contents.
		var contents = file.contents.toString();

		// Check if the file is empty.
		if(contents.length > 0 )
		{
			// Display the contents of the file.
			_StdIn.putText(HORIZONTAL_LINE + " Start " + HORIZONTAL_LINE);
			_StdIn.advanceLine();
			_StdIn.putText(contents);
			_StdIn.advanceLine();
			_StdIn.putText(HORIZONTAL_LINE + " End  " + HORIZONTAL_LINE);
		}
		else
		{
			// File found, but empty.
			_StdIn.putText("File empty.");
		}

	}
	else
	{
		// Error, file not found.
		_StdIn.putText("File '" + fileName + "' was not found.");
	}
}

function findFileDescriptor(fileName)
{
	for(var i = 0; i <= END_OF_DIRECTORY; i++)
	{
		// Get the track, sector, and block.
		var TSB = i.toString(8);

		// Get the file descriptor.
		var fileDescriptor = JSON.parse(hard_drive.getItem(TSB));

		//alert("fileDescriptor " + fileDescriptor.contents + " fileName: " +  fileName);

		// Look for file descriptor.
		if(fileDescriptor.contents.toString() == fileName)
		{
			// File descriptor found, return memory location.
			return TSB;
		}
	}

	// File not found.
	return -1;

}

function findFile(fileName)
{
	for(var i = 0; i <= END_OF_DIRECTORY; i++)
	{
		// Get the track, sector, and block.
		var TSB = i.toString(8);

		// Get the reference to the file.
		var fileDescriptor = JSON.parse(hard_drive.getItem(TSB));

		//alert("fileDescriptor " + fileDescriptor.contents + " fileName: " +  fileName);

		// Look for file.
		if(fileDescriptor.contents.toString() == fileName)
		{
			// File found, return memory location.
			return fileDescriptor.nextBlock;
		}
	}

	// File not found.
	return -1;

}

function fileSystemCreateFile(fileName)
{	
	// Variable to hold free directory address.
	var directoryAddress = getFreeDirectoryBlock();

	// Variable to hold the free file address.
	var fileAddress = getFreeFileBlock();

	// If free directory and file blocks are found, the file can be created.
	if(directoryAddress != -1 && fileAddress != -1)
	{
		// Get the file descriptor.
		var fileDescriptor = JSON.parse(hard_drive.getItem(directoryAddress));

		// Set the file decriptor contetnts to the name of the file to be created.
		fileDescriptor.contents = fileName;

		// Set the file descriptor to point to the location of the file.
		fileDescriptor.nextBlock = fileAddress; 

		// Set the file descriptor status to occupied.
		fileDescriptor.blockStatus = OCCUPIED_BLOCK;

		// Store updated file descriptor to HDD.
		hard_drive.setItem(directoryAddress, JSON.stringify(fileDescriptor));

		// Get the file.
		var file = JSON.parse(hard_drive.getItem(fileDescriptor.nextBlock));

		// Set the file status to occupied.
		file.blockStatus = OCCUPIED_BLOCK;

		// Store updated file to HDD.
		hard_drive.setItem(fileDescriptor.nextBlock, JSON.stringify(file));

		return true;
	}
	else
	{
		// There was no free directory or file space.
		return false;
	}
	
}

// Returns the next available file block. Returns -1 if no space is found.
function getFreeFileBlock()
{
	// Check for the next availble free space in the file system.
	for(var i = END_OF_DIRECTORY + 1; i <= MAX_HDD_SIZE; i++)
	{
		var TSB = i.toString(8);

		// Get the file handle.
		var fileHandle = JSON.parse(hard_drive.getItem(TSB));
		//alert(fileHandle.blockStatus + " " + fileHandle.contents);

		// Check if block is free.
		if(fileHandle.blockStatus == FREE_BLOCK)
		{
			// Free space found.
			//alert("Free file block " + TSB);
			return TSB;
		}
	}

	// No free HDD space found.
	_StdIn.putText("Error: HDD full.");
	return -1;
}

// Returns the next available directory block. Returns -1 if no space is found.
function getFreeDirectoryBlock()
{
	// Check for the next availble free space in the directory.
	for(var i = 0; i <= END_OF_DIRECTORY; i++)
	{
		var TSB = i.toString(8);

		// Get the file handle.
		var fileHandle = JSON.parse(hard_drive.getItem(TSB));
		//alert(fileHandle.blockStatus + " " + fileHandle.contents);

		// Check if block is free.
		if(fileHandle.blockStatus == FREE_BLOCK)
		{
			// Free space found.
			//alert("Free directory blocks " + TSB);
			return TSB;
		}
	}

	// No free directory space found.
	_StdIn.putText("Error: Directory full.");
	return -1;
}

// Clears and formats the hard drive.
function formatHardDrive()
{
	// Clear html5 localStorage object.
	hard_drive.clear();
	krnTrace("Formatting HDD...");

	// Create a new block for the master boot record.
	var mbr = new block();

	// Set status to occupied.
	mbr.blockStatus = OCCUPIED_BLOCK;

	// Set the contents of the master boot record.
	mbr.contents = "MASTER_BOOT_RECORD.";

	// Place the master boot record in the first block of memory.
	var mbrLocation = 0;
	mbrLocation = mbrLocation.toString(8);

	// Store the master boot record into the hard drive.
	hard_drive.setItem(mbrLocation, JSON.stringify(mbr));

	// Fill hard drive with new blocks.
	for(var i = 1; i < MAX_HDD_SIZE; i++)
	{
		// Create an empty block.
		var newBlock = new block();

		// Store the new blocks in the hard drive.
		hard_drive.setItem(i.toString(8), JSON.stringify(newBlock));
	}

}

// Formats a block in the hard drive.
function formatBlock()
{
	// TODO: format a block, clear the contents of the block object and set the status to 00 and set
	// the location of the nextBlock to $$$.
}