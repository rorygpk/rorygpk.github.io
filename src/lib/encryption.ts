// AES-like Pseudo encryption layer for symmetric double-encryption
// over the HTTPS channel as requested by the user.
export function encryptData(data: string, key: string = "fatshan-secure"): string {
  try {
    const jsonStr = JSON.stringify(data);
    let result = "";
    for (let i = 0; i < jsonStr.length; i++) {
       result += String.fromCharCode(jsonStr.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encodeURIComponent(result));
  } catch(e) {
    return data;
  }
}

export function decryptData(encrypted: string, key: string = "fatshan-secure"): string {
  try {
    const decoded = decodeURIComponent(atob(encrypted));
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
       result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return JSON.parse(result);
  } catch(e) {
    return encrypted;
  }
}