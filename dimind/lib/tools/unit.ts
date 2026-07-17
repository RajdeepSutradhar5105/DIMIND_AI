const ALIASES: Record<string, string> = {
  km: "kilometer",
  kilometer: "kilometer",
  kilometers: "kilometer",
  mile: "mile",
  miles: "mile",
  kg: "kilogram",
  kilogram: "kilogram",
  kilograms: "kilogram",
  lb: "pound",
  lbs: "pound",
  pound: "pound",
  pounds: "pound",
  c: "celsius",
  celsius: "celsius",
  fahrenheit: "fahrenheit",
  f: "fahrenheit",
};

export function convertUnit(args: {
  value?: unknown;
  from?: string;
  to?: string;
}): string {
  const { value: rawValue, from, to } = args;
  const fromUnit = (from || "").trim().toLowerCase();
  const toUnit = (to || "").trim().toLowerCase();

  if (rawValue === undefined || rawValue === null || !fromUnit || !toUnit) {
    return "Unit error: missing value, from unit, or to unit";
  }

  const value = typeof rawValue === "number" ? rawValue : parseFloat(String(rawValue));
  if (Number.isNaN(value)) return "Unit error: invalid value";

  const normFrom = ALIASES[fromUnit] ?? fromUnit;
  const normTo = ALIASES[toUnit] ?? toUnit;

  if (normFrom === normTo) {
    return `${value} ${fromUnit} = ${value} ${toUnit}`;
  }

  let result: number;
  if (normFrom === "kilometer" && normTo === "mile") result = value * 0.621371;
  else if (normFrom === "mile" && normTo === "kilometer") result = value * 1.60934;
  else if (normFrom === "kilogram" && normTo === "pound") result = value * 2.20462;
  else if (normFrom === "pound" && normTo === "kilogram") result = value * 0.453592;
  else if (normFrom === "celsius" && normTo === "fahrenheit") result = (value * 9) / 5 + 32;
  else if (normFrom === "fahrenheit" && normTo === "celsius") result = ((value - 32) * 5) / 9;
  else return `Unit error: unsupported conversion from '${fromUnit}' to '${toUnit}'`;

  return `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
}
