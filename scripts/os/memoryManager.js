// Function to create main memory table.
function createMainMemoryTable()
{
    // Get the reference to main table.
    var mainTable = document.getElementById("mainMemory");

    // Create a <table> element and a <tbody> element
    var tbl     = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // Set table header.
    var rowHeader = document.createElement("tr");
    var header = document.createElement("th");
    var headerName = document.createTextNode("Main Memory");
    header.appendChild(headerName);
    header.setAttribute("colSpan", "9");
    rowHeader.appendChild(header);
    tblBody.appendChild(rowHeader);

    // Initialize memory loocation.
    var memoryLocation = 0;

    // Create all cells
    for (var j = 0; j < 8; j++)
    {
        // Create rows.
        var row = document.createElement("tr");

        // Create first column to hold memory locations.
        var firstCell = document.createElement("td");

        // Format memory locations.
        if(memoryLocation < 10)
            memoryLocation = "0" + memoryLocation;

        // Set the memory locations.
        var firstCellText = document.createTextNode(memoryLocation);
        firstCell.appendChild(firstCellText);
        // Make bold.
        firstCell.style.fontWeight = 'bold';
        // Add memory location column to row.
        row.appendChild(firstCell);


        // Create columns for memory contents.
        for(i = 0; i < 8; i++)
        {
            // Create new column.
            var newCol = document.createElement("td");

            // Set default memory contents.
            var colText = document.createTextNode("00");

            // Add text to column.
            newCol.appendChild(colText);

            // Style new columns.
            newCol.style.border = "1px solid black";
            newCol.style.textAlign = "center";

            // Add column to row.
            row.appendChild(newCol);
        }

        // Update memory location counter.
        memoryLocation = (parseInt(memoryLocation, 16) + 8).toString(16).toUpperCase();

        // Style for memory location column.
        firstCell.style.border = "1px solid black";
        firstCell.style.textAlign = "center";

        // add the row to the end of the table body
        tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    
    // Set id for main memory table.
    tbl.setAttribute("id", "tblMainMemory");
        
    // Append <table> into main table.
    mainTable.appendChild(tbl);

    // Set the attributes of tbl.
    tbl.style.borderCollapse = "collapse";
    tbl.style.border = "1px solid black";
    tbl.style.width = "100%";
}

// Function to update the contents of the main memory table.
function updateMainMemory(instructions, process)
{
    // Set memory length.
    memory.length = process.pid * PAGE_SIZE;

    // Add program to memory.
    memory = memory.concat(instructions);

    // Get reference to main memory table.
    var mainMemoryTable = document.getElementById("tblMainMemory");

    // Index for instruction position.
    var index = 0;

    // Updates cells.
    for(i = 1; i <= 8; i++)
        {
            for(j = 1; j <= 8; j++)
            {
                if(index < instructions.length)
                   mainMemoryTable.rows[i].cells[j].innerHTML = instructions[index];

                index++;
                
            }
            
        }

}

function updateMemory()
{
    // Get reference to main memory table.
    var mainMemoryTable = document.getElementById("tblMainMemory");

    // Index for instruction position.
    var index = 0;

    // Updates cells.
    for(i = 1; i <= 8; i++)
        {
            for(j = 1; j <= 8; j++)
            {
                if(index < currentPCB.limit)
                {
                    if(memory[index] === undefined)
                    {
                        mainMemoryTable.rows[i].cells[j].innerHTML = "00";
                    }
                    else
                    {
                        mainMemoryTable.rows[i].cells[j].innerHTML = memory[index];
                    }
                    
                }
                   //mainMemoryTable.rows[i].cells[j].innerHTML = memory[index];

                index++;
                
            }
            
        }

}

// Check for valid memory address.
function validateMemory(memory, pcb)
{
    if(memory < pcb.limit)
        return memory
    else
        blueScreenOfDeath("Page Fault: Memory access violation.");
}
