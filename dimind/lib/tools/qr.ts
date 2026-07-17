import type { Attachment } from "../types";

const QR_API = "https://api.qrserver.com/v1/create-qr-code/";

export interface QrToolResult {
  text: string;
  attachment?: Attachment;
}

export async function generateQr(args: {
  data?: string;
  text?: string;
  size?: string;
  filename?: string;
}): Promise<QrToolResult> {
  const data = (args.data || args.text || "").trim();

  if (!data) {
    return {
      text: "Yes, I can generate a QR code. Please provide the URL or text you want to convert into a QR code.",
    };
  }

  const size = args.size || "300x300";
  let filename = args.filename || "qrcode";
  filename = filename.replace(/[<>:"/\\|?*]/g, "").trim();
  if (!filename.toLowerCase().endsWith(".png")) filename += ".png";

  try {
    const res = await fetch(
      `${QR_API}?size=${encodeURIComponent(size)}&data=${encodeURIComponent(data)}`
    );
    if (!res.ok) throw new Error(`QR service responded with ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const base64 = buffer.toString("base64");

    return {
      text: `QR code generated successfully for: "${data}"`,
      attachment: {
        type: "qr",
        filename,
        base64,
        mime: "image/png",
      },
    };
  } catch (e: any) {
    return { text: `QR error: ${e?.message ?? e}` };
  }
}
