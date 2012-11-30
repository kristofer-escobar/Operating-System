/*
object to represent a file.
*/

function block()
{
	this.blockStatus = FREE_BLOCK;
	this.nextBlock = "$$$";
	this.contents = "";

	this.init = function()
	{
		this.blockStatus =FREE_BLOCK;
		this.nextBlock = "$$$";
		this.contents = "";
	}

	this.isBlockFull = function()
	{
		if(this.contents.length >= 60)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

}