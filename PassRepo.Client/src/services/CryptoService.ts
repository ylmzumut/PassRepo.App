import _sodium from 'libsodium-wrappers-sumo';

export class CryptoService {
  private static sodium: typeof _sodium | null = null;

  static async init() {
    if (!this.sodium) {
      await _sodium.ready;
      this.sodium = _sodium;
    }
    return this.sodium;
  }

  // 1. Derive Keys from Master Password (Argon2id)
  // Returns { encryptionKey, authKey }
  static async deriveKeys(password: string, salt: string): Promise<{ encryptionKey: Uint8Array, authKey: string }> {
    const sodium = await this.init();

    // Convert salt string to Uint8Array (must be correct length for chosen ops, usually 16 or 32 bytes)
    // Assuming salt stored as hex or base64. Let's assume hex or raw string. 
    // Ideally salt should be random bytes.
    // For simplicity here, let's treat the salt input as a string we need to hash or pad if needed, 
    // but proper implementation expects a specific length salt.
    // Let's assume the salt from server/registration is a hex string representing 16 bytes.
    let saltBytes: Uint8Array;

    if (salt.length === 32) { // 16 bytes hex = 32 chars
      saltBytes = sodium.from_hex(salt);
    } else {
      // Fallback or just use what is given if it matches requirements.
      // Argon2id requires 16 bytes salt
      saltBytes = sodium.from_string(salt.padEnd(16, '0').slice(0, 16));
    }

    const key = sodium.crypto_pwhash(
      32, // Key length
      password,
      saltBytes,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    // Derive Auth Key (Hash of Encryption Key)
    // We send AuthKey to server. Server stores Hash(AuthKey) or AuthKey itself if it is already a hash?
    // User requirement: "auth/register: Email, AuthKeyHash, Salt"
    // So Client computes:
    // Key_Enc = Argon2id(Pass, Salt)
    // Key_Auth = sha256(Key_Enc) <- This is what we use to authenticate?
    // Let's stick to the plan:
    // AuthKeyHash = sodium.to_hex(sodium.crypto_hash_sha256(key)); // This is what we send to register/login?

    // Actually, usually:
    // 1. Key_Enc derived for local encryption.
    // 2. Key_Auth derived from Key_Enc or Parallel derivation.
    // Let's use Sha256 of Key_Enc as the Auth Token to send to server.

    // BUT, if we send Sha256(Key_Enc) to register, and the server stores it.
    // Then to login, we send Sha256(Key_Enc). The server compares.
    // A man-in-the-middle or database leak reveals Sha256(Key_Enc), which allows impersonation.
    // Zero-Knowledge usually means we prove we know the password without sending the key.
    // A common simple way:
    // Client sends Hash(Key_Enc). Server stores Hash(Hash(Key_Enc)).
    // To login, Client sends Hash(Key_Enc). Server hashes it and compares to stored value.
    // Let's implement providing the 'AuthKey' which is Key_Enc (or a derivative).

    // Let's follow the standard "Don't send password" rule.
    // We will return the raw Encryption Key (for usage) and the AuthKeyHash (to send to server).

    const authKey = sodium.to_hex(sodium.crypto_hash_sha256(key));

    return { encryptionKey: key, authKey: authKey };
  }

  static async generateSalt(): Promise<string> {
    const sodium = await this.init();
    return sodium.to_hex(sodium.randombytes_buf(16));
  }

  // 2. Encrypt (XChaCha20-Poly1305)
  // Returns { ciphertext (as hex or base64), nonce (as hex) }
  static async encrypt(data: any, key: Uint8Array): Promise<{ encryptedBlob: string, nonce: string }> {
    const sodium = await this.init();
    const json = JSON.stringify(data);
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);

    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
      json,
      null,
      null,
      nonce,
      key
    );

    return {
      encryptedBlob: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
      nonce: sodium.to_hex(nonce)
    };
  }

  // 3. Decrypt
  static async decrypt(encryptedBlob: string, nonceHex: string, key: Uint8Array): Promise<any> {
    const sodium = await this.init();
    const ciphertext = sodium.from_base64(encryptedBlob, sodium.base64_variants.ORIGINAL);
    const nonce = sodium.from_hex(nonceHex);

    const decrypted = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      ciphertext,
      null,
      nonce,
      key
    );

    return JSON.parse(sodium.to_string(decrypted));
  }
}
