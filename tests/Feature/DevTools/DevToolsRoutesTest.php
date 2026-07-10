<?php

namespace Tests\Feature\DevTools;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class DevToolsRoutesTest extends TestCase
{
    #[DataProvider('devToolRoutesProvider')]
    public function test_guests_can_visit_dev_tool_pages(string $routeName, string $component): void
    {
        $this->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component($component));
    }

    public static function devToolRoutesProvider(): array
    {
        return [
            'console' => ['dev-tools.console', 'dev-tools/console'],
            'runtime' => ['dev-tools.runtime', 'dev-tools/runtime'],
            'hash-generator' => ['dev-tools.hash-generator', 'dev-tools/hash-generator'],
            'cron-guru' => ['dev-tools.cron-guru', 'dev-tools/cron-guru'],
            'image-compressor' => ['dev-tools.image-compressor', 'dev-tools/image-compressor'],
            'deployments' => ['dev-tools.deployments', 'dev-tools/deployments'],
            'qr-generator' => ['dev-tools.qr-generator', 'dev-tools/qr-generator'],
            'php-syntax-checker' => ['dev-tools.php-syntax-checker', 'dev-tools/php-syntax-checker'],
            'html-syntax-checker' => ['dev-tools.html-syntax-checker', 'dev-tools/html-syntax-checker'],
        ];
    }
}

class HashGeneratorTest extends TestCase
{
    use RefreshDatabase;

    public function test_bcrypt_endpoint_generates_laravel_compatible_hash(): void
    {
        $response = $this->postJson(route('dev-tools.hash-generator.bcrypt'), [
            'value' => 'secret-password',
            'rounds' => 10,
        ]);

        $response->assertOk()->assertJsonStructure(['hash']);

        $hash = $response->json('hash');
        $this->assertTrue(
            str_starts_with($hash, '$2y$')
            || str_starts_with($hash, '$2a$')
            || str_starts_with($hash, '$2b$'),
        );
    }

    public function test_verify_endpoint_returns_match_for_correct_password(): void
    {
        $hash = Hash::make('secret-password', ['rounds' => 4]);

        $this->postJson(route('dev-tools.hash-generator.verify'), [
            'value' => 'secret-password',
            'hash' => $hash,
        ])
            ->assertOk()
            ->assertJson(['matches' => true]);
    }

    public function test_verify_endpoint_returns_no_match_for_wrong_password(): void
    {
        $hash = Hash::make('secret-password', ['rounds' => 4]);

        $this->postJson(route('dev-tools.hash-generator.verify'), [
            'value' => 'wrong-password',
            'hash' => $hash,
        ])
            ->assertOk()
            ->assertJson(['matches' => false]);
    }

    public function test_verify_endpoint_rejects_invalid_hash_format(): void
    {
        $this->postJson(route('dev-tools.hash-generator.verify'), [
            'value' => 'secret-password',
            'hash' => 'not-a-bcrypt-hash',
        ])->assertStatus(422);
    }

    public function test_bcrypt_endpoint_validates_rounds(): void
    {
        $this->postJson(route('dev-tools.hash-generator.bcrypt'), [
            'value' => 'secret-password',
            'rounds' => 99,
        ])->assertStatus(422);
    }
}
