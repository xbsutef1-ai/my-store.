import crypto from "crypto";
import fs from "fs";

export function hashImage(path) {
  const buf = fs.readFileSync(path);
  return crypto.createHash("sha256").update(buf).digest("hex");
}
