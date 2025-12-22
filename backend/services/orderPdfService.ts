import { PDFDocument, StandardFonts } from "pdf-lib";
import { getOrderById } from "./orderService";

export async function generateOrderPdf(orderId: string): Promise<Uint8Array> {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  page.drawText("PRODUCTION SHEET", {
    x: 50,
    y,
    size: 18,
    font,
  });

  y -= 40;

  page.drawText(`Order ID: ${order.id}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Customer: ${order.customerName}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Created: ${order.createdAt.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  y -= 40;
  page.drawText("Items:", { x: 50, y, size: 14, font });
  y -= 20;

  order.items.forEach((item: any, index: number) => {
    page.drawText(
      `${index + 1}. ${item.productId} | ${item.color} | ${item.size} | Qty: ${item.quantity}`,
      { x: 60, y, size: 12, font }
    );
    y -= 20;
  });

  return await pdfDoc.save();
}
