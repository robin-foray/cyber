<?php

namespace Tests\Feature\QrLinks;

use App\Models\QrLink;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QrLinkRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_q_route_redirects_to_current_destination(): void
    {
        config(['foray.qr.public_base_url' => 'https://foray.hu']);

        $link = QrLink::factory()->create([
            'slug' => 'polo',
            'destination_url' => 'https://example.com/day-one',
        ]);

        $this->get(route('qr.redirect', ['slug' => 'polo']))
            ->assertRedirect('https://example.com/day-one');

        $link->update(['destination_url' => 'https://example.com/day-two']);

        $this->get(route('qr.redirect', ['slug' => 'polo']))
            ->assertRedirect('https://example.com/day-two');
    }

    public function test_redirect_records_scan_analytics(): void
    {
        $link = QrLink::factory()->create(['slug' => 'stats']);

        $this->get(route('qr.redirect', ['slug' => 'stats']))->assertRedirect();

        $this->assertDatabaseHas('qr_link_scans', [
            'qr_link_id' => $link->id,
        ]);

        $link->refresh();
        $this->assertSame(1, $link->scan_count);
    }

    public function test_inactive_link_is_not_found(): void
    {
        QrLink::factory()->create([
            'slug' => 'off',
            'is_active' => false,
        ]);

        $this->get(route('qr.redirect', ['slug' => 'off']))->assertNotFound();
    }
}
