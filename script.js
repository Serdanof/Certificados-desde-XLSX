document.getElementById('generateCertificates').addEventListener('click', () => {
    const fileInput = document.getElementById('xlsxFileInput').files[0];
    if (!fileInput) {
        alert('Por favor, seleccione un archivo XLSX.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0]; // Supongamos que la hoja de cálculo que contiene los datos es la primera.
        const worksheet = workbook.Sheets[sheetName];
        const xlsxData = XLSX.utils.sheet_to_json(worksheet);

        if (xlsxData.length === 0) {
            alert('La hoja de cálculo está vacía o no contiene datos.');
            return;
        }

        xlsxData.forEach(data => {
            const name = data['Nombre Completo'];
            const id = data['Número de Identificación'];

            const currentTime = new Date().toLocaleString();
            const pdfContent = {
                content: [
                    { text: `Certificado de participación`, fontSize: 20, bold: true, alignment: 'center' },
                    { text: '\n' },
                    { text: `Nombre: ${name}`, fontSize: 16 },
                    { text: `ID: ${id}`, fontSize: 16 },
                    { text: `Fecha: ${currentTime}`, fontSize: 16 },
                    { qr: `Certificado de ${name}\nID: ${id}\nFecha: ${currentTime}`, fit: 100, alignment: 'center' }
                ],
                defaultStyle: {
                    fontSize: 12,
                },
            };

            const pdfDocument = pdfMake.createPdf(pdfContent);
            pdfDocument.download(`Certificado_${name}.pdf`);
        });
    };

    reader.readAsArrayBuffer(fileInput);
});