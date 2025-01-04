let rowCounts = 1;
function addRowtemp() {
    rowCounts++;
    // Get the table body where rows will be appended
    const tableBody = document.getElementById("tableBody");
    
    // Create the first row (UUC)
    const row1 = document.createElement("tr");
    row1.innerHTML = `
        <td>${rowCounts}</td>
        <td ><input type="text" id="point${rowCounts}" name="point${rowCounts}" autocomplete="on"></td>
        <td>UUC</td>
        <td><input type="text" id="uuc_reading1_row${rowCounts}" name="uuc_reading1_row${rowCounts}}" autocomplete="off"></td>
        <td><input type="text" id="uuc_reading2_row${rowCounts}" name="uuc_reading2_row${rowCounts}}" autocomplete="off"></td>
        <td><input type="text" id="uuc_reading3_row${rowCounts}}" name="uuc_reading3_row${rowCounts}" autocomplete="off"></td>
    `;
    
    // Create the second row (MASTER)
    var row2 = document.createElement("tr");
    
    row2.innerHTML = `
        <td></td>
        <td></td>
        <td>MASTER</td>
        <td><input type="text" id="master_reading1_row${rowCounts}" name="master_reading1_row${rowCounts}}" autocomplete="off"></td>
        <td><input type="text" id="master_reading2_row${rowCounts}" name="master_reading2_row${rowCounts}}" autocomplete="off"></td>
        <td><input type="text" id="master_reading3_row${rowCounts}}" name="master_reading3_row${rowCounts}" autocomplete="off"></td>
    `;
    
    // Append the new rows to the table body
    tableBody.appendChild(row1);
    tableBody.appendChild(row2);
}


function deleteRowtemp() {
    const tableBody = document.getElementById("tableBody");
    const rows = tableBody.getElementsByTagName("tr");

    // Check if there are at least two rows to remove (a pair of UUC and MASTER rows)
    if (rows.length > 2) {
        // Remove the last two rows
        tableBody.deleteRow(-1);  // MASTER row
        tableBody.deleteRow(-1);
        rowCounts--; // Decrease the row count  
    } else {
        alert("Cannot delete all rows!");
    }
}


let rowCount = 1;
// add row code for 3 col
    function addRow() {
        rowCount++;
        const tableBody = document.getElementById('tableBody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" name="uuc_${rowCount}" autocomplete="off"></td>
            <td><input type="text" name="master_up_${rowCount}" autocomplete="off"></td>
            <td><input type="text" name="master_down_${rowCount}" autocomplete="off"></td>
        `;
        tableBody.appendChild(newRow);
    }
// delete row code for 3 col
    function deleteRow() {
        const tableBody = document.getElementById('tableBody');
        if (tableBody.rows.length > 1) {
            tableBody.deleteRow(-1);
            rowCount--;
        } else {
            alert("Cannot delete all rows!");
        }
    }



// Function to validate required fields
function validateRequiredFields() {
    const requiredFields = document.querySelectorAll(".envirmental_conditions input,.UUC_DATA input, .UUC_DATA select");
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            alert(`Please fill in the ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }
    return true;
}




// preview pdf 

async function previewTableAsPDF() {
    if (!validateRequiredFields()) return alert("Please fill all required fields!");

    // Import and initialize jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Initialize offsets for positioning content in the PDF
    let yOffset = 10; // Vertical offset for the first line
    const xOffsetLeft = 10; // Horizontal offset for the left column
    const xOffsetRight = 110; // Horizontal offset for the right column

    // Add "Datasheet Report" as the main title
    pdf.setFontSize(16);
    pdf.text("Datasheet Report", 105, yOffset, { align: "center" });
    yOffset += 20;

    // Add "Environmental Conditions" as a section title
    pdf.setFontSize(14);
    pdf.text("Environmental Conditions", 105, yOffset, { align: "center" });
    yOffset += 10;

    // Process environmental conditions inputs
    const envoInputs = document.querySelectorAll(".envirmental_conditions input");
    envoInputs.forEach((input, index) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        const text = `${label}: ${value}`;

        if (index % 2 === 0) {
            pdf.text(text, xOffsetLeft, yOffset);
        } else {
            pdf.text(text, xOffsetRight, yOffset);
            yOffset += 10;
        }

        if (yOffset > 280) {
            pdf.addPage();
            yOffset = 10;
        }
    });

    yOffset += 10;

    // Process Dates/UUC Inputs (left aligned)
    const datesuucInputs = document.querySelectorAll("#filename, .datesuuc input");
    datesuucInputs.forEach((input) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        pdf.text(`${label}: ${value}`, xOffsetLeft, yOffset);
        yOffset += 10;

        if (yOffset > 280) {
            pdf.addPage();
            yOffset = 10;
        }
    });

    yOffset += 10;

    // Initialize offsets for form inputs
    let yOffsetLeft = yOffset;
    let yOffsetRight = yOffset;

    // Process form inputs (alternate between left and right columns)
    const formInputs = document.querySelectorAll(".UUC_DATA input, .UUC_DATA select");
    formInputs.forEach((input) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        const text = `${label}: ${value}`;

        
        // Special handling for Range and Least Count with their units
        if (input.id === "Range") {
            const unitValue = document.getElementById("unit_of_range").value || "";
            pdf.text(`Range: ${value} ${unitValue}`, xOffsetRight, yOffsetRight);
            yOffsetRight += 10;
        } else if (input.id === "least_count") {
            const unitValue = document.getElementById("unit_of_least_count").value || "";
            pdf.text(`Least Count: ${value} ${unitValue}`, xOffsetRight, yOffsetRight);
            yOffsetRight += 10;
        } else {
            // Alternate inputs between left and right columns
            if (input.classList.contains("left-col") && input.id !== "unit_of_least_count" && input.id !== "unit_of_range") {
                pdf.text(text, xOffsetLeft, yOffsetLeft);
                yOffsetLeft += 10;
            } else if ( input.classList.contains("right-col") && input.id !== "unit_of_least_count" && input.id !== "unit_of_range") {
                pdf.text(text, xOffsetRight, yOffsetRight);
                yOffsetRight += 10;
            }
        }

        // Handle overflow
        if (yOffsetLeft > 280 || yOffsetRight > 280) {
            pdf.addPage();
            yOffsetLeft = 10;
            yOffsetRight = 10;
        }
    });

    yOffset = Math.max(yOffsetLeft, yOffsetRight) + 10;

    // Process Master/Procedure/Calibration By inputs
    const masterProcedureInputs = document.querySelectorAll(".master_procedure_calibrationby input");
    masterProcedureInputs.forEach((input) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        const text = `${label}: ${value}`;

        if (input.classList.contains("left-col")) {
            pdf.text(text, xOffsetLeft, yOffsetLeft);
            yOffsetLeft += 10;
        } else if (input.classList.contains("right-col")) {
            pdf.text(text, xOffsetRight, yOffsetRight);
            yOffsetRight += 10;
        }

        if (yOffsetLeft > 280 || yOffsetRight > 280) {
            pdf.addPage();
            yOffsetLeft = 10;
            yOffsetRight = 10;
        }
    });

    yOffset = Math.max(yOffsetLeft, yOffsetRight) + 10;

    // Add table data
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    const headers = Array.from(rows[0].querySelectorAll("th")).map((header) =>
        header.textContent.trim()
    );

    const data = Array.from(rows)
        .slice(1)
        .map((row) => Array.from(row.querySelectorAll("td")).map((cell) => {
            const input = cell.querySelector("input");
            return input ? input.value : cell.textContent.trim();
        }));

    pdf.autoTable({
        startY: yOffset,
        head: [headers],
        body: data,
    });

    // Preview PDF
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    const pdfjsLib = window["pdfjs-dist/build/pdf"];
    const pdfContainer = document.getElementById("pdfPreviewContainer");

    pdfjsLib.getDocument(pdfURL).promise.then((pdfDoc) => {
        pdfDoc.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = { canvasContext: context, viewport: viewport };
            page.render(renderContext);
            pdfContainer.innerHTML = ""; // Clear previous preview
            pdfContainer.appendChild(canvas);
        });
    });
}


async function saveTableAsPDF() {
    if (!validateRequiredFields()) return alertmessage();

    // Import and initialize jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Initialize offsets for positioning content in the PDF
    let yOffset = 10; // Vertical offset for the first line
    const xOffsetLeft = 10; // Horizontal offset for the left column
    const xOffsetRight = 110; // Horizontal offset for the right column

    // Add "Datasheet Report" as the main title
    pdf.setFontSize(16);
    pdf.text("Datasheet Report", 105, yOffset, { align: "center" });
    yOffset += 20;

    // Add "Environmental Conditions" as a section title
    pdf.setFontSize(14);
    pdf.text("Environmental Conditions", 105, yOffset, { align: "center" });
    yOffset += 10;

    // Process environmental conditions inputs
    const envoInputs = document.querySelectorAll(".envirmental_conditions input");
    envoInputs.forEach((input, index) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        const text = `${label}: ${value}`;

        if (index % 2 === 0) {
            pdf.text(text, xOffsetLeft, yOffset);
        } else {
            pdf.text(text, xOffsetRight, yOffset);
            yOffset += 10;
        }

        if (yOffset > 280) {
            pdf.addPage();
            yOffset = 10;
        }
    });

    yOffset += 10;

    // Process Dates/UUC Inputs (left aligned)
    const datesuucInputs = document.querySelectorAll("#filename, .datesuuc input");
    datesuucInputs.forEach((input) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        pdf.text(`${label}: ${value}`, xOffsetLeft, yOffset);
        yOffset += 10;

        if (yOffset > 280) {
            pdf.addPage();
            yOffset = 10;
        }
    });

    yOffset += 10;

    // Initialize offsets for form inputs
    let yOffsetLeft = yOffset;
    let yOffsetRight = yOffset;

    // Process form inputs (alternate between left and right columns)
    const formInputs = document.querySelectorAll(".UUC_DATA input, .UUC_DATA select");
    formInputs.forEach((input) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        const text = `${label}: ${value}`;

        
        // Special handling for Range and Least Count with their units
        if (input.id === "Range") {
            const unitValue = document.getElementById("unit_of_range").value || "";
            pdf.text(`Range: ${value} ${unitValue}`, xOffsetRight, yOffsetRight);
            yOffsetRight += 10;
        } else if (input.id === "least_count") {
            const unitValue = document.getElementById("unit_of_least_count").value || "";
            pdf.text(`Least Count: ${value} ${unitValue}`, xOffsetRight, yOffsetRight);
            yOffsetRight += 10;
        } else {
            // Alternate inputs between left and right columns
            if (input.classList.contains("left-col") && input.id !== "unit_of_least_count" && input.id !== "unit_of_range") {
                pdf.text(text, xOffsetLeft, yOffsetLeft);
                yOffsetLeft += 10;
            } else if ( input.classList.contains("right-col") && input.id !== "unit_of_least_count" && input.id !== "unit_of_range") {
                pdf.text(text, xOffsetRight, yOffsetRight);
                yOffsetRight += 10;
            }
        }

        // Handle overflow
        if (yOffsetLeft > 280 || yOffsetRight > 280) {
            pdf.addPage();
            yOffsetLeft = 10;
            yOffsetRight = 10;
        }
    });

    yOffset = Math.max(yOffsetLeft, yOffsetRight) + 10;

    // Process Master/Procedure/Calibration By inputs
    const masterProcedureInputs = document.querySelectorAll(".master_procedure_calibrationby input");
    masterProcedureInputs.forEach((input) => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || "";
        const text = `${label}: ${value}`;

        if (input.classList.contains("left-col")) {
            pdf.text(text, xOffsetLeft, yOffsetLeft);
            yOffsetLeft += 10;
        } else if (input.classList.contains("right-col")) {
            pdf.text(text, xOffsetRight, yOffsetRight);
            yOffsetRight += 10;
        }

        if (yOffsetLeft > 280 || yOffsetRight > 280) {
            pdf.addPage();
            yOffsetLeft = 10;
            yOffsetRight = 10;
        }
    });

    yOffset = Math.max(yOffsetLeft, yOffsetRight) + 10;

    // Add table data
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    const headers = Array.from(rows[0].querySelectorAll("th")).map((header) =>
        header.textContent.trim()
    );

    const data = Array.from(rows)
        .slice(1)
        .map((row) => Array.from(row.querySelectorAll("td")).map((cell) => {
            const input = cell.querySelector("input");
            return input ? input.value : cell.textContent.trim();
        }));

    pdf.autoTable({
        startY: yOffset,
        head: [headers],
        body: data,
    });



    // Get the custom filename from the input field
    const filenameInput = document.getElementById("Id.No.").value.trim();
    const filename = filenameInput ? `${filenameInput}.pdf` : "data_sheet.pdf";

    // Save the PDF
    pdf.save(filename);
    clearFormInputs()
}

// Clears all input fields and resets the form
function clearFormInputs() {
    // Clear all input fields in the form
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach((input) => {
        if (input.type === "text" || input.type === "date") {
            input.value = ""; // Clear text inputs
        } else if (input.tagName === "SELECT") {
            input.selectedIndex = 0; // Reset dropdowns
        }
    });

    // Clear table rows except the first row
    const tableBody = document.getElementById("tableBody");
    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(-1);
    }

    // Reset the first row
    const firstRowInputs = tableBody.rows[0].querySelectorAll("input");
    firstRowInputs.forEach((input) => (input.value = ""));
}
