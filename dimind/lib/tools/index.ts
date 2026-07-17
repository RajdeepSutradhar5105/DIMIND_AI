import type { Attachment, ToolCallRequest, ToolExecutionResult } from "../types";
import { calculator } from "./calculator";
import { getCurrentTime } from "./time";
import { getWeather } from "./weather";
import { lookupDictionary } from "./dictionary";
import { convertUnit } from "./unit";
import { generateQr } from "./qr";
import { generatePdf } from "./pdf";
import { explainCode } from "./explainer";

export const TOOL_LABELS: Record<string, string> = {
  calculator: "Calculator",
  time: "Time",
  weather: "Weather",
  dictionary: "Dictionary",
  unit: "Unit Converter",
  unit_converter: "Unit Converter",
  qr: "QR Generator",
  pdf: "PDF Generator",
  explainer: "Code Explainer",
};

export async function executeTool(request: ToolCallRequest): Promise<ToolExecutionResult> {
  const name = (request.tool || "").trim().toLowerCase();

  switch (name) {
    case "calculator": {
      const expression = request.expression;
      if (typeof expression !== "string") {
        return { text: "Calculate error: missing or invalid expression" };
      }
      return { text: calculator(expression) };
    }

    case "time": {
      return { text: getCurrentTime() };
    }

    case "weather": {
      const city = typeof request.city === "string" ? request.city : undefined;
      return { text: await getWeather(city) };
    }

    case "dictionary": {
      const query = request.query ?? request.word ?? request;
      return { text: await lookupDictionary(query) };
    }

    case "unit":
    case "unit_converter": {
      return {
        text: convertUnit({
          value: request.value,
          from: (request.from as string) ?? (request.from_unit as string),
          to: (request.to as string) ?? (request.to_unit as string),
        }),
      };
    }

    case "qr": {
      const result = await generateQr({
        data: (request.data as string) ?? (request.text as string),
        size: request.size as string,
        filename: request.filename as string,
      });
      return { text: result.text, attachment: result.attachment as Attachment | undefined };
    }

    case "pdf": {
      const result = await generatePdf({
        filename: request.filename as string,
        content: request.content as any,
      });
      return { text: result.text, attachment: result.attachment as Attachment | undefined };
    }

    case "explainer": {
      const text = await explainCode({
        language: request.language as string,
        code: request.code as string,
      });
      return { text };
    }

    default:
      return { text: `Unknown tool '${request.tool}' not found.` };
  }
}
