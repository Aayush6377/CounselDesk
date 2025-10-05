import PDFDocument from 'pdfkit';
import moment from 'moment-timezone';
import axios from 'axios';
import { logoUrl } from '../utils/links.js';

export const generateInvoicePDF = async (stream, appointment) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(stream);

    const primaryColor = '#A89166';
    const lightGrey = '#EAEAEA';
    const headingColor = '#1A1A1A';
    const textColor = '#333333';
    const lightTextColor = '#666666';
    const headerFont = 'Helvetica-Bold';
    const bodyFont = 'Helvetica';

    const drawHeader = async () => {
        try {
            const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            doc.image(imageBuffer, 50, 40, { width: 50 });
        } catch (error) {
            console.error("Failed to load invoice logo:", error.message);
            doc.fontSize(20).font(headerFont).fillColor(headingColor).text('CounselDesk', 50, 45);
        }

        doc.fontSize(10).font(bodyFont).fillColor(lightTextColor)
           .text('Faridabad, Haryana, India', { align: 'right' });
           
        doc.moveDown(3);
    };

    const drawLine = (y) => {
        doc.strokeColor(lightGrey)
           .lineWidth(1)
           .moveTo(50, y)
           .lineTo(560, y)
           .stroke();
    };

    const drawCustomerInfo = () => {
        drawLine(doc.y);
        doc.moveDown(2);

        const customerInfoTop = doc.y;

        doc.fontSize(10).fillColor(lightTextColor).font(bodyFont).text('BILLED TO', 50, customerInfoTop);
        doc.fontSize(11).fillColor(headingColor).font(headerFont).text(appointment.userId.name, 50, customerInfoTop + 15);
        doc.font(bodyFont).text(appointment.userId.email);

        const rightAlignX = 350;
        const valueX = 450;
        const columnWidth = 110;

        doc.fontSize(10).fillColor(lightTextColor).font(bodyFont)
        .text('Invoice Number:', rightAlignX, customerInfoTop);
        doc.fontSize(10).fillColor(headingColor).font(headerFont)
        .text(appointment.paymentId._id, valueX, customerInfoTop, { width: columnWidth });

        doc.moveDown(1); 

        doc.fontSize(10).fillColor(lightTextColor).font(bodyFont)
        .text('Date of Issue:', rightAlignX);
        doc.fontSize(10).fillColor(headingColor).font(headerFont)
        .text(moment(appointment.createdAt).format('DD MMMM YYYY'), valueX, doc.y - 12, { width: columnWidth });

        doc.moveDown(1);

        doc.fontSize(10).fillColor(lightTextColor).font(bodyFont)
        .text('Service Provider:', rightAlignX);
        doc.fontSize(10).fillColor(headingColor).font(headerFont)
        .text(appointment.lawyerId.userId.name, valueX, doc.y - 12, { width: columnWidth });
        
        doc.y = customerInfoTop + 45; 
        doc.moveDown(3);
    };

    const drawInvoiceTable = () => {
        const tableTop = doc.y;
        
        doc.rect(50, tableTop, 510, 30).fill(primaryColor);
        doc.fontSize(10).fillColor('#FFFFFF').font(headerFont);
        doc.text('ITEM', 60, tableTop + 10, { width: 140 });
        doc.text('DESCRIPTION', 220, tableTop + 10, { width: 250 });
        doc.text('AMOUNT', 450, tableTop + 10, { align: 'right', width: 100 });
        
        doc.moveDown(3);

        const totalAmount = appointment.paymentId.amount;
        const consultationFee = totalAmount * 0.95; 
        const platformFee = totalAmount - consultationFee;
        const appointmentDate = moment(appointment.timeSlotId.startTime).format('DD MMM YYYY');

        const drawTableRow = (item, description, amount) => {
            const rowY = doc.y;
            const rowHeight = Math.max(
                doc.heightOfString(description, { width: 250, font: bodyFont, size: 10 }),
                20 
            );

            doc.fontSize(10).fillColor(headingColor).font(headerFont).text(item, 60, rowY, { width: 140 });
            doc.fillColor(textColor).font(bodyFont).text(description, 220, rowY, { width: 250 });
            doc.font(headerFont).text(`INR ${amount.toFixed(2)}`, 450, rowY, { align: 'right', width: 100 });

            doc.y = rowY + rowHeight + 10; 
            drawLine(doc.y);
            doc.moveDown(1.5);
        };

        drawTableRow('Legal Consultation', `Service provided by ${appointment.lawyerId.userId.name} on ${appointmentDate}`, consultationFee);
        drawTableRow('Platform Service Fee', 'Fee for using the CounselDesk platform services', platformFee);
        
        doc.moveDown(2);
    };

    const drawFooter = () => {
        const total = appointment.paymentId.amount.toFixed(2);
        
        const totalY = doc.y; 
        doc.fontSize(12).font(headerFont).text('Total Paid:', 350, totalY, { align: 'left' });
        doc.text(`INR ${total}`, 0, totalY, { align: 'right' }); 
        
        doc.fontSize(9).font('Helvetica-Oblique').fillColor(lightTextColor)
           .text('Payment was processed securely. Thank you for choosing CounselDesk!', 
           50, doc.page.height - 70, { align: 'center' });
    };

    await drawHeader();
    drawCustomerInfo();
    drawInvoiceTable();
    drawFooter();

    doc.end();
};