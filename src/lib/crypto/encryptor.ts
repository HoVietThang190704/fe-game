import { EncryptResponse } from "@/src/lib/interface/login";

function toBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window !== "undefined" ? window.btoa(binary) : Buffer.from(binary, "binary").toString("base64");
}

export async function encryptPassword(password: string): Promise<EncryptResponse> {
  const keyBase = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || null;
  if (!keyBase || typeof window === "undefined" || !window.crypto?.subtle) {
    return { iv: "", ciphertext: typeof window !== "undefined" ? window.btoa(password) : Buffer.from(password).toString("base64"), tag: "" };
  }

  try {
    const keyRaw = Uint8Array.from(atob(keyBase), (c) => c.charCodeAt(0));
    const cryptoKey = await window.crypto.subtle.importKey("raw", keyRaw.buffer, { name: "AES-GCM" }, false, ["encrypt"]);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ct = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, enc.encode(password));
    return { iv: toBase64(iv.buffer), ciphertext: toBase64(ct), tag: "" };
  } catch (e) {
    return { iv: "", ciphertext: typeof window !== "undefined" ? window.btoa(password) : Buffer.from(password).toString("base64"), tag: "" };
  }
}
