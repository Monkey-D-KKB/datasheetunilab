let rowCount = 1;

    function addRowAmpmeter() {
        rowCount++;
        const tableBody = document.getElementById('tableBody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" name="uuc_${rowCount}" autocomplete="off"></td>
            <td><input type="text" name="master_up_${rowCount}" autocomplete="off"></td>
            <td><input type="text" name="master_down_${rowCount}" autocomplete="off"></td>
            <td><input type="text" name="Mean${rowCount}" autocomplete="off"></td>
        `;
        tableBody.appendChild(newRow);
    }

    function deleteRowAmpmeter() {
        const tableBody = document.getElementById('tableBody');
        if (tableBody.rows.length > 1) {
            tableBody.deleteRow(-1);
            rowCount--;
        } else {
            alert("Cannot delete all rows!");
        }
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
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let yOffset = 10; // Vertical offset for PDF content

    // Add form data to the PDF
    const formInputs = document.querySelectorAll("#filename,.envirmental_conditions input,.UUC_DATA input, .UUC_DATA select");
    pdf.text("Datasheet:", 10, yOffset);
    yOffset += 10;

    formInputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || input.name || input.id;
        const value = input.value || input.options?.[input.selectedIndex]?.text || "";
        pdf.text(`${label}: ${value}`, 10, yOffset);
        yOffset += 10;

        // Handle PDF page overflow
        if (yOffset > 280) {
            pdf.addPage();
            yOffset = 10;
        }
    });

    // Add a gap before the table
    yOffset += 10;

    // Collect data for the table
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");

    const headers = Array.from(rows[0].querySelectorAll("th")).map(header => header.textContent.replace("↑", "Up").replace("↓", "Down")); 

    const data = Array.from(rows).slice(1).map(row => {
        return Array.from(row.querySelectorAll("td")).map(cell => {
            const input = cell.querySelector("input");
            return input ? input.value : cell.textContent.trim();
        });
    });

    // Add the table using autoTable
    pdf.autoTable({
        startY: yOffset,
        head: [headers],
        body: data,
    });


    const pdfBlob = pdf.output("blob");

    // Render the PDF using PDF.js
    const pdfURL = URL.createObjectURL(pdfBlob);
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const pdfContainer = document.getElementById("pdfPreviewContainer");

    pdfjsLib.getDocument(pdfURL).promise.then((pdfDoc) => {
        pdfDoc.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext);
            pdfContainer.innerHTML = ""; // Clear existing content
            pdfContainer.appendChild(canvas);
        });
    });
}





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


