export type QrFrameId = 'bare' | 'badge' | 'card' | 'banner' | 'sticker' | 'poster' | 'custom';

export type QrFramePreset = {
    id: QrFrameId;
    label: string;
};

export const QR_FRAME_PRESETS: QrFramePreset[] = [
    { id: 'bare', label: 'Bare' },
    { id: 'badge', label: 'Badge' },
    { id: 'card', label: 'Card' },
    { id: 'banner', label: 'Banner' },
    { id: 'sticker', label: 'Sticker' },
    { id: 'poster', label: 'Poster' },
    { id: 'custom', label: 'Custom HTML' },
];

export type QrFrameOptions = {
    frame: QrFrameId;
    name: string;
    caption: string;
    subtitle: string;
    url: string;
    dark: string;
    light: string;
};

export type QrFrameResult = {
    svg: string;
    width: number;
    height: number;
    qr: { x: number; y: number; size: number };
};

export const DEFAULT_QR_EMBED_HTML = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:440px;margin:0 auto;padding:28px;text-align:center;background:#0a0a0a;color:#ccff00;border:1px solid rgba(204,255,0,.25);border-radius:28px;">
  <p style="letter-spacing:.28em;font-size:11px;text-transform:uppercase;margin:0 0 12px;">{{name}}</p>
  <div style="display:inline-block;">{{qr}}</div>
  <p style="color:#a3a3a3;font-size:14px;margin:16px 0 8px;">{{caption}}</p>
  <p style="color:#737373;font-size:12px;word-break:break-all;margin:0;">{{url}}</p>
</div>`;

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeHtml(value: string): string {
    return escapeXml(value);
}

function truncate(value: string, max: number): string {
    const trimmed = value.trim();

    if (trimmed.length <= max) {
        return trimmed;
    }

    return `${trimmed.slice(0, max - 1)}…`;
}

function readQrSize(qrSvg: string): number {
    const widthMatch = qrSvg.match(/\bwidth="(\d+(?:\.\d+)?)"/);

    return widthMatch ? Number(widthMatch[1]) : 320;
}

function nestQrSvg(qrSvg: string, x: number, y: number, size: number): string {
    const inner = qrSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const viewBoxMatch = qrSvg.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch?.[1] ?? `0 0 ${size} ${size}`;

    return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}">${inner}</svg>`;
}

export function composeQrFrame(qrSvg: string, options: QrFrameOptions): QrFrameResult {
    const qrSize = readQrSize(qrSvg);
    const frame = options.frame === 'custom' ? 'bare' : options.frame;
    const name = truncate(options.name, 42);
    const caption = truncate(options.caption || name, 48);
    const subtitle = truncate(options.subtitle, 64);
    const dark = options.dark;
    const light = options.light;

    if (frame === 'bare') {
        return {
            svg: qrSvg,
            width: qrSize,
            height: qrSize,
            qr: { x: 0, y: 0, size: qrSize },
        };
    }

    if (frame === 'banner') {
        const pad = 20;
        const textWidth = 260;
        const width = qrSize + textWidth + pad * 3;
        const height = qrSize + pad * 2;
        const qrX = pad;
        const qrY = pad;
        const textX = qrSize + pad * 2;

        const svg = [
            `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
            `<rect width="100%" height="100%" rx="28" fill="${light}" />`,
            `<rect x="1.5" y="1.5" width="${width - 3}" height="${height - 3}" rx="26.5" fill="none" stroke="${dark}" stroke-width="2" />`,
            nestQrSvg(qrSvg, qrX, qrY, qrSize),
            `<text x="${textX}" y="${height / 2 - 18}" fill="${dark}" font-size="22" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700">${escapeXml(name || caption)}</text>`,
            `<text x="${textX}" y="${height / 2 + 10}" fill="${dark}" fill-opacity="0.72" font-size="14" font-family="ui-sans-serif, system-ui, sans-serif">${escapeXml(subtitle || caption)}</text>`,
            `<text x="${textX}" y="${height / 2 + 36}" fill="${dark}" fill-opacity="0.45" font-size="11" font-family="ui-monospace, monospace">${escapeXml(truncate(options.url, 42))}</text>`,
            '</svg>',
        ].join('');

        return { svg, width, height, qr: { x: qrX, y: qrY, size: qrSize } };
    }

    const pad = frame === 'sticker' ? 28 : 22;
    const header = frame === 'poster' ? 64 : frame === 'card' ? 52 : 0;
    const footer = frame === 'bare' ? 0 : frame === 'poster' ? 78 : 54;
    const width = qrSize + pad * 2;
    const height = qrSize + pad * 2 + header + footer;
    const qrX = pad;
    const qrY = pad + header;
    const radius = frame === 'sticker' ? Math.round(width / 2) : frame === 'badge' ? 32 : 24;
    const captionY = height - (frame === 'poster' ? 46 : 28);

    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
        `<rect width="100%" height="100%" rx="${radius}" fill="${light}" />`,
        `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="${Math.max(radius - 4, 0)}" fill="none" stroke="${dark}" stroke-width="2" />`,
        header > 0
            ? `<text x="${width / 2}" y="${frame === 'poster' ? 38 : 32}" text-anchor="middle" fill="${dark}" font-size="${frame === 'poster' ? 22 : 16}" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700">${escapeXml(name)}</text>`
            : '',
        nestQrSvg(qrSvg, qrX, qrY, qrSize),
        `<text x="${width / 2}" y="${captionY}" text-anchor="middle" fill="${dark}" font-size="14" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600">${escapeXml(caption)}</text>`,
        frame === 'poster' && subtitle
            ? `<text x="${width / 2}" y="${captionY + 22}" text-anchor="middle" fill="${dark}" fill-opacity="0.65" font-size="12" font-family="ui-sans-serif, system-ui, sans-serif">${escapeXml(subtitle)}</text>`
            : '',
        '</svg>',
    ].join('');

    return { svg, width, height, qr: { x: qrX, y: qrY, size: qrSize } };
}

export function buildQrEmbedHtml(options: {
    qrSvg: string;
    html: string;
    name: string;
    url: string;
    caption: string;
    subtitle: string;
}): string {
    const template = options.html.trim() === '' ? DEFAULT_QR_EMBED_HTML : options.html;
    const replaced = template
        .replaceAll('{{qr}}', options.qrSvg)
        .replaceAll('{{name}}', escapeHtml(options.name))
        .replaceAll('{{url}}', escapeHtml(options.url))
        .replaceAll('{{caption}}', escapeHtml(options.caption))
        .replaceAll('{{subtitle}}', escapeHtml(options.subtitle));

    const withQr = replaced.includes('<svg') ? replaced : `${replaced}\n<div>${options.qrSvg}</div>`;

    if (/<html[\s>]/i.test(withQr)) {
        return withQr;
    }

    return `<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(options.name || 'Foray QR')}</title>
  <style>body{margin:0;background:#050505;color:#e5e5e5;}</style>
</head>
<body>
${withQr}
</body>
</html>`;
}

export function isCustomQrFrame(frame: QrFrameId, embedHtml: string): boolean {
    return frame === 'custom' || embedHtml.trim() !== '';
}
