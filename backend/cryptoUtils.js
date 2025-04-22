const CryptoJS = require('crypto-js');

// Secret key for encryption/decryption (should be stored securely in environment variables in production)
const SECRET_KEY = 'your-secret-key-here'; // Replace this with your actual secret key

/**
 * Encrypts data using AES encryption
 * @param {string} data - The data to encrypt
 * @returns {string} - The encrypted data
 */
const encrypt = (data) => {
    try {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
        return encryptedData;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * Decrypts data that was encrypted using AES encryption
 * @param {string} encryptedData - The encrypted data to decrypt
 * @returns {any} - The decrypted data
 */
const decrypt = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

/**
 * Hashes data using SHA-256
 * @param {string} data - The data to hash
 * @returns {string} - The hashed data
 */
const hash = (data) => {
    try {
        return CryptoJS.SHA256(data).toString();
    } catch (error) {
        console.error('Hashing error:', error);
        throw new Error('Failed to hash data');
    }
};

module.exports = {
    encrypt,
    decrypt,
    hash
}; 