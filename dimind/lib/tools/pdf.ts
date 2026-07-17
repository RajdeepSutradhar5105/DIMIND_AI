import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import type { Attachment } from "../types";

interface PdfContentItem {
  type: string;
  text?: string;
  items?: string[];
}

export interface PdfToolResult {
  text: string;
  attachment?: Attachment;
}

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export async function generatePdf(args: {
  filename?: string;
  content?: PdfContentItem[];
}): Promise<PdfToolResult> {
  try {
    const content = Array.isArray(args.content) ? args.content : [];
    if (content.length === 0) {
      return { text: "Sure! Please provide the content you would like inside the PDF." };
    }

    let filename = args.filename;
    if (filename) {
      filename = filename.replace(/[<>:"/\\|?*]/g, "").trim();
      if (!filename.toLowerCase().endsWith(".pdf")) filename += ".pdf";
    } else {
      filename = `document_${Date.now()}.pdf`;
    }

    const pdfDoc = await PDFDocument.create();
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;
    const maxWidth = PAGE_WIDTH - MARGIN * 2;

    const ensureSpace = (needed: number) => {
      if (y - needed < MARGIN) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
    };

    const drawLines = (
      lines: string[],
      font: PDFFont,
      size: number,
      color = rgb(0.08, 0.08, 0.12),
      indent = 0,
      align: "left" | "center" = "left",
      lineGap = 4
    ) => {
      for (const line of lines) {
        ensureSpace(size + lineGap);
        let x = MARGIN + indent;
        if (align === "center") {
          const w = font.widthOfTextAtSize(line, size);
          x = (PAGE_WIDTH - w) / 2;
        }
        page.drawText(line, { x, y, size, font, color });
        y -= size + lineGap;
      }
    };

    for (const item of content) {
      const type = (item.type || "").toLowerCase();

      if (type === "header") {
        const lines = wrapText(item.text || "", boldFont, 22, maxWidth);
        drawLines(lines, boldFont, 22, rgb(0.23, 0.44, 1), 0, "center", 6);
        y -= 14;
      } else if (type === "heading") {
        ensureSpace(30);
        const lines = wrapText(item.text || "", boldFont, 15, maxWidth);
        drawLines(lines, boldFont, 15, rgb(0.55, 0.36, 0.96), 0, "left", 5);
        y -= 6;
      } else if (type === "paragraph") {
        const lines = wrapText(item.text || "", regularFont, 11, maxWidth);
        drawLines(lines, regularFont, 11, rgb(0.12, 0.12, 0.16), 0, "left", 5);
        y -= 8;
      } else if (type === "bullet") {
        for (const bulletText of item.items ?? []) {
          const lines = wrapText(`•  ${bulletText}`, regularFont, 11, maxWidth - 14);
          drawLines(lines, regularFont, 11, rgb(0.12, 0.12, 0.16), 14, "left", 5);
        }
        y -= 8;
      }
    }

    const bytes = await pdfDoc.save();
    const base64 = Buffer.from(bytes).toString("base64");

    return {
      text: `PDF "${filename}" generated successfully.`,
      attachment: {
        type: "pdf",
        filename,
        base64,
        mime: "application/pdf",
      },
    };
  } catch (e: any) {
    return { text: `PDF error: ${e?.message ?? e}` };
  }
}
