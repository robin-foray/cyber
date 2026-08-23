export type FreeApiDemoPreview = {
    title: string | null;
    subtitle: string | null;
    body: string | null;
    imageUrl: string | null;
    facts: Array<{ label: string; value: string }>;
};

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i;

function asRecord(value: unknown): Record<string, unknown> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function stringifyValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '—';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    return JSON.stringify(value);
}

function firstString(...candidates: unknown[]): string | null {
    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim() !== '') {
            return candidate.trim();
        }
    }

    return null;
}

function looksLikeImageUrl(value: unknown): value is string {
    return typeof value === 'string' && /^https?:\/\//i.test(value) && (IMAGE_EXT.test(value) || /\/image\//i.test(value) || value.includes('images.dog.ceo') || value.includes('cdn'));
}

function findImageUrl(value: unknown, depth = 0): string | null {
    if (depth > 4) {
        return null;
    }

    if (looksLikeImageUrl(value)) {
        return value;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const found = findImageUrl(item, depth + 1);
            if (found) {
                return found;
            }
        }

        return null;
    }

    const record = asRecord(value);

    if (!record) {
        return null;
    }

    for (const key of ['url', 'hdurl', 'message', 'image', 'image_url', 'strMealThumb', 'strDrinkThumb', 'thumbnail', 'avatar', 'picture', 'link']) {
        if (looksLikeImageUrl(record[key])) {
            return record[key] as string;
        }
    }

    for (const nested of Object.values(record)) {
        const found = findImageUrl(nested, depth + 1);
        if (found) {
            return found;
        }
    }

    return null;
}

function pushFact(facts: FreeApiDemoPreview['facts'], label: string, value: unknown, max = 8) {
    if (facts.length >= max || value === null || value === undefined) {
        return;
    }

    if (typeof value === 'object') {
        return;
    }

    facts.push({ label, value: stringifyValue(value) });
}

/**
 * Build a human-friendly demo card from a live probe JSON payload.
 */
export function buildDemoPreview(parsed: unknown): FreeApiDemoPreview | null {
    if (parsed === null || parsed === undefined) {
        return null;
    }

    const facts: FreeApiDemoPreview['facts'] = [];
    let title: string | null = null;
    let subtitle: string | null = null;
    let body: string | null = null;
    let imageUrl = findImageUrl(parsed);

    if (Array.isArray(parsed)) {
        title = `${parsed.length} item${parsed.length === 1 ? '' : 's'}`;
        const first = parsed[0];
        const firstRecord = asRecord(first);

        if (firstRecord) {
            title = firstString(firstRecord.title, firstRecord.name, firstRecord.strMeal, firstRecord.strDrink, firstRecord.word, title);
            body = firstString(firstRecord.definition, firstRecord.explanation, firstRecord.fact, firstRecord.joke, firstRecord.value, firstRecord.activity);
            pushFact(facts, 'First key', Object.keys(firstRecord)[0] ?? null);
        }

        return { title, subtitle: 'Array response', body, imageUrl, facts };
    }

    const data = asRecord(parsed);

    if (!data) {
        return null;
    }

    // Dog CEO / simple message wrappers
    if (typeof data.message === 'string' && looksLikeImageUrl(data.message)) {
        title = 'Random image';
        imageUrl = data.message;
        pushFact(facts, 'status', data.status);
    }

    // Cat facts / advice / bored / chuck
    body = firstString(
        body,
        data.fact,
        data.advice,
        asRecord(data.slip)?.advice,
        data.activity,
        data.value,
        data.joke,
        data.setup && data.delivery ? `${data.setup}\n\n${data.delivery}` : null,
        data.explanation,
        data.content,
        data.summary,
    );

    title = firstString(
        title,
        data.title,
        data.name,
        data.strMeal,
        data.strDrink,
        asRecord(data.meals?.[0] as unknown)?.strMeal,
        asRecord(data.drinks?.[0] as unknown)?.strDrink,
        data.word,
        typeof data.age === 'number' ? `Age ≈ ${data.age}` : null,
        data.gender ? `Gender: ${data.gender}` : null,
    );

    subtitle = firstString(
        data.date,
        data.copyright,
        data.category,
        data.type,
        data.region,
        data.country,
        data.status,
    );

    // Meal / drink arrays
    const meal = asRecord(Array.isArray(data.meals) ? data.meals[0] : null);
    const drink = asRecord(Array.isArray(data.drinks) ? data.drinks[0] : null);
    const media = meal ?? drink;

    if (media) {
        title = firstString(media.strMeal, media.strDrink, title);
        subtitle = firstString(media.strCategory, media.strAlcoholic, subtitle);
        body = firstString(media.strInstructions, body);
        imageUrl = findImageUrl(media) ?? imageUrl;
    }

    // Random user
    const user = asRecord(Array.isArray(data.results) ? data.results[0] : null);

    if (user) {
        const name = asRecord(user.name);
        title = firstString(
            name ? [name.title, name.first, name.last].filter(Boolean).join(' ') : null,
            title,
        );
        const picture = asRecord(user.picture);
        imageUrl = firstString(picture?.large, picture?.medium, imageUrl);
        pushFact(facts, 'email', user.email);
        pushFact(facts, 'phone', user.phone);
    }

    // Weather / FX / Agify style metrics
    const current = asRecord(data.current_weather) ?? asRecord(data.current);
    if (current) {
        title = title ?? 'Current weather';
        pushFact(facts, 'temp', current.temperature ?? current.temp);
        pushFact(facts, 'wind', current.windspeed ?? current.wind_speed);
        pushFact(facts, 'code', current.weathercode ?? current.weather_code);
    }

    if (asRecord(data.rates)) {
        title = title ?? `FX ${String(data.base ?? '')}`.trim();
        const rates = asRecord(data.rates)!;
        for (const [code, rate] of Object.entries(rates).slice(0, 4)) {
            pushFact(facts, code, rate);
        }
    }

    pushFact(facts, 'name', data.name);
    pushFact(facts, 'age', data.age);
    pushFact(facts, 'count', data.count);
    pushFact(facts, 'ip', data.ip);
    pushFact(facts, 'id', data.id);

    // Dictionary
    if (Array.isArray(parsed) === false && Array.isArray((data as { meanings?: unknown }).meanings) === false) {
        // handled below via array path for dictionary which returns array at root
    }

    if (!title && !body && !imageUrl && facts.length === 0) {
        const keys = Object.keys(data).slice(0, 6);

        if (keys.length === 0) {
            return null;
        }

        title = 'JSON response';
        subtitle = keys.join(' · ');
    }

    return { title, subtitle, body, imageUrl, facts };
}

/**
 * Root-level dictionary API arrays: [{ word, meanings: [...] }]
 */
export function buildDemoPreviewFromProbe(parsed: unknown): FreeApiDemoPreview | null {
    if (Array.isArray(parsed) && parsed.length > 0) {
        const first = asRecord(parsed[0]);

        if (first?.word && Array.isArray(first.meanings)) {
            const meaning = asRecord(first.meanings[0]);
            const definition = asRecord(Array.isArray(meaning?.definitions) ? meaning?.definitions[0] : null);

            return {
                title: String(first.word),
                subtitle: firstString(meaning?.partOfSpeech, `${parsed.length} entries`),
                body: firstString(definition?.definition, definition?.example),
                imageUrl: null,
                facts: [],
            };
        }
    }

    return buildDemoPreview(parsed);
}
