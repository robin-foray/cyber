import { describe, expect, it } from 'vitest';
import { stackIconSrc } from './stack-icon';

describe('stack-icon', () => {
    it('resolves svg registry paths', () => {
        expect(stackIconSrc('stacks/laravel.svg')).toBe('/stacks/laravel.svg');
        expect(stackIconSrc('/stacks/react.svg')).toBe('/stacks/react.svg');
    });

    it('keeps absolute urls and rejects bare lucide keys', () => {
        expect(stackIconSrc('https://cdn.example/icon.svg')).toBe('https://cdn.example/icon.svg');
        expect(stackIconSrc('Server')).toBeNull();
    });
});
