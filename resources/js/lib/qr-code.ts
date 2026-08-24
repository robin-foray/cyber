import QRCode from 'qrcode';

export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrModuleShape = 'square' | 'rounded' | 'soft' | 'dots' | 'diamond';

export type QrEyeStyle = 'square' | 'rounded' | 'circle' | 'leaf';

export type QrStyleId =
    | 'cyber'
    | 'cyber-rounded'
    | 'cyber-dots'
    | 'cyber-soft'
    | 'print'
    | 'mono-rounded'
    | 'inverted'
    | 'neon-blue'
    | 'magenta'
    | 'amber'
    | 'ice'
    | 'forest'
    | 'coral'
    | 'violet'
    | 'gold-classy'
    | 'blueprint'
    | 'sunset'
    | 'mint'
    | 'stark-dots'
    | 'diamond-neon';

export type QrStylePreset = {
    id: QrStyleId;
    label: string;
    dark: string;
    light: string;
    moduleShape: QrModuleShape;
    eyeStyle: QrEyeStyle;
};

export type QrLogoShape = 'circle' | 'rounded' | 'square';

export type QrCodeOptions = {
    width: number;
    margin: number;
    errorCorrectionLevel: QrErrorCorrectionLevel;
    styleId: QrStyleId;
    darkColor?: string;
    lightColor?: string;
    moduleShape?: QrModuleShape;
    eyeStyle?: QrEyeStyle;
    logoDataUrl?: string;
    logoRatio?: number;
    logoPad?: boolean;
    logoShape?: QrLogoShape;
    punchLogoHole?: boolean;
};

export const DEFAULT_QR_STYLE_ID: QrStyleId = 'cyber';

export const QR_STYLE_PRESETS: QrStylePreset[] = [
    { id: 'cyber', label: 'Cyber', dark: '#ccff00', light: '#000000', moduleShape: 'square', eyeStyle: 'square' },
    { id: 'cyber-rounded', label: 'Cyber Rounded', dark: '#ccff00', light: '#000000', moduleShape: 'rounded', eyeStyle: 'rounded' },
    { id: 'cyber-dots', label: 'Cyber Dots', dark: '#ccff00', light: '#000000', moduleShape: 'dots', eyeStyle: 'circle' },
    { id: 'cyber-soft', label: 'Cyber Soft', dark: '#ccff00', light: '#050505', moduleShape: 'soft', eyeStyle: 'rounded' },
    { id: 'print', label: 'Print Ready', dark: '#000000', light: '#ffffff', moduleShape: 'square', eyeStyle: 'square' },
    { id: 'mono-rounded', label: 'Mono Rounded', dark: '#111111', light: '#ffffff', moduleShape: 'rounded', eyeStyle: 'rounded' },
    { id: 'inverted', label: 'Inverted', dark: '#ffffff', light: '#000000', moduleShape: 'square', eyeStyle: 'square' },
    { id: 'neon-blue', label: 'Neon Blue', dark: '#00e5ff', light: '#0a1628', moduleShape: 'rounded', eyeStyle: 'circle' },
    { id: 'magenta', label: 'Magenta', dark: '#ff2bd6', light: '#120018', moduleShape: 'dots', eyeStyle: 'rounded' },
    { id: 'amber', label: 'Amber', dark: '#ffb000', light: '#1a1200', moduleShape: 'soft', eyeStyle: 'leaf' },
    { id: 'ice', label: 'Ice', dark: '#e8f4ff', light: '#0d1b2a', moduleShape: 'rounded', eyeStyle: 'circle' },
    { id: 'forest', label: 'Forest', dark: '#39ff14', light: '#0a1f0a', moduleShape: 'diamond', eyeStyle: 'square' },
    { id: 'coral', label: 'Coral', dark: '#ff6b4a', light: '#1a0a08', moduleShape: 'soft', eyeStyle: 'rounded' },
    { id: 'violet', label: 'Violet', dark: '#b388ff', light: '#12081f', moduleShape: 'dots', eyeStyle: 'leaf' },
    { id: 'gold-classy', label: 'Gold Classy', dark: '#d4af37', light: '#1a1508', moduleShape: 'rounded', eyeStyle: 'leaf' },
    { id: 'blueprint', label: 'Blueprint', dark: '#5b9bd5', light: '#0b1220', moduleShape: 'square', eyeStyle: 'square' },
    { id: 'sunset', label: 'Sunset', dark: '#ff5e3a', light: '#1a0d18', moduleShape: 'soft', eyeStyle: 'circle' },
    { id: 'mint', label: 'Mint', dark: '#98ffd0', light: '#061812', moduleShape: 'rounded', eyeStyle: 'rounded' },
    { id: 'stark-dots', label: 'Stark Dots', dark: '#0a0a0a', light: '#f5f5f5', moduleShape: 'dots', eyeStyle: 'circle' },
    { id: 'diamond-neon', label: 'Diamond Neon', dark: '#ccff00', light: '#101010', moduleShape: 'diamond', eyeStyle: 'leaf' },
];

export const DEFAULT_QR_OPTIONS: QrCodeOptions = {
    width: 320,
    margin: 2,
    errorCorrectionLevel: 'M',
    styleId: DEFAULT_QR_STYLE_ID,
};

export function getQrStylePreset(styleId: QrStyleId | string | undefined): QrStylePreset {
    const match = QR_STYLE_PRESETS.find((preset) => preset.id === styleId);

    return match ?? QR_STYLE_PRESETS[0];
}

export function isQrCodeDataUrl(dataUrl: string): boolean {
    if (dataUrl.startsWith('data:image/png;base64,') && dataUrl.length > 'data:image/png;base64,'.length) {
        return true;
    }

    if (dataUrl.startsWith('data:image/svg+xml') && dataUrl.length > 'data:image/svg+xml'.length + 16) {
        return true;
    }

    return false;
}

type ResolvedStyle = {
    dark: string;
    light: string;
    moduleShape: QrModuleShape;
    eyeStyle: QrEyeStyle;
};

function resolveStyle(options: Partial<QrCodeOptions>): ResolvedStyle {
    const preset = getQrStylePreset(options.styleId ?? DEFAULT_QR_STYLE_ID);

    return {
        dark: options.darkColor ?? preset.dark,
        light: options.lightColor ?? preset.light,
        moduleShape: options.moduleShape ?? preset.moduleShape,
        eyeStyle: options.eyeStyle ?? preset.eyeStyle,
    };
}

function isFinderCell(row: number, col: number, size: number): boolean {
    const inTopLeft = row < 7 && col < 7;
    const inTopRight = row < 7 && col >= size - 7;
    const inBottomLeft = row >= size - 7 && col < 7;

    return inTopLeft || inTopRight || inBottomLeft;
}

function modulePath(x: number, y: number, cell: number, shape: QrModuleShape): string {
    const cx = x + cell / 2;
    const cy = y + cell / 2;

    switch (shape) {
        case 'dots': {
            const radius = cell * 0.38;

            return `<circle cx="${cx}" cy="${cy}" r="${radius}" />`;
        }
        case 'diamond': {
            const half = cell * 0.46;
            const points = `${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}`;

            return `<polygon points="${points}" />`;
        }
        case 'rounded': {
            const radius = cell * 0.28;

            return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="${radius}" ry="${radius}" />`;
        }
        case 'soft': {
            const radius = cell * 0.45;

            return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="${radius}" ry="${radius}" />`;
        }
        case 'square':
        default:
            return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" />`;
    }
}

function eyeMarkup(ox: number, oy: number, cell: number, style: QrEyeStyle, dark: string, light: string): string {
    const size = cell * 7;
    const outer = 7 * cell;
    const frame = cell;
    const core = cell * 3;
    const coreOffset = cell * 2;

    if (style === 'circle') {
        const cx = ox + size / 2;
        const cy = oy + size / 2;

        return [
            `<circle cx="${cx}" cy="${cy}" r="${outer / 2}" fill="${dark}" />`,
            `<circle cx="${cx}" cy="${cy}" r="${outer / 2 - frame}" fill="${light}" />`,
            `<circle cx="${cx}" cy="${cy}" r="${core / 2}" fill="${dark}" />`,
        ].join('');
    }

    if (style === 'leaf') {
        const rx = cell * 1.6;

        return [
            `<rect x="${ox}" y="${oy}" width="${outer}" height="${outer}" rx="${rx}" ry="${rx}" fill="${dark}" />`,
            `<rect x="${ox + frame}" y="${oy + frame}" width="${outer - frame * 2}" height="${outer - frame * 2}" rx="${rx * 0.7}" ry="${rx * 0.7}" fill="${light}" />`,
            `<rect x="${ox + coreOffset}" y="${oy + coreOffset}" width="${core}" height="${core}" rx="${rx * 0.45}" ry="${rx * 0.45}" fill="${dark}" />`,
        ].join('');
    }

    if (style === 'rounded') {
        const rx = cell * 1.1;

        return [
            `<rect x="${ox}" y="${oy}" width="${outer}" height="${outer}" rx="${rx}" ry="${rx}" fill="${dark}" />`,
            `<rect x="${ox + frame}" y="${oy + frame}" width="${outer - frame * 2}" height="${outer - frame * 2}" rx="${rx * 0.75}" ry="${rx * 0.75}" fill="${light}" />`,
            `<rect x="${ox + coreOffset}" y="${oy + coreOffset}" width="${core}" height="${core}" rx="${rx * 0.5}" ry="${rx * 0.5}" fill="${dark}" />`,
        ].join('');
    }

    return [
        `<rect x="${ox}" y="${oy}" width="${outer}" height="${outer}" fill="${dark}" />`,
        `<rect x="${ox + frame}" y="${oy + frame}" width="${outer - frame * 2}" height="${outer - frame * 2}" fill="${light}" />`,
        `<rect x="${ox + coreOffset}" y="${oy + coreOffset}" width="${core}" height="${core}" fill="${dark}" />`,
    ].join('');
}

function isLogoZone(row: number, col: number, moduleCount: number, ratio: number): boolean {
    const zone = moduleCount * ratio;
    const start = (moduleCount - zone) / 2;
    const end = start + zone;
    const centerRow = row + 0.5;
    const centerCol = col + 0.5;

    return centerRow >= start && centerRow < end && centerCol >= start && centerCol < end;
}

function escapeXmlAttr(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function logoMarkup(
    pixelSize: number,
    ratio: number,
    shape: QrLogoShape,
    dataUrl: string,
    pad: boolean,
    padFill: string,
): string {
    const size = pixelSize * ratio;
    const x = (pixelSize - size) / 2;
    const y = (pixelSize - size) / 2;
    const padSize = pad ? size * 1.12 : size;
    const padX = (pixelSize - padSize) / 2;
    const padY = (pixelSize - padSize) / 2;
    const radius =
        shape === 'circle' ? padSize / 2 : shape === 'rounded' ? padSize * 0.22 : 0;
    const clipRadius = shape === 'circle' ? size / 2 : shape === 'rounded' ? size * 0.22 : 0;
    const href = escapeXmlAttr(dataUrl);
    const clipId = 'qr-logo-clip';

    const padShape =
        shape === 'circle'
            ? `<circle cx="${pixelSize / 2}" cy="${pixelSize / 2}" r="${padSize / 2}" fill="${padFill}" />`
            : `<rect x="${padX}" y="${padY}" width="${padSize}" height="${padSize}" rx="${radius}" ry="${radius}" fill="${padFill}" />`;

    const clipShape =
        shape === 'circle'
            ? `<circle cx="${pixelSize / 2}" cy="${pixelSize / 2}" r="${clipRadius}" />`
            : `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${clipRadius}" ry="${clipRadius}" />`;

    return [
        `<defs><clipPath id="${clipId}">${clipShape}</clipPath></defs>`,
        pad ? padShape : '',
        `<image href="${href}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})" />`,
    ].join('');
}

export function generateQrSvg(value: string, options: Partial<QrCodeOptions> = {}): string {
    const merged = { ...DEFAULT_QR_OPTIONS, ...options };
    const hasLogo = Boolean(merged.logoDataUrl) || Boolean(merged.punchLogoHole);
    const errorCorrectionLevel = hasLogo ? 'H' : merged.errorCorrectionLevel;
    const style = resolveStyle(merged);
    const qr = QRCode.create(value, { errorCorrectionLevel });
    const size = qr.modules.size;
    const margin = Math.max(0, merged.margin);
    const modulesAcross = size + margin * 2;
    const cell = merged.width / modulesAcross;
    const pixelSize = merged.width;
    const logoRatio = Math.min(0.32, Math.max(0.1, merged.logoRatio ?? 0.22));
    const holeRatio = (merged.logoPad ?? true) ? logoRatio * 1.18 : logoRatio;
    const punchHole = hasLogo;

    const parts: string[] = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${pixelSize} ${pixelSize}" shape-rendering="geometricPrecision">`,
        `<rect width="100%" height="100%" fill="${style.light}" />`,
        `<g fill="${style.dark}">`,
    ];

    for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
            if (!qr.modules.get(row, col) || isFinderCell(row, col, size)) {
                continue;
            }

            if (punchHole && isLogoZone(row, col, size, holeRatio)) {
                continue;
            }

            const x = (col + margin) * cell;
            const y = (row + margin) * cell;
            parts.push(modulePath(x, y, cell, style.moduleShape));
        }
    }

    parts.push('</g>');

    const eyes = [
        { row: 0, col: 0 },
        { row: 0, col: size - 7 },
        { row: size - 7, col: 0 },
    ];

    for (const eye of eyes) {
        const ox = (eye.col + margin) * cell;
        const oy = (eye.row + margin) * cell;
        parts.push(eyeMarkup(ox, oy, cell, style.eyeStyle, style.dark, style.light));
    }

    if (merged.logoDataUrl) {
        parts.push(
            logoMarkup(
                pixelSize,
                logoRatio,
                merged.logoShape ?? 'rounded',
                merged.logoDataUrl,
                merged.logoPad ?? true,
                style.light,
            ),
        );
    }

    parts.push('</svg>');

    return parts.join('');
}

export function qrSvgToDataUrl(svg: string): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
    if (typeof Image === 'undefined') {
        return Promise.resolve(null);
    }

    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });
}

export async function rasterizeSvgToPngDataUrl(
    svg: string,
    width: number,
    height = width,
): Promise<string | null> {
    if (typeof document === 'undefined') {
        return null;
    }

    const image = await loadImage(qrSvgToDataUrl(svg));

    if (!image) {
        return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
        return null;
    }

    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL('image/png');
}

async function compositeLogoOnPng(
    pngDataUrl: string,
    logoDataUrl: string,
    canvasWidth: number,
    canvasHeight: number,
    qr: { x: number; y: number; size: number },
    logoRatio: number,
    shape: QrLogoShape,
): Promise<string | null> {
    if (typeof document === 'undefined') {
        return null;
    }

    const qrImage = await loadImage(pngDataUrl);
    const logoImage = await loadImage(logoDataUrl);

    if (!qrImage || !logoImage) {
        return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext('2d');

    if (!context) {
        return null;
    }

    context.drawImage(qrImage, 0, 0, canvasWidth, canvasHeight);

    const logoSize = qr.size * logoRatio;
    const x = qr.x + (qr.size - logoSize) / 2;
    const y = qr.y + (qr.size - logoSize) / 2;

    context.save();
    context.beginPath();

    if (shape === 'circle') {
        context.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    } else if (shape === 'rounded') {
        const radius = logoSize * 0.22;
        context.roundRect(x, y, logoSize, logoSize, radius);
    } else {
        context.rect(x, y, logoSize, logoSize);
    }

    context.closePath();
    context.clip();
    context.drawImage(logoImage, x, y, logoSize, logoSize);
    context.restore();

    return canvas.toDataURL('image/png');
}

export async function generateQrCodeDataUrl(value: string, options: Partial<QrCodeOptions> = {}): Promise<string> {
    const merged = { ...DEFAULT_QR_OPTIONS, ...options };
    const logoDataUrl = merged.logoDataUrl;
    const svg = generateQrSvg(value, {
        ...merged,
        logoDataUrl: undefined,
        punchLogoHole: Boolean(logoDataUrl) || merged.punchLogoHole,
    });
    const png = await rasterizeSvgToPngDataUrl(svg, merged.width);

    if (png && logoDataUrl) {
        const composited = await compositeLogoOnPng(
            png,
            logoDataUrl,
            merged.width,
            merged.width,
            { x: 0, y: 0, size: merged.width },
            Math.min(0.32, Math.max(0.1, merged.logoRatio ?? 0.22)),
            merged.logoShape ?? 'rounded',
        );

        if (composited) {
            return composited;
        }
    }

    if (png) {
        return png;
    }

    return qrSvgToDataUrl(generateQrSvg(value, merged));
}

export { compositeLogoOnPng };
