import PDFDocument from "pdfkit";

export const generateInvoicePDF = (sale, res) => {
  if (!sale) {
    throw new Error("Sale data not found");
  }

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${sale.invoiceNo}.pdf`
  );

  doc.pipe(res);

  // ===== TITLE =====
  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  // ===== CUSTOMER DETAILS =====
  doc.fontSize(12);
  doc.text(`Invoice No: ${sale.invoiceNo}`);
  doc.text(`Customer Name: ${sale.customerName}`);
  doc.text(`Mobile: ${sale.Mobile}`);
  doc.text(`Date: ${sale.createdAt?.toLocaleDateString()}`);
  doc.moveDown(2);

  // ===== TABLE HEADER =====
  const tableTop = doc.y;
  const col1 = 50;   // Product
  const col2 = 250;  // Qty
  const col3 = 320;  // Price
  const col4 = 420;  // Total

  doc.fontSize(12).text("Product", col1, tableTop);
  doc.text("Qty", col2, tableTop);
  doc.text("Price", col3, tableTop);
  doc.text("Total", col4, tableTop);

  // Header underline
  doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let rowY = tableTop + 25;

  // ===== TABLE ROWS =====
  sale.saleItems.forEach((item, index) => {
    const itemTotal = item.qnty * item.price;

    doc.text(item.productName, col1, rowY);
    doc.text(item.qnty.toString(), col2, rowY);
    doc.text(item.price.toFixed(2), col3, rowY);
    doc.text(itemTotal.toFixed(2), col4, rowY);

    // Row bottom line
    doc.moveTo(40, rowY + 15).lineTo(550, rowY + 15).stroke();

    rowY += 25;
  });

  doc.moveDown(2);

  // ===== TOTAL SECTION =====
  doc.fontSize(12);
  doc.text(`Total: ₹${sale.total}`, { align: "right" });
  doc.text(`Discount: ${sale.discount}%`, { align: "right" });
  doc.text(`GST: ${sale.gst}%`, { align: "right" });
  doc.fontSize(14).text(`Net Amount: ₹${sale.netAmount}`, {
    align: "center",
    underline: true,
  });

  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for your business!", { align: "center" });

  doc.end();
};