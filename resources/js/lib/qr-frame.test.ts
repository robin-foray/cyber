import { describe, expect, it } from 'vitest';
import { generateQrSvg } from './qr-code';
import { buildQrEmbedHtml, composeQrFrame, DEFAULT_QR_EMBED_HTML } from './qr-frame';
import { defaultQrLinkDesign, normalizeQrLinkDesign } from './qr-design';

describe('composeQrFrame', () => {
    const qrSvg = generateQrSvg('https://foray.hu/q/frame', { width: 160, styleId: 'print' });

    it('returns the bare qr unchanged', () => {
        const framed = composeQrFrame(qrSvg, {
            frame: 'bare',
            name: 'Póló',
            caption: '',
            subtitle: '',
            url: 'https://foray.hu/q/frame',
            dark: '#000000',
            light: '#ffffff',
        });

        expect(framed.svg).toBe(qrSvg);
        expect(framed.width).toBe(160);
        expect(framed.qr).toEqual({ x: 0, y: 0, size: 160 });
    });

    it('wraps badge and poster frames around the qr', () => {
        const badge = composeQrFrame(qrSvg, {
            frame: 'badge',
            name: 'Póló 2026',
            caption: 'Scan me',
            subtitle: '',
            url: 'https://foray.hu/q/frame',
            dark: '#ccff00',
            light: '#000000',
        });
        const poster = composeQrFrame(qrSvg, {
            frame: 'poster',
            name: 'Foray',
            caption: 'Nyári drop',
            subtitle: 'Limited',
            url: 'https://foray.hu/q/frame',
            dark: '#ccff00',
            light: '#111111',
        });

        expect(badge.svg).toContain('Scan me');
        expect(badge.height).toBeGreaterThan(badge.qr.size);
        expect(poster.svg).toContain('Foray');
        expect(poster.svg).toContain('Limited');
        expect(poster.width).toBeGreaterThan(qrSvg.length > 0 ? 160 : 0);
    });

    it('escapes caption text in svg', () => {
        const framed = composeQrFrame(qrSvg, {
            frame: 'card',
            name: 'A & B <script>',
            caption: 'A & B',
            subtitle: '',
            url: 'https://foray.hu/q/frame',
            dark: '#000',
            light: '#fff',
        });

        expect(framed.svg).toContain('A &amp; B');
        expect(framed.svg).not.toContain('<script>');
    });
});

describe('buildQrEmbedHtml', () => {
    it('injects placeholders into custom html', () => {
        const qrSvg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
        const html = buildQrEmbedHtml({
            qrSvg,
            html: '<section><h1>{{name}}</h1>{{qr}}<p>{{caption}}</p></section>',
            name: 'Booth QR',
            url: 'https://foray.hu/q/x',
            caption: 'Hello',
            subtitle: '',
        });

        expect(html).toContain('Booth QR');
        expect(html).toContain(qrSvg);
        expect(html).toContain('Hello');
        expect(html).toContain('<!doctype html>');
    });

    it('falls back to the default template', () => {
        const html = buildQrEmbedHtml({
            qrSvg: '<svg></svg>',
            html: '',
            name: 'Default',
            url: 'https://foray.hu/q/x',
            caption: '',
            subtitle: '',
        });

        expect(html).toContain('Default');
        expect(DEFAULT_QR_EMBED_HTML).toContain('{{qr}}');
    });
});

describe('normalizeQrLinkDesign', () => {
    it('fills defaults and keeps custom structure fields', () => {
        const design = normalizeQrLinkDesign({
            style_id: 'gold-classy',
            frame: 'poster',
            embed_html: '<div>{{qr}}</div>',
            logo_size: 80,
        });

        expect(design.style_id).toBe('gold-classy');
        expect(design.frame).toBe('poster');
        expect(design.embed_html).toBe('<div>{{qr}}</div>');
        expect(design.logo_size).toBe(32);
        expect(defaultQrLinkDesign().frame).toBe('bare');
    });
});
