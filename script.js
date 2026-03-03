const { PDFDocument, degrees } = PDFLib;

// Helper function to trigger downloads
function downloadURI(uri, name) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function mergePDFs() {
    const files = document.getElementById('merge-files').files;
    if (files.length < 2) return alert("Please select at least 2 PDFs.");
    
    const mergedPdf = await PDFDocument.create();
    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    downloadURI(URL.createObjectURL(blob), "merged-loves-me.pdf");
}

async function rotatePDF() {
    const file = document.getElementById('rotate-file').files[0];
    if (!file) return alert("Please select a PDF.");

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    pages.forEach(page => page.setRotation(degrees(180)));
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    downloadURI(URL.createObjectURL(blob), "rotated-loves-me.pdf");
}

async function imagesToPDF() {
    const files = document.getElementById('jpg-files').files;
    if (files.length === 0) return alert("Please select images.");

    const pdfDoc = await PDFDocument.create();
    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') image = await pdfDoc.embedJpg(arrayBuffer);
        else if (file.type === 'image/png') image = await pdfDoc.embedPng(arrayBuffer);
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    downloadURI(URL.createObjectURL(blob), "images-loves-me.pdf");
}
