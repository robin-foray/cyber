<?php

namespace Tests\Feature\GuestPass;

use App\Filament\Resources\GuestPasses\GuestPassResource;
use App\Filament\Resources\GuestPasses\Pages\CreateGuestPass;
use App\Filament\Resources\GuestPasses\Pages\ListGuestPasses;
use App\Models\GuestPass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class GuestPassFilamentTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_guest_pass_admin_pages(): void
    {
        $pass = GuestPass::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->get(GuestPassResource::getUrl('index'))
            ->assertOk();

        $this->actingAs(User::factory()->admin()->create())
            ->get(GuestPassResource::getUrl('create'))
            ->assertOk();

        $this->actingAs(User::factory()->admin()->create())
            ->get(GuestPassResource::getUrl('view', ['record' => $pass]))
            ->assertOk();

        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/guest-pass-stats-page')
            ->assertOk();
    }

    public function test_guest_pass_list_exposes_create_action(): void
    {
        $this->actingAs(User::factory()->admin()->create());

        Livewire::test(ListGuestPasses::class)
            ->assertActionExists('create');
    }

    public function test_admin_can_create_guest_pass_from_filament(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin);

        $expiresAt = now()->addDays(3)->seconds(0);

        Livewire::test(CreateGuestPass::class)
            ->fillForm([
                'label' => 'Demo munkaltato',
                'display_name' => 'HR Partner',
                'title' => 'Guest Visitor',
                'bio' => 'Bemutato belepo',
                'avatar_seed' => 'hr-partner',
                'expires_at' => $expiresAt,
                'is_active' => true,
                'allowed_routes' => ['home', 'machines.index'],
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $pass = GuestPass::query()->where('label', 'Demo munkaltato')->first();

        $this->assertNotNull($pass);
        $this->assertSame('HR Partner', $pass->display_name);
        $this->assertSame($admin->id, $pass->created_by);
        $this->assertNotEmpty($pass->token);
        $this->assertTrue($pass->is_active);
        $this->assertSame(['home', 'machines.index'], $pass->allowed_routes);
        $this->assertSame(
            $expiresAt->format('Y-m-d H:i'),
            $pass->expires_at->format('Y-m-d H:i'),
        );
    }
}
