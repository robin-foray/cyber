<?php

namespace Tests\Feature\QrLinks;

use App\Models\QrLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QrLinkPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_open_qr_links_page(): void
    {
        $this->get(route('qr-links.index'))
            ->assertRedirect(route('home'));
    }

    public function test_admin_can_create_and_update_dynamic_qr_links(): void
    {
        config(['foray.qr.public_base_url' => 'https://foray.hu']);

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('qr-links.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('qr-links/index'));

        $this->actingAs($admin)
            ->post(route('qr-links.store'), [
                'name' => 'Póló QR',
                'slug' => 'polo-2026',
                'destination_url' => 'https://example.com/today',
            ])
            ->assertRedirect(route('qr-links.index'));

        $link = QrLink::query()->where('slug', 'polo-2026')->first();
        $this->assertNotNull($link);
        $this->assertSame('https://foray.hu/q/polo-2026', $link->public_url);

        $this->actingAs($admin)
            ->patch(route('qr-links.update', $link), [
                'destination_url' => 'https://example.com/tomorrow',
            ])
            ->assertRedirect(route('qr-links.index'));

        $this->assertSame('https://example.com/tomorrow', $link->fresh()->destination_url);
    }

    public function test_admin_can_open_mobile_qr_links_page(): void
    {
        $admin = User::factory()->admin()->create();
        QrLink::factory()->create(['created_by' => $admin->id, 'name' => 'Póló']);

        $this->actingAs($admin)
            ->get(route('qr-links.mobile'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('qr-links/mobile')
                ->has('links', 1)
                ->where('links.0.name', 'Póló'));
    }

    public function test_guests_cannot_open_mobile_qr_links_page(): void
    {
        $this->get(route('qr-links.mobile'))
            ->assertRedirect(route('home'));
    }

    public function test_admin_can_open_filament_qr_link_resource(): void
    {
        QrLink::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->get('/admin/qr-links')
            ->assertOk();
    }
}
