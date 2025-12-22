import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

type ProductionItem = {
  productName: string;
  color: string;
  size: string;
  quantity: number;
};

export async function generateProductionPdf(
  orderId: string,
  customerName: string,
  items: ProductionItem[]
): Promise<string> {
  const outputDir = path.join(process.cwd(), "storage", "pdfs");
  const outputPath = path.join(outputDir, `order-${orderId}.pdf`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  // Title
  page.drawText("Production Sheet", {
    x: 50,
    y,
    size: 20,
    font: boldFont,
  });

  y -= 40;

  // Meta
  page.drawText(`Order ID: ${orderId}`, {
    x: 50,
    y,
    size: 11,
    font,
  });

  y -= 16;

  page.drawText(`Customer: ${customerName}`, {
    x: 50,
    y,
    size: 11,
    font,
  });

  y -= 30;

  // Table Header
  page.drawText("Items", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
  });

  y -= 20;

  page.drawText("Product", { x: 50, y, size: 10, font: boldFont });
  page.drawText("Color", { x: 250, y, size: 10, font: boldFont });
  page.drawText("Size", { x: 340, y, size: 10, font: boldFont });
  page.drawText("Qty", { x: 400, y, size: 10, font: boldFont });

  y -= 12;

  page.drawLine({
    start: { x: 50, y },
    end: { x: 500, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= 16;

  // Rows
  items.forEach((item) => {
    page.drawText(item.productName, { x: 50, y, size: 10, font });
    page.drawText(item.color, { x: 250, y, size: 10, font });
    page.drawText(item.size, { x: 340, y, size: 10, font });
    page.drawText(String(item.quantity), { x: 400, y, size: 10, font });

    y -= 16;
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
}
