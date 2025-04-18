const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order, payment, filepath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    doc.fontSize(20).text("Your Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Invoice ID: ${payment._id}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Email: ${order.user.email}`);
    doc.text(`Payment Status: ${payment.status}`);
    doc.text(`Payment Date: ${new Date(payment.createdAt).toLocaleDateString()}`);
    doc.text(`Amount Paid: ₹${payment.amount}`);

    doc.moveDown();
    doc.text("Items:");
    order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ₹${item.price} x ${item.quantity}`);
    });

    doc.end();

    stream.on("finish", () => resolve(filepath));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = generateInvoice;
