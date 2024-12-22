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

//add input elements
function addInput() {
    const addedData = document.getElementById("addeddata");

    // Create a new input element
    const inputBox = document.createElement("input");
    inputBox.type = "text"; // Set the input type
    inputBox.placeholder = "Enter additional data"; // Add a placeholder
    // inputBox.className = "dynamic_input"; // Assign a class for styling or identification
    inputBox.name = `input_${addedData.children.length + 1}`; // Create a unique name

                  

    // Append the input to the container
    addedData.append(inputBox);
}
//remove input elements
function removeSecondLastChild() {
    const addedData = document.getElementById("addeddata");

    // Check if there are at least two children
    if (addedData.children.length > 0) {
        addedData.removeChild(addedData.lastChild);
    } else {
        alert("Not enough elements to remove the second-to-last one!");
    }
}


async function previewTableAsPDFgenral() {
    if (!validateRequiredFields()) ;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let yOffset = 10; // Vertical offset for PDF content

    // Add form data to the PDF
    const formInputs = document.querySelectorAll(".envirmental_conditions input,.UUC_DATA input, .UUC_DATA select");
    const addedformInputs = document.querySelectorAll(".adddata input,.dynamic_input input");
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

    addedformInputs.forEach(input => {
        const value = input.value || input.options?.[input.selectedIndex]?.text || "";
        pdf.text(`${value}`, 10, yOffset);
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

    const headers = Array.from(rows[0].querySelectorAll("th")).map(header => {
        const select = header.querySelector("select");
        return select ? select.options[select.selectedIndex].text : header.textContent.trim();
    });
    
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

async function saveTableAsPDF() {
    if (!validateRequiredFields()) return alertmessage();
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let yOffset = 10; // Vertical offset for PDF content

    // Add form data to the PDF
    const formInputs = document.querySelectorAll(".envirmental_conditions input,.UUC_DATA input, .UUC_DATA select");
    const addedformInputs = document.querySelectorAll(".adddata input,.dynamic_input input");
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

    addedformInputs.forEach(input => {
        const value = input.value || input.options?.[input.selectedIndex]?.text || "";
        pdf.text(`${value}`, 10, yOffset);
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

    const headers = Array.from(rows[0].querySelectorAll("th")).map(header => {
        const select = header.querySelector("select");
        return select ? select.options[select.selectedIndex].text : header.textContent.trim();
    });
    
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

    // Get the custom filename from the input field
    const filenameInput = document.getElementById("Id.No.").value.trim();
    const filename = filenameInput ? `${filenameInput}.pdf` : "data_sheet.pdf";

    // Save the PDF
    pdf.save(filename);
    clearFormInputs()
}