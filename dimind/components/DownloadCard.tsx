"use client";

import type { Attachment } from "@/lib/types";

function base64ToBlob(base64: string, mime: string): Blob {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export function DownloadCard({ attachment }: { attachment: Attachment }) {
  const handleDownload = () => {
    if (!attachment.base64) return;
    const blob = base64ToBlob(attachment.base64, attachment.mime);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const isQr = attachment.type === "qr";
  const previewSrc =
    isQr && attachment.base64 ? `data:${attachment.mime};base64,${attachment.base64}` : null;

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-edge bg-void/60 p-3">
      {previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewSrc}
          alt={`QR code for ${attachment.filename}`}
          className="h-14 w-14 rounded-lg border border-edge-soft bg-white p-1"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-edge-soft bg-elevated font-mono text-xs text-signal">
          PDF
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{attachment.filename}</p>
        <p className="text-xs text-ink-faint">{isQr ? "QR code" : "PDF document"} ready</p>
      </div>
      <button
        onClick={handleDownload}
        className="shrink-0 rounded-lg bg-synapse-gradient px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
      >
        Download
      </button>
    </div>
  );
}
