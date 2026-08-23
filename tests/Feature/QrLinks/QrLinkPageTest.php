<?php

namespace Tests\Feature\QrLinks;

use App\Filament\Resources\QrLinks\QrLinkResource;
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

    public function test_admin_can_create_update_and_delete_dynamic_qr_links(): void
    {
        config(['foray.qr.public_base_url' => 'https://foray.hu']);

        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('qr-links.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('qr-links/index'));

        $this->actingAs($admin)
            ->from(route('qr-links.index'))
            ->post(route('qr-links.store'), [
                'name' => 'Póló QR',
                'slug' => 'should-be-ignored',
                'destination_url' => 'https://example.com/today',
                'notes' => 'booth A',
            ])
            ->assertRedirect(route('qr-links.index'));

        $link = QrLink::query()->where('name', 'Póló QR')->first();
        $this->assertNotNull($link);
        $this->assertNotSame('should-be-ignored', $link->slug);
        $this->assertMatchesRegularExpression('/^[a-f0-9]{16}$/', $link->slug);
        $this->assertSame('https://foray.hu/q/'.$link->slug, $link->public_url);
        $this->assertSame('booth A', $link->notes);
        $this->assertSame($admin->id, $link->created_by);

        $this->actingAs($admin)
            ->from(route('qr-links.index'))
            ->patch(route('qr-links.update', $link), [
                'name' => 'Póló QR v2',
                'destination_url' => 'https://example.com/tomorrow',
                'notes' => 'updated',
                'is_active' => false,
            ])
            ->assertRedirect(route('qr-links.index'));

        $link->refresh();
        $this->assertSame('Póló QR v2', $link->name);
        $this->assertSame('https://example.com/tomorrow', $link->destination_url);
        $this->assertSame('updated', $link->notes);
        $this->assertFalse($link->is_active);
        $this->assertMatchesRegularExpression('/^[a-f0-9]{16}$/', $link->slug);

        $this->actingAs($admin)
            ->from(route('qr-links.index'))
            ->delete(route('qr-links.destroy', $link))
            ->assertRedirect(route('qr-links.index'));

        $this->assertDatabaseMissing('qr_links', ['id' => $link->id]);
    }

    public function test_user_only_sees_their_own_qr_links(): void
    {
        $alice = User::factory()->admin()->create();
        $bob = User::factory()->admin()->create();

        QrLink::factory()->create(['created_by' => $alice->id, 'name' => 'Alice QR']);
        QrLink::factory()->create(['created_by' => $bob->id, 'name' => 'Bob QR']);

        $this->actingAs($alice)
            ->get(route('qr-links.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('links', 1)
                ->where('links.0.name', 'Alice QR'));

        $this->actingAs($bob)
            ->get(route('qr-links.mobile'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('links', 1)
                ->where('links.0.name', 'Bob QR'));
    }

    public function test_user_cannot_update_another_users_qr_link(): void
    {
        $owner = User::factory()->admin()->create();
        $other = User::factory()->admin()->create();
        $link = QrLink::factory()->create(['created_by' => $owner->id]);

        $this->actingAs($other)
            ->patch(route('qr-links.update', $link), [
                'destination_url' => 'https://example.com/hijack',
            ])
            ->assertNotFound();
    }

    public function test_user_cannot_delete_another_users_qr_link(): void
    {
        $owner = User::factory()->admin()->create();
        $other = User::factory()->admin()->create();
        $link = QrLink::factory()->create(['created_by' => $owner->id]);

        $this->actingAs($other)
            ->delete(route('qr-links.destroy', $link))
            ->assertNotFound();

        $this->assertDatabaseHas('qr_links', ['id' => $link->id]);
    }

    public function test_filament_lists_only_current_users_qr_links(): void
    {
        $owner = User::factory()->admin()->create();
        $other = User::factory()->admin()->create();

        $mine = QrLink::factory()->create(['created_by' => $owner->id, 'name' => 'Mine']);
        QrLink::factory()->create(['created_by' => $other->id, 'name' => 'Theirs']);

        $this->actingAs($owner);

        $visible = QrLinkResource::getEloquentQuery()->pluck('id');

        $this->assertTrue($visible->contains($mine->id));
        $this->assertCount(1, $visible);
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
        $admin = User::factory()->admin()->create();
        QrLink::factory()->create(['created_by' => $admin->id]);

        $this->actingAs($admin)
            ->get('/admin/qr-links')
            ->assertOk();
    }
}
