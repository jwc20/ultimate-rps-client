import CryptoJS from "crypto-js";

const secret = "buttfart"; // In a real app, use environment variables

export const twoWayEncAES = {
    encrypt: function (text) {
        const bytes = [];
        for (let i = 0; i < secret.length; i++) {
            bytes.push(secret.charCodeAt(i));
        }


        let keyBytes = bytes;
        if (keyBytes.length > 16) {
            keyBytes = keyBytes.slice(0, 16);
        } else {
            while (keyBytes.length < 16) {
                keyBytes.push(0);
            }
        }

        // Convert key to WordArray for crypto-js
        const keyWordArray = this._bytesToWordArray(keyBytes);

        // Use the same key as IV
        const ivWordArray = keyWordArray;

        // Encrypt using AES-CBC with PKCS7 padding
        if (typeof CryptoJS !== "undefined") {
            const encrypted = CryptoJS.AES.encrypt(text, keyWordArray, {
                iv: ivWordArray,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            return encrypted.toString();
        } else {
            throw new Error(
                "CryptoJS library not loaded. Please include crypto-js library."
            );
        }

        // return CryptoJS.AES.encrypt(text, secret).toString();
    },
    decrypt: function (ciphertext) {
        const bytes = [];
        for (let i = 0; i < secret.length; i++) {
            bytes.push(secret.charCodeAt(i));
        }

        try {
          // Prepare key - truncate or pad to 16 bytes
          let keyBytes = bytes
          if (keyBytes.length > 16) {
              keyBytes = keyBytes.slice(0, 16);
          } else {
              while (keyBytes.length < 16) {
                  keyBytes.push(0);
              }
          }
          
          // Convert key to WordArray for crypto-js
          const keyWordArray = this._bytesToWordArray(keyBytes);
          
          // Use the same key as IV
          const ivWordArray = keyWordArray;
          
          // Decrypt using AES-CBC with PKCS7 padding
          if (typeof CryptoJS !== 'undefined') {
              const decrypted = CryptoJS.AES.decrypt(value, keyWordArray, {
                  iv: ivWordArray,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7
              });
              return decrypted.toString(CryptoJS.enc.Utf8);
          } else {
              throw new Error('CryptoJS library not loaded. Please include crypto-js library.');
          }
      } catch (error) {
          return '';
      }
    },

    _bytesToWordArray(bytes) {
        const words = [];
        for (let i = 0; i < bytes.length; i += 4) {
            words.push(
                (bytes[i] << 24) |
                    (bytes[i + 1] << 16) |
                    (bytes[i + 2] << 8) |
                    bytes[i + 3]
            );
        }
        return CryptoJS.lib.WordArray.create(words, bytes.length);
    },
};
