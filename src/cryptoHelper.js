// // src/cryptoHelper.js
// const encoder = new TextEncoder();
// const decoder = new TextDecoder();

// function arrayBufferToBase64(buffer) {
//   return btoa(String.fromCharCode(...new Uint8Array(buffer)));
// }

// function base64ToArrayBuffer(base64) {
//   try {
//     const binary = atob(base64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//       bytes[i] = binary.charCodeAt(i);
//     }
//     return bytes.buffer;
//   } catch (err) {
//     console.warn('base64 decode failed:', err, base64);
//     return new ArrayBuffer(0); // return empty buffer to fail gracefully
//   }
// }

// export async function generateKey(password) {
//   const pwUtf8 = encoder.encode(password);
//   const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
//   return crypto.subtle.importKey('raw', pwHash, 'AES-GCM', false, ['encrypt', 'decrypt']);
// }

// export async function encryptData(data, key) {
//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const encoded = encoder.encode(JSON.stringify(data));
//   const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
//   return {
//     iv: arrayBufferToBase64(iv),
//     data: arrayBufferToBase64(encrypted)
//   };
// }

// export async function decryptData(encryptedObj, key) {
//   try {
//     const iv = base64ToArrayBuffer(encryptedObj.iv);
//     const encryptedData = base64ToArrayBuffer(encryptedObj.data);
//     if (iv.byteLength === 0 || encryptedData.byteLength === 0) throw new Error("Empty buffer");
//     const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
//     return JSON.parse(decoder.decode(decrypted));
//   } catch (err) {
//     console.warn('Decryption failed:', err);
//     return null;
//   }
// }

// cryptoHelper.js
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

let cachedKey = null;

async function getKey() {
  if (cachedKey) return cachedKey;

  const stored = localStorage.getItem('peerixEncryptionKey');
  if (stored) {
    try {
      const raw = base64ToArrayBuffer(stored);
      cachedKey = await window.crypto.subtle.importKey(
        'raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']
      );
      return cachedKey;
    } catch (err) {
      console.warn('Failed to import key from storage:', err);
    }
  }

  // generate new key
  cachedKey = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const rawKey = await window.crypto.subtle.exportKey('raw', cachedKey);
  localStorage.setItem('peerixEncryptionKey', arrayBufferToBase64(rawKey));
  return cachedKey;
}

export async function encryptData(plainObject) {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = textEncoder.encode(JSON.stringify(plainObject));
  const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  return JSON.stringify({
    iv: arrayBufferToBase64(iv),
    data: arrayBufferToBase64(ciphertext)
  });
}

export async function decryptData(encryptedString) {
  try {
    const parsed = JSON.parse(encryptedString);
    const key = await getKey();
    const iv = base64ToArrayBuffer(parsed.iv);
    const data = base64ToArrayBuffer(parsed.data);
    const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return JSON.parse(textDecoder.decode(decrypted));
  } catch (err) {
    console.warn('Decryption failed:', err);
    throw err;
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '');
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
