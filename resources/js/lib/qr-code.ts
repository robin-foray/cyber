import QRCode from 'qrcode';

export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrCodeOptions = {
    width: number;
    margin: number;
    errorCorrectionLevel: QrErrorCorrectionLevel;
};

export const DEFAULT_QR_OPTIONS: QrCodeOptions = {
    width: 320,
    margin: 2,
    errorCorrectionLevel: 'M',
};

export function isQrCodeDataUrl(dataUrl: string): boolean {
    return dataUrl.startsWith('data:image/png;base64,') && dataUrl.length > 'data:image/png;base64,'.length;
}

export async function generateQrCodeDataUrl(value: string, options: Partial<QrCodeOptions> = {}): Promise<string> {
    const merged = { ...DEFAULT_QR_OPTIONS, ...options };

    return QRCode.toDataURL(value, {
        width: merged.width,
        margin: merged.margin,
        errorCorrectionLevel: merged.errorCorrectionLevel,
        color: {
            dark: '#ccff00',
            light: '#000000',
        },
    });
}
