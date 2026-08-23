<?php

namespace App\Services;

use App\Models\FreeApi;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class FreeApiProbeService
{
    private const int MAX_BODY_BYTES = 524_288;

    private const int TIMEOUT_SECONDS = 15;

    /**
     * @return array{
     *     ok: bool,
     *     status: int|null,
     *     duration_ms: int,
     *     content_type: string|null,
     *     body: string,
     *     parsed: mixed,
     *     truncated: bool,
     *     endpoint: string,
     *     error: string|null,
     * }
     */
    public function execute(FreeApi $api, ?string $endpoint = null): array
    {
        $target = trim($endpoint ?: (string) $api->sample_endpoint);

        if ($target === '') {
            throw ValidationException::withMessages([
                'endpoint' => 'This API has no sample endpoint to probe.',
            ]);
        }

        $this->assertAllowedEndpoint($api, $target);

        $started = hrtime(true);

        try {
            $response = Http::timeout(self::TIMEOUT_SECONDS)
                ->withHeaders([
                    'Accept' => 'application/json, text/plain, */*',
                    'User-Agent' => 'ForayFreeApiProbe/1.0',
                ])
                ->get($target);

            $durationMs = (int) round((hrtime(true) - $started) / 1_000_000);
            $body = $response->body();
            $truncated = strlen($body) > self::MAX_BODY_BYTES;

            if ($truncated) {
                $body = substr($body, 0, self::MAX_BODY_BYTES);
            }

            $contentType = $response->header('Content-Type');
            $parsed = $this->tryParseJson($body, $contentType);

            return [
                'ok' => $response->successful(),
                'status' => $response->status(),
                'duration_ms' => $durationMs,
                'content_type' => $contentType,
                'body' => $body,
                'parsed' => $parsed,
                'truncated' => $truncated,
                'endpoint' => $target,
                'error' => null,
            ];
        } catch (ConnectionException $exception) {
            $durationMs = (int) round((hrtime(true) - $started) / 1_000_000);

            return [
                'ok' => false,
                'status' => null,
                'duration_ms' => $durationMs,
                'content_type' => null,
                'body' => '',
                'parsed' => null,
                'truncated' => false,
                'endpoint' => $target,
                'error' => 'Connection failed: '.$exception->getMessage(),
            ];
        }
    }

    private function assertAllowedEndpoint(FreeApi $api, string $endpoint): void
    {
        $parts = parse_url($endpoint);

        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            throw ValidationException::withMessages([
                'endpoint' => 'The endpoint must be a valid absolute URL.',
            ]);
        }

        $scheme = strtolower($parts['scheme']);
        $host = strtolower($parts['host']);

        if (! in_array($scheme, ['http', 'https'], true)) {
            throw ValidationException::withMessages([
                'endpoint' => 'Only HTTP and HTTPS endpoints are allowed.',
            ]);
        }

        if ($api->https && $scheme !== 'https') {
            throw ValidationException::withMessages([
                'endpoint' => 'This API requires HTTPS.',
            ]);
        }

        if ($this->isBlockedHost($host)) {
            throw ValidationException::withMessages([
                'endpoint' => 'This host is not allowed for probing.',
            ]);
        }

        if (! in_array($host, $this->allowedHosts($api), true)) {
            throw ValidationException::withMessages([
                'endpoint' => 'The endpoint host does not match this catalog entry.',
            ]);
        }
    }

    /**
     * @return list<string>
     */
    private function allowedHosts(FreeApi $api): array
    {
        $hosts = [];

        foreach ([$api->url, $api->base_url, $api->sample_endpoint] as $candidate) {
            if (! is_string($candidate) || $candidate === '') {
                continue;
            }

            $host = parse_url($candidate, PHP_URL_HOST);

            if (is_string($host) && $host !== '') {
                $hosts[] = strtolower($host);
            }
        }

        return array_values(array_unique($hosts));
    }

    private function isBlockedHost(string $host): bool
    {
        if (in_array($host, ['localhost', '127.0.0.1', '0.0.0.0', '::1'], true)) {
            return true;
        }

        if (str_ends_with($host, '.local') || str_ends_with($host, '.internal')) {
            return true;
        }

        if (filter_var($host, FILTER_VALIDATE_IP) === false) {
            return false;
        }

        return filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }

    private function tryParseJson(string $body, ?string $contentType): mixed
    {
        if ($body === '') {
            return null;
        }

        $looksJson = str_contains(strtolower((string) $contentType), 'json')
            || str_starts_with(ltrim($body), '{')
            || str_starts_with(ltrim($body), '[');

        if (! $looksJson) {
            return null;
        }

        try {
            return json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }
    }
}
