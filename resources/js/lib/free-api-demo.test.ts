import { describe, expect, it } from 'vitest';
import { buildDemoPreviewFromProbe } from './free-api-demo';

describe('buildDemoPreviewFromProbe', () => {
    it('extracts dog image URLs', () => {
        const preview = buildDemoPreviewFromProbe({
            message: 'https://images.dog.ceo/breeds/hound/n02088094.jpg',
            status: 'success',
        });

        expect(preview?.imageUrl).toContain('images.dog.ceo');
        expect(preview?.title).toBe('Random image');
    });

    it('extracts cat facts text', () => {
        const preview = buildDemoPreviewFromProbe({ fact: 'Cats sleep a lot.' });

        expect(preview?.body).toBe('Cats sleep a lot.');
    });

    it('formats dictionary entries', () => {
        const preview = buildDemoPreviewFromProbe([
            {
                word: 'hello',
                meanings: [
                    {
                        partOfSpeech: 'noun',
                        definitions: [{ definition: 'A greeting.' }],
                    },
                ],
            },
        ]);

        expect(preview?.title).toBe('hello');
        expect(preview?.subtitle).toBe('noun');
        expect(preview?.body).toBe('A greeting.');
    });

    it('surfaces weather metrics', () => {
        const preview = buildDemoPreviewFromProbe({
            current_weather: { temperature: 21.5, windspeed: 3.2, weathercode: 1 },
        });

        expect(preview?.facts).toEqual(
            expect.arrayContaining([
                { label: 'temp', value: '21.5' },
                { label: 'wind', value: '3.2' },
            ]),
        );
    });

    it('returns null for empty objects', () => {
        expect(buildDemoPreviewFromProbe({})).toBeNull();
    });
});
