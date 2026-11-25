// One Line, One Laugh entry: a single self-contained joke, 96 characters.
// The twist lands in the last clause: the AI did its job too well.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I asked the AI to write my dating bio. It described me so accurately I reported it for stalking.";

const MAX_CHARS = 140;

function fail(message: string): never {
  throw new Error(`entry invalid: ${message}`);
}

if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`length ${LINE.length} is outside the 1 to ${MAX_CHARS} character gate`);
}
if (LINE.trim().length === 0) {
  fail("line is only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
// Control characters other than tab would corrupt a one-line text entry.
for (const ch of LINE) {
  const code = ch.codePointAt(0) ?? 0;
  if ((code < 0x20 && ch !== "\t") || code === 0x7f) {
    fail(`line contains a control character (U+${code.toString(16).padStart(4, "0")})`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip read-back check: what landed on disk must be exactly the line.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  fail("read-back mismatch: entry.txt does not match the line");
}
if (Buffer.byteLength(back, "utf8") !== LINE.length) {
  fail("read-back byte length mismatch");
}
