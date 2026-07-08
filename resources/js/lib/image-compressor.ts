export function getTargetSize(width: number, height: number, maxWidth: number, maxHeight: number) {
    const safeMaxWidth = Math.max(64, maxWidth || width);
    const safeMaxHeight = Math.max(64, maxHeight || height);
    const ratio = Math.min(1, safeMaxWidth / width, safeMaxHeight / height);

    return {
        width: Math.max(1, Math.round(width * ratio)),
        height: Math.max(1, Math.round(height * ratio)),
    };
}

export function formatBytes(bytes: number) {
    if (!bytes) {
        return 'waiting';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
