import { hashImage } from "./imageHash.js";

const usedHashes = new Set();

export function verifyProof(imagePath) {
  const hash = hashImage(imagePath);

  if (usedHashes.has(hash)) {
    return { status: "duplicate" };
  }

  usedHashes.add(hash);
  return { status: "ok" };
}
