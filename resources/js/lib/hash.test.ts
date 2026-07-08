import { describe, expect, it } from 'vitest';
import { sha256 } from './hash';

describe('sha256', () => {
    it('generates a known digest for hello', async () => {
        const digest = await sha256('hello');

        expect(digest).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    it('generates stable output for the same input', async () => {
        const first = await sha256('foray-admin-node');
        const second = await sha256('foray-admin-node');

        expect(first).toBe(second);
        expect(first).toHaveLength(64);
    });

    it('generates different digests for different inputs', async () => {
        const first = await sha256('alpha');
        const second = await sha256('beta');

        expect(first).not.toBe(second);
    });
});
