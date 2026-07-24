export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export type RgbaColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type ColorConversion = {
    hex: string;
    rgb: string;
    rgba: string;
    hsl: string;
    hsla: string;
    rgbaValues: RgbaColor;
    error: string;
};

const hexPattern = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const rgbPattern = /^rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*,\s*([\d.]+%?))?\s*\)$/i;
const hslPattern = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*,\s*([\d.]+%?))?\s*\)$/i;

export function convertColor(input: string, format: ColorFormat): ColorConversion {
    const trimmed = input.trim();

    if (trimmed === '') {
        return emptyConversion('Color value is required.');
    }

    const rgba = parseColorInput(trimmed, format);

    if (!rgba) {
        return emptyConversion(`Invalid ${format.toUpperCase()} color value.`);
    }

    return buildConversion(rgba);
}

export function parseColorInput(input: string, format: ColorFormat): RgbaColor | null {
    switch (format) {
        case 'hex':
            return parseHex(input);
        case 'rgb':
        case 'rgba':
            return parseRgb(input, format === 'rgba');
        case 'hsl':
        case 'hsla':
            return parseHsl(input, format === 'hsla');
        default:
            return null;
    }
}

function parseHex(input: string): RgbaColor | null {
    const normalized = input.startsWith('#') ? input : `#${input}`;

    if (!hexPattern.test(normalized)) {
        return null;
    }

    const raw = normalized.slice(1);

    if (raw.length === 3 || raw.length === 4) {
        const channels = raw.split('').map((char) => char + char);
        const [r, g, b, a = 'ff'] = channels;

        return {
            r: parseInt(r, 16),
            g: parseInt(g, 16),
            b: parseInt(b, 16),
            a: roundAlpha(parseInt(a, 16) / 255),
        };
    }

    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    const a = raw.length === 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1;

    return { r, g, b, a: roundAlpha(a) };
}

function parseRgb(input: string, allowAlpha: boolean): RgbaColor | null {
    const match = input.match(rgbPattern);

    if (!match) {
        return null;
    }

    const [, red, green, blue, alpha] = match;
    const a = alpha === undefined ? 1 : parseAlpha(alpha);

    if (a === null || (!allowAlpha && alpha !== undefined)) {
        return null;
    }

    const r = parseChannel(red, 255);
    const g = parseChannel(green, 255);
    const b = parseChannel(blue, 255);

    if (r === null || g === null || b === null) {
        return null;
    }

    return { r, g, b, a: roundAlpha(a) };
}

function parseHsl(input: string, allowAlpha: boolean): RgbaColor | null {
    const match = input.match(hslPattern);

    if (!match) {
        return null;
    }

    const [, hue, saturation, lightness, alpha] = match;
    const a = alpha === undefined ? 1 : parseAlpha(alpha);

    if (a === null || (!allowAlpha && alpha !== undefined)) {
        return null;
    }

    const h = Number(hue);

    if (!Number.isFinite(h)) {
        return null;
    }

    const s = parsePercent(saturation);
    const l = parsePercent(lightness);

    if (s === null || l === null) {
        return null;
    }

    return { ...hslToRgb(h, s, l), a: roundAlpha(a) };
}

function parseChannel(value: string, max: number) {
    const trimmed = value.trim();

    if (trimmed.endsWith('%')) {
        const percent = Number(trimmed.slice(0, -1));

        if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
            return null;
        }

        return Math.round((percent / 100) * max);
    }

    const numeric = Number(trimmed);

    if (!Number.isFinite(numeric) || numeric < 0 || numeric > max) {
        return null;
    }

    return Math.round(numeric);
}

function parseAlpha(value: string) {
    const trimmed = value.trim();

    if (trimmed.endsWith('%')) {
        const percent = Number(trimmed.slice(0, -1));

        if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
            return null;
        }

        return roundAlpha(percent / 100);
    }

    const numeric = Number(trimmed);

    if (!Number.isFinite(numeric) || numeric < 0 || numeric > 1) {
        return null;
    }

    return roundAlpha(numeric);
}

function parsePercent(value: string) {
    const trimmed = value.trim();
    const numeric = trimmed.endsWith('%') ? Number(trimmed.slice(0, -1)) : Number(trimmed);

    if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) {
        return null;
    }

    return numeric;
}

function hslToRgb(h: number, s: number, l: number) {
    const hue = ((h % 360) + 360) % 360;
    const saturation = s / 100;
    const lightness = l / 100;
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const match = lightness - chroma / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (hue < 60) {
        r = chroma;
        g = x;
    } else if (hue < 120) {
        r = x;
        g = chroma;
    } else if (hue < 180) {
        g = chroma;
        b = x;
    } else if (hue < 240) {
        g = x;
        b = chroma;
    } else if (hue < 300) {
        r = x;
        b = chroma;
    } else {
        r = chroma;
        b = x;
    }

    return {
        r: Math.round((r + match) * 255),
        g: Math.round((g + match) * 255),
        b: Math.round((b + match) * 255),
    };
}

function rgbToHsl({ r, g, b }: Pick<RgbaColor, 'r' | 'g' | 'b'>) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    const lightness = (max + min) / 2;

    if (delta === 0) {
        return { h: 0, s: 0, l: roundPercent(lightness * 100) };
    }

    const saturation = delta / (1 - Math.abs(2 * lightness - 1));
    let hue = 0;

    switch (max) {
        case red:
            hue = ((green - blue) / delta) % 6;
            break;
        case green:
            hue = (blue - red) / delta + 2;
            break;
        default:
            hue = (red - green) / delta + 4;
            break;
    }

    hue *= 60;

    if (hue < 0) {
        hue += 360;
    }

    return {
        h: roundHue(hue),
        s: roundPercent(saturation * 100),
        l: roundPercent(lightness * 100),
    };
}

function buildConversion(rgba: RgbaColor): ColorConversion {
    const { h, s, l } = rgbToHsl(rgba);
    const hex = rgbaToHex(rgba);
    const rgb = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
    const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${trimAlpha(rgba.a)})`;
    const hsl = `hsl(${h}, ${s}%, ${l}%)`;
    const hsla = `hsla(${h}, ${s}%, ${l}%, ${trimAlpha(rgba.a)})`;

    return {
        hex,
        rgb,
        rgba: rgbaString,
        hsl,
        hsla,
        rgbaValues: rgba,
        error: '',
    };
}

function rgbaToHex({ r, g, b, a }: RgbaColor) {
    const channels = [r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('');

    if (a >= 1) {
        return `#${channels}`;
    }

    const alpha = Math.round(a * 255)
        .toString(16)
        .padStart(2, '0');

    return `#${channels}${alpha}`;
}

function emptyConversion(error: string): ColorConversion {
    return {
        hex: '',
        rgb: '',
        rgba: '',
        hsl: '',
        hsla: '',
        rgbaValues: { r: 0, g: 0, b: 0, a: 1 },
        error,
    };
}

function roundAlpha(value: number) {
    return Math.round(value * 1000) / 1000;
}

function roundPercent(value: number) {
    return Math.round(value * 10) / 10;
}

function roundHue(value: number) {
    return Math.round(value * 10) / 10;
}

function trimAlpha(value: number) {
    return Number(value.toFixed(3)).toString();
}

export const colorFormatOptions: Array<{ label: string; value: ColorFormat }> = [
    { label: 'HEX', value: 'hex' },
    { label: 'RGB', value: 'rgb' },
    { label: 'RGBA', value: 'rgba' },
    { label: 'HSL', value: 'hsl' },
    { label: 'HSLA', value: 'hsla' },
];

export const colorPresets = [
    { label: 'Neon Green', value: '#ccff00' },
    { label: 'Cyber Magenta', value: '#ff2bd6' },
    { label: 'Signal Cyan', value: '#7df9ff' },
    { label: 'Surface Low', value: '#0e0e0e' },
    { label: 'Surface', value: '#201f1f' },
    { label: 'Foreground', value: '#e5e2e1' },
];
