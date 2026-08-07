<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ForayInstallCommand extends Command
{
    protected $signature = 'foray:install {--force : Force the operation to run in production}';

    protected $description = 'Run migrations and seed the default Foray CMS content';

    public function handle(): int
    {
        $this->components->info('Running database migrations...');

        $migrateCode = $this->call('migrate', [
            '--force' => $this->option('force') || $this->laravel->environment('production'),
        ]);

        if ($migrateCode !== self::SUCCESS) {
            return self::FAILURE;
        }

        $this->components->info('Seeding default CMS content and admin user...');

        $seedCode = $this->call('db:seed', [
            '--force' => $this->option('force') || $this->laravel->environment('production'),
        ]);

        if ($seedCode !== self::SUCCESS) {
            return self::FAILURE;
        }

        $this->components->info('Linking public storage...');
        $this->callSilently('storage:link');

        $this->components->info('Clearing application cache...');
        $this->callSilently('cache:clear');

        $this->newLine();
        $this->components->info('Foray install complete.');
        $this->line('Admin panel: /admin');
        $this->line('Admin email: '.config('foray.admin.email'));

        return self::SUCCESS;
    }
}
