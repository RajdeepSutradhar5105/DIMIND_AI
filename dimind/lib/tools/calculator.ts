/**
 * Safe arithmetic evaluator. No `eval`/`Function` is used — expressions are
 * tokenized and parsed by hand, mirroring the AST-whitelist approach of the
 * original Calculator.py.
 */

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sqrt: Math.sqrt,
  log: Math.log,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
  abs: Math.abs,
  round: (x: number) => Math.round(x),
};

type Token = { type: "num" | "op" | "lparen" | "rparen" | "comma" | "ident"; value: string };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: "num", value: num });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < expr.length && /[a-zA-Z_0-9]/.test(expr[i])) {
        ident += expr[i];
        i++;
      }
      tokens.push({ type: "ident", value: ident });
      continue;
    }
    if ("+-*/%^".includes(ch)) {
      // support ** as power
      if (ch === "*" && expr[i + 1] === "*") {
        tokens.push({ type: "op", value: "^" });
        i += 2;
        continue;
      }
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen", value: ch });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen", value: ch });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "comma", value: ch });
      i++;
      continue;
    }
    throw new Error(`Unexpected character '${ch}'`);
  }
  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parseExpression(): number {
    let value = this.parseTerm();
    while (this.peek() && this.peek()!.type === "op" && ["+", "-"].includes(this.peek()!.value)) {
      const op = this.next()!.value;
      const rhs = this.parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  private parseTerm(): number {
    let value = this.parseUnary();
    while (
      this.peek() &&
      this.peek()!.type === "op" &&
      ["*", "/", "%"].includes(this.peek()!.value)
    ) {
      const op = this.next()!.value;
      const rhs = this.parseUnary();
      if (op === "*") value = value * rhs;
      else if (op === "/") value = value / rhs;
      else value = value % rhs;
    }
    return value;
  }

  private parseUnary(): number {
    if (this.peek() && this.peek()!.type === "op" && this.peek()!.value === "-") {
      this.next();
      return -this.parseUnary();
    }
    if (this.peek() && this.peek()!.type === "op" && this.peek()!.value === "+") {
      this.next();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  private parsePower(): number {
    const base = this.parseAtom();
    if (this.peek() && this.peek()!.type === "op" && this.peek()!.value === "^") {
      this.next();
      const exponent = this.parseUnary();
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parseAtom(): number {
    const token = this.next();
    if (!token) throw new Error("Unexpected end of expression");

    if (token.type === "num") {
      return parseFloat(token.value);
    }

    if (token.type === "lparen") {
      const value = this.parseExpression();
      const closing = this.next();
      if (!closing || closing.type !== "rparen") throw new Error("Missing closing parenthesis");
      return value;
    }

    if (token.type === "ident") {
      const fn = FUNCTIONS[token.value];
      if (!fn) throw new Error(`Unsupported function: ${token.value}`);
      const open = this.next();
      if (!open || open.type !== "lparen") throw new Error(`Expected '(' after ${token.value}`);
      const args: number[] = [];
      if (this.peek() && this.peek()!.type !== "rparen") {
        args.push(this.parseExpression());
        while (this.peek() && this.peek()!.type === "comma") {
          this.next();
          args.push(this.parseExpression());
        }
      }
      const close = this.next();
      if (!close || close.type !== "rparen") throw new Error("Missing closing parenthesis");
      return fn(...args);
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }
}

export function calculator(expression: string): string {
  try {
    const tokens = tokenize(expression);
    const parser = new Parser(tokens);
    const result = parser.parseExpression();
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      return `Calculate error: result is not a finite number`;
    }
    return String(result);
  } catch (e: any) {
    return `Calculate error: ${e?.message ?? e}`;
  }
}
