import * as crypto from "crypto";

export function createHash(algorithm: string) {
  return crypto.createHash(algorithm);
}
