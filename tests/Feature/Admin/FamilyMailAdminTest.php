<?php

namespace Tests\Feature\Admin;

use App\Filament\Pages\MailServer;
use App\Filament\Resources\FamilyMailboxResource;
use App\Models\FamilyMailbox;
use App\Models\MailServerSetting;
use App\Models\User;
use Database\Seeders\FamilyMailSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class FamilyMailAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_mail_server_page(): void
    {
        $this->get(MailServer::getUrl())
            ->assertRedirect('/admin/login');
    }

    public function test_non_admin_cannot_access_mail_server_page(): void
    {
        $user = User::factory()->create(['role' => 'member']);

        $this->actingAs($user)
            ->get(MailServer::getUrl())
            ->assertForbidden();
    }

    public function test_admin_can_open_mail_server_page(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(MailServer::getUrl())
            ->assertOk();
    }

    public function test_admin_can_save_mail_server_settings(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin);

        Livewire::test(MailServer::class)
            ->fillForm([
                'domain' => 'foray.hu',
                'display_name' => 'Foray Family Mail',
                'imap_host' => 'mail.foray.hu',
                'imap_port' => 993,
                'smtp_host' => 'mail.foray.hu',
                'smtp_port' => 465,
                'webmail_url' => 'https://webmail.foray.hu',
                'admin_notes' => 'Teszt jegyzet',
                'is_enabled' => true,
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $settings = MailServerSetting::current();

        $this->assertSame('foray.hu', $settings->domain);
        $this->assertSame('mail.foray.hu', $settings->imap_host);
        $this->assertSame('Teszt jegyzet', $settings->admin_notes);
        $this->assertTrue($settings->is_enabled);
    }

    public function test_admin_can_list_and_create_family_mailboxes(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(FamilyMailboxResource::getUrl('index'))
            ->assertOk();

        Livewire::test(FamilyMailboxResource\Pages\CreateFamilyMailbox::class)
            ->fillForm([
                'local_part' => 'anna',
                'domain' => 'foray.hu',
                'display_name' => 'Anna Foray',
                'owner_name' => 'Anna',
                'type' => FamilyMailbox::TYPE_MAILBOX,
                'quota_mb' => 1024,
                'sort_order' => 10,
                'is_active' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $mailbox = FamilyMailbox::query()->where('local_part', 'anna')->first();

        $this->assertNotNull($mailbox);
        $this->assertSame('anna@foray.hu', $mailbox->email);
        $this->assertSame('Anna Foray', $mailbox->display_name);
    }

    public function test_family_mail_seeder_is_idempotent(): void
    {
        $this->seed(FamilyMailSeeder::class);
        $this->seed(FamilyMailSeeder::class);

        $this->assertSame(1, MailServerSetting::query()->count());
        $this->assertSame(3, FamilyMailbox::query()->count());
        $this->assertSame('foray.hu', MailServerSetting::current()->domain);
        $this->assertTrue(FamilyMailbox::query()->where('local_part', 'info')->exists());
    }

    public function test_family_mailbox_email_accessor_lowercases_local_part(): void
    {
        $mailbox = FamilyMailbox::query()->create([
            'local_part' => 'Robin',
            'domain' => 'foray.hu',
            'display_name' => 'Robin',
            'type' => FamilyMailbox::TYPE_MAILBOX,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $this->assertSame('robin@foray.hu', $mailbox->email);
    }
}
