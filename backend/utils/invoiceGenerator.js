const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const {uploadToCloudinary} = require("./cloudinaryUpload");

const generateInvoice = (order, payment) => {
  return new Promise((resolve, reject) => {
    const filename = `invoice-${order._id}.pdf`;
    const filepath = path.join(__dirname, "../temp", filename);
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

    stream.on("finish", async () => {
      try {
        // Organize Cloudinary folder structure
        const cloudUrl = await uploadToCloudinary(filepath, `invoices/${order._id}`, "raw");
        resolve(cloudUrl); // Send Cloudinary URL back
      } catch (error) {
        reject(error); // Catch and forward Cloudinary upload error
      }
    });

    stream.on("error", (err) => reject(err)); // Catch errors in PDF creation
  });
};


module.exports = generateInvoice;
