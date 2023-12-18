export function base64encode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)));
}

export async function exportPKCS8PrivateKeyPem(privateKey: CryptoKey) {
  const privatePem = await crypto.subtle.exportKey("pkcs8", privateKey);
  return (
    `-----BEGIN PRIVATE KEY-----\n` +
    base64encode(privatePem)
      .match(/.{1,64}/g)
      .join("\n") +
    `\n-----END PRIVATE KEY-----`
  );
}

export async function exportSPKIPublicKeyPem(publicKey: CryptoKey) {
  const publicPem = await crypto.subtle.exportKey("spki", publicKey);

  return (
    `-----BEGIN PUBLIC KEY-----\n` +
    base64encode(publicPem)
      .match(/.{1,64}/g)
      .join("\n") +
    `\n-----END PUBLIC KEY-----`
  );
}
