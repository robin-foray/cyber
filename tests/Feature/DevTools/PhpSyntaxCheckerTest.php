<?php

namespace Tests\Feature\DevTools;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhpSyntaxCheckerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_lint_endpoint(): void
    {
        $this->postJson(route('dev-tools.php-syntax-checker.lint'), [
            'code' => "<?php\n\nreturn ['status' => 'ok'];",
        ])->assertRedirect(route('home'));
    }

    public function test_lint_endpoint_accepts_valid_php(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('dev-tools.php-syntax-checker.lint'), [
                'code' => "<?php\n\nreturn ['status' => 'ok'];",
            ])
            ->assertOk()
            ->assertJson([
                'valid' => true,
            ]);
    }

    public function test_lint_endpoint_reports_syntax_errors(): void
    {
        $response = $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('dev-tools.php-syntax-checker.lint'), [
                'code' => "<?php\nfunction broken(",
            ]);

        $response->assertOk()->assertJson([
            'valid' => false,
        ]);

        $this->assertNotNull($response->json('line'));
    }

    public function test_lint_endpoint_maps_line_numbers_without_opening_tag(): void
    {
        $response = $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('dev-tools.php-syntax-checker.lint'), [
                'code' => "function broken(\n",
            ]);

        $response->assertOk()->assertJson([
            'valid' => false,
            'line' => 1,
        ]);
    }

    public function test_lint_endpoint_validates_payload(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->postJson(route('dev-tools.php-syntax-checker.lint'), [
                'code' => '',
            ])->assertStatus(422);
    }
}
