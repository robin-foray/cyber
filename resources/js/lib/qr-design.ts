import {
    DEFAULT_QR_STYLE_ID,
    compositeLogoOnPng,
    generateQrSvg,
    getQrStylePreset,
    qrSvgToDataUrl,
    rasterizeSvgToPngDataUrl,
    type QrCodeOptions,
    type QrEyeStyle,
    type QrLogoShape,
    type QrModuleShape,
    type QrStyleId,
} from './qr-code';
import { buildQrEmbedHtml, composeQrFrame, isCustomQrFrame, type QrFrameId } from './qr-frame';

export type QrLinkDesign = {
    style_id: QrStyleId;
    dark: string;
    light: string;
    module_shape: QrModuleShape | '';
    eye_style: QrEyeStyle | '';
    logo_size: number;
    logo_pad: boolean;
    logo_shape: QrLogoShape;
    frame: QrFrameId;
    caption: string;
    subtitle: string;
    embed_html: string;
};

export const QR_MODULE_SHAPE_OPTIONS: { id: QrModuleShape; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'soft', label: 'Soft' },
    { id: 'dots', label: 'Dots' },
    { id: 'diamond', label: 'Diamond' },
];

export const QR_EYE_STYLE_OPTIONS: { id: QrEyeStyle; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'circle', label: 'Circle' },
    { id: 'leaf', label: 'Leaf' },
];

export const QR_LOGO_SHAPE_OPTIONS: { id: QrLogoShape; label: string }[] = [
    { id: 'circle', label: 'Kör' },
    { id: 'rounded', label: 'Lekerekített' },
    { id: 'square', label: 'Négyzet' },
];

export function defaultQrLinkDesign(): QrLinkDesign {
    return {
        style_id: DEFAULT_QR_STYLE_ID,
        dark: '',
        light: '',
        module_shape: '',
        eye_style: '',
        logo_size: 22,
        logo_pad: true,
        logo_shape: 'rounded',
        frame: 'bare',
        caption: '',
        subtitle: '',
        embed_html: '',
    };
}

export function normalizeQrLinkDesign(raw: Partial<QrLinkDesign> | null | undefined): QrLinkDesign {
    const fallback = defaultQrLinkDesign();
    const incoming = raw ?? {};

    return {
        style_id: getQrStylePreset(incoming.style_id).id,
        dark: incoming.dark ?? '',
        light: incoming.light ?? '',
        module_shape: incoming.module_shape ?? '',
        eye_style: incoming.eye_style ?? '',
        logo_size: Math.min(32, Math.max(10, Number(incoming.logo_size) || fallback.logo_size)),
        logo_pad: incoming.logo_pad ?? true,
        logo_shape: incoming.logo_shape ?? 'rounded',
        frame: incoming.frame ?? 'bare',
        caption: incoming.caption ?? '',
        subtitle: incoming.subtitle ?? '',
        embed_html: incoming.embed_html ?? '',
    };
}

export function resolvedQrColors(design: QrLinkDesign): { dark: string; light: string } {
    const preset = getQrStylePreset(design.style_id);

    return {
        dark: design.dark.trim() || preset.dark,
        light: design.light.trim() || preset.light,
    };
}

export function designToQrCodeOptions(
    design: QrLinkDesign,
    width: number,
    logoDataUrl?: string | null,
): Partial<QrCodeOptions> {
    const colors = resolvedQrColors(design);

    return {
        width,
        margin: 2,
        styleId: design.style_id,
        darkColor: colors.dark,
        lightColor: colors.light,
        moduleShape: design.module_shape || undefined,
        eyeStyle: design.eye_style || undefined,
        logoDataUrl: logoDataUrl || undefined,
        logoRatio: design.logo_size / 100,
        logoPad: design.logo_pad,
        logoShape: design.logo_shape,
        punchLogoHole: Boolean(logoDataUrl),
        errorCorrectionLevel: logoDataUrl ? 'H' : 'M',
    };
}

export async function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error('Nem sikerült a fájlt beolvasni.'));
        reader.readAsDataURL(file);
    });
}

export async function fetchAsDataUrl(url: string): Promise<string> {
    const response = await fetch(url, { credentials: 'same-origin' });

    if (!response.ok) {
        throw new Error('A logó betöltése sikertelen.');
    }

    const blob = await response.blob();

    if (blob.type.includes('svg')) {
        const text = await blob.text();

        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error('A logó konvertálása sikertelen.'));
        reader.readAsDataURL(blob);
    });
}

export type DesignedQrRender = {
    previewUrl: string;
    svg: string;
    html: string;
    width: number;
    height: number;
    usesHtmlPreview: boolean;
};

export async function renderDesignedQr(options: {
    value: string;
    design: QrLinkDesign;
    name: string;
    logoDataUrl?: string | null;
    qrWidth?: number;
}): Promise<DesignedQrRender> {
    const qrWidth = options.qrWidth ?? 320;
    const logoDataUrl = options.logoDataUrl ?? null;
    const qrOptions = designToQrCodeOptions(options.design, qrWidth, logoDataUrl);
    const colors = resolvedQrColors(options.design);
    const qrSvgForRaster = generateQrSvg(options.value, {
        ...qrOptions,
        logoDataUrl: undefined,
        punchLogoHole: Boolean(logoDataUrl),
    });
    const qrSvgWithLogo = generateQrSvg(options.value, qrOptions);
    const framed = composeQrFrame(qrSvgForRaster, {
        frame: options.design.frame,
        name: options.name,
        caption: options.design.caption,
        subtitle: options.design.subtitle,
        url: options.value,
        dark: colors.dark,
        light: colors.light,
    });
    const framedWithLogo = composeQrFrame(qrSvgWithLogo, {
        frame: options.design.frame,
        name: options.name,
        caption: options.design.caption,
        subtitle: options.design.subtitle,
        url: options.value,
        dark: colors.dark,
        light: colors.light,
    });
    const html = buildQrEmbedHtml({
        qrSvg: qrSvgWithLogo,
        html: options.design.embed_html,
        name: options.name,
        url: options.value,
        caption: options.design.caption,
        subtitle: options.design.subtitle,
    });
    const usesHtmlPreview = isCustomQrFrame(options.design.frame, options.design.embed_html);

    const png = await rasterizeSvgToPngDataUrl(framed.svg, framed.width, framed.height);
    let previewUrl = png ?? qrSvgToDataUrl(framedWithLogo.svg);

    if (png && logoDataUrl) {
        const composited = await compositeLogoOnPng(
            png,
            logoDataUrl,
            framed.width,
            framed.height,
            framed.qr,
            options.design.logo_size / 100,
            options.design.logo_shape,
        );

        if (composited) {
            previewUrl = composited;
        }
    }

    return {
        previewUrl,
        svg: framedWithLogo.svg,
        html,
        width: framed.width,
        height: framed.height,
        usesHtmlPreview,
    };
}
