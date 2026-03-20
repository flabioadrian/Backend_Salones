export const logger = {
    info: (msg) => {
        console.log(`[INFO] ${new Date().toLocaleString()}: ${msg}`);
    },
    error: (msg, err) => {
        console.error(`[ERROR] ${new Date().toLocaleString()}: ${msg}`, err || '');
    },
    warn: (msg) => {
        console.warn(`[WARN] ${new Date().toLocaleString()}: ${msg}`);
    }
};