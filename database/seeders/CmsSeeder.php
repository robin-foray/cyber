<?php

namespace Database\Seeders;

use App\Models\DeploymentStep;
use App\Models\DevToolPage;
use App\Models\HeroContent;
use App\Models\HomeConsoleContent;
use App\Models\NavigationItem;
use App\Models\PageSection;
use App\Models\SiteSetting;
use App\Models\SkillMetric;
use App\Models\SocialLink;
use App\Models\StackTechnology;
use App\Models\TickerMessage;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedHero();
        $this->seedHomeConsole();
        $this->seedSkillMetrics();
        $this->seedStackTechnologies();
        $this->seedTickerMessages();
        $this->seedSocialLinks();
        $this->seedDeploymentSteps();
        $this->seedSiteSettings();
        $this->seedDevToolPages();
        $this->seedPageSections();
        $this->seedNavigation();
    }

    private function seedHero(): void
    {
        $this->upsertSingleton(HeroContent::class, [
            'badge' => 'Deployment Protocol // Archive_01',
            'title_line' => 'Architecting the',
            'title_accent' => 'Digital Future',
            'cta_label' => 'LAUNCH_CORE',
            'background_image' => '/assets/hero-cyber-archer.png',
        ]);
    }

    private function seedHomeConsole(): void
    {
        $this->upsertSingleton(HomeConsoleContent::class, [
            'section_label' => 'DEV_TOOLS_CONSOLE',
            'input_sample' => '{ "node": "0x4a2b", "status": "sync" }',
            'output_sample' => '{ "verified": true, "latency": "0.4ms" }',
        ]);
    }

    private function seedSkillMetrics(): void
    {
        foreach ([
            ['label' => 'REACT_ECOSYSTEM', 'progress' => 92, 'sort_order' => 1],
            ['label' => 'LARAVEL_RUNTIME', 'progress' => 88, 'sort_order' => 2],
            ['label' => 'NODE_PIPELINE', 'progress' => 75, 'sort_order' => 3],
        ] as $skill) {
            SkillMetric::query()->updateOrCreate(
                ['label' => $skill['label']],
                $skill + ['is_active' => true],
            );
        }
    }

    private function seedStackTechnologies(): void
    {
        $stacks = [
            ['name' => 'Laravel', 'signal' => 'runtime_core', 'summary' => 'Backend orchestration, routing, auth and API layer for the neural dashboard shell.', 'bullets' => ['Inertia gateway', 'secure routing', 'server-rendered payloads'], 'docs_url' => 'https://laravel.com/docs', 'icon' => 'Server', 'sort_order' => 1],
            ['name' => 'React', 'signal' => 'interface_layer', 'summary' => 'Interactive UI surface with stateful panels, responsive sidebar logic and smooth component updates.', 'bullets' => ['component grid', 'stateful details', 'client-side interactions'], 'docs_url' => 'https://react.dev', 'icon' => 'Code2', 'sort_order' => 2],
            ['name' => 'Inertia', 'signal' => 'bridge_online', 'summary' => 'The transport bridge between Laravel responses and the React cockpit experience.', 'bullets' => ['single-page flow', 'shared props', 'route continuity'], 'docs_url' => 'https://inertiajs.com', 'icon' => 'Share2', 'sort_order' => 3],
            ['name' => 'Tailwind', 'signal' => 'visual_protocol', 'summary' => 'Design token system for the cyber neon layout, spacing, panels and responsive composition.', 'bullets' => ['utility styling', 'theme tokens', 'adaptive layout'], 'docs_url' => 'https://tailwindcss.com/docs', 'icon' => 'Layers', 'sort_order' => 4],
            ['name' => 'Vite', 'signal' => 'build_engine', 'summary' => 'Fast asset compilation pipeline powering local iteration and production builds.', 'bullets' => ['hot reload', 'asset manifest', 'optimized chunks'], 'docs_url' => 'https://vite.dev/guide/', 'icon' => 'Zap', 'sort_order' => 5],
            ['name' => 'TypeScript', 'signal' => 'typed_mesh', 'summary' => 'Type contracts for safer props, dashboard state and reusable visual modules.', 'bullets' => ['typed props', 'safer refactors', 'editor intelligence'], 'docs_url' => 'https://www.typescriptlang.org/docs/', 'icon' => 'Braces', 'sort_order' => 6],
            ['name' => 'SQLite', 'signal' => 'data_cell', 'summary' => 'Local database layer suited for fast prototyping and contained development workflows.', 'bullets' => ['portable data', 'quick migrations', 'zero service setup'], 'docs_url' => 'https://www.sqlite.org/docs.html', 'icon' => 'Database', 'sort_order' => 7],
            ['name' => 'Node', 'signal' => 'package_bus', 'summary' => 'JavaScript toolchain runtime behind package scripts, frontend transforms and dev automation.', 'bullets' => ['package scripts', 'Vite runtime', 'dependency graph'], 'docs_url' => 'https://nodejs.org/docs/latest/api/', 'icon' => 'Package', 'sort_order' => 8],
            ['name' => 'Auth', 'signal' => 'access_gate', 'summary' => 'Starter-kit authentication flow connected to the dashboard entry and protected routes.', 'bullets' => ['login bridge', 'session guard', 'dashboard link'], 'docs_url' => 'https://laravel.com/docs/authentication', 'icon' => 'ShieldCheck', 'sort_order' => 9],
            ['name' => 'Pipeline', 'signal' => 'system_clock', 'summary' => 'Build, preview and deployment readiness represented as a live engineering stack map.', 'bullets' => ['build stable', 'latency trace', 'deploy queue clear'], 'docs_url' => 'https://vite.dev/guide/build', 'icon' => 'Cpu', 'sort_order' => 10],
        ];

        foreach ($stacks as $stack) {
            StackTechnology::query()->updateOrCreate(
                ['name' => $stack['name']],
                $stack + ['is_active' => true],
            );
        }
    }

    private function seedTickerMessages(): void
    {
        foreach ([
            ['location' => 'topbar', 'text' => '// build: stable', 'is_highlighted' => false, 'sort_order' => 1],
            ['location' => 'topbar', 'text' => 'npm_run_dev --watch', 'is_highlighted' => true, 'sort_order' => 2],
            ['location' => 'topbar', 'text' => 'inertia.react.pipeline_online', 'is_highlighted' => false, 'sort_order' => 3],
            ['location' => 'topbar', 'text' => 'latency: 0.4ms', 'is_highlighted' => true, 'sort_order' => 4],
            ['location' => 'topbar', 'text' => 'deploy_queue: clear', 'is_highlighted' => false, 'sort_order' => 5],
            ['location' => 'footer', 'text' => 'node_identity synced', 'is_highlighted' => false, 'sort_order' => 1],
            ['location' => 'footer', 'text' => 'profile_channel online', 'is_highlighted' => true, 'sort_order' => 2],
            ['location' => 'footer', 'text' => 'admin_gate armed', 'is_highlighted' => false, 'sort_order' => 3],
            ['location' => 'footer', 'text' => 'register_core ready', 'is_highlighted' => true, 'sort_order' => 4],
        ] as $ticker) {
            TickerMessage::query()->updateOrCreate(
                ['location' => $ticker['location'], 'sort_order' => $ticker['sort_order']],
                $ticker + ['is_active' => true],
            );
        }
    }

    private function seedSocialLinks(): void
    {
        foreach ([
            ['platform' => 'Github', 'url' => null, 'sort_order' => 1],
            ['platform' => 'Twitter', 'url' => null, 'sort_order' => 2],
            ['platform' => 'Instagram', 'url' => null, 'sort_order' => 3],
            ['platform' => 'Facebook', 'url' => null, 'sort_order' => 4],
        ] as $social) {
            SocialLink::query()->updateOrCreate(
                ['platform' => $social['platform']],
                $social + ['is_active' => true],
            );
        }
    }

    private function seedDeploymentSteps(): void
    {
        foreach ([
            'archive_01 prepared',
            'manifest synced',
            'assets compiled',
            'queue clear',
        ] as $index => $label) {
            DeploymentStep::query()->updateOrCreate(
                ['label' => $label],
                ['sort_order' => $index + 1, 'is_active' => true],
            );
        }
    }

    private function seedSiteSettings(): void
    {
        $settings = [
            'footer_copyright' => '(c)2026 DEV_HUB_CORE.',
            'welcome_page_title' => 'Neural Dev Dashboard',
            'integrity_section_title' => 'Integrity_Check',
            'stacks_section_title' => 'STACKS_PROTOCOL',
            'stacks_heading_prefix' => 'Tech',
            'stacks_heading_accent' => 'Stack',
            'stacks_panel_hint' => 'live module registry // click a cell to open stack telemetry',
            'topbar_terminal' => 'TERMINAL',
            'topbar_dev_tools' => 'DEV_TOOLS',
            'topbar_access_gate' => 'ACCESS_GATE',
            'topbar_node_registration' => 'NODE_REGISTRATION',
            'topbar_profile' => 'PROFILE',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }
    }

    private function seedDevToolPages(): void
    {
        $pages = [
            ['slug' => 'console', 'header_label' => 'DEV_TOOL_01 // JSON_FORMATTER', 'page_title' => 'JSON Formatter', 'heading_prefix' => 'JSON', 'heading_accent' => 'Formatter', 'sample_input' => '{"node":"foray-core","status":"sync","tools":["json_formatter","runtime_probe"],"payload":{"latency":0.4,"verified":true}}', 'icon' => 'FileJson2', 'sort_order' => 1],
            ['slug' => 'runtime', 'header_label' => 'DEV_TOOL_02 // PAYLOAD_CODEC', 'page_title' => 'Runtime Codec', 'heading_prefix' => 'Runtime', 'heading_accent' => 'Codec', 'sample_input' => 'eyJub2RlIjoiZm9yYXktcnVudGltZSIsInN0YXR1cyI6Im9ubGluZSJ9', 'icon' => 'Binary', 'sort_order' => 2],
            ['slug' => 'hash-generator', 'header_label' => 'DEV_TOOL_03 // HASH_GENERATOR', 'page_title' => 'Hash Generator', 'heading_prefix' => 'Hash', 'heading_accent' => 'Generator', 'sample_input' => 'foray-admin-node', 'icon' => 'Fingerprint', 'sort_order' => 3],
            ['slug' => 'qr-generator', 'header_label' => 'DEV_TOOL_04 // QR_GENERATOR', 'page_title' => 'QR Generator', 'heading_prefix' => 'QR', 'heading_accent' => 'Generator', 'sample_input' => 'https://foray.local/dev-tools', 'icon' => 'QrCode', 'sort_order' => 4],
            ['slug' => 'cron-guru', 'header_label' => 'DEV_TOOL_05 // CRON_GURU', 'page_title' => 'Cron Guru', 'heading_prefix' => 'Cron', 'heading_accent' => 'Guru', 'sample_input' => '*/15 9-17 * * 1-5', 'icon' => 'CalendarClock', 'sort_order' => 5],
            ['slug' => 'image-compressor', 'header_label' => 'DEV_TOOL_06 // IMAGE_COMPRESSOR', 'page_title' => 'Image Compressor', 'heading_prefix' => 'Image', 'heading_accent' => 'Compressor', 'sample_input' => null, 'icon' => 'ImageDown', 'sort_order' => 6],
            ['slug' => 'deployments', 'header_label' => 'DEPLOYMENT_PROTOCOL', 'page_title' => 'Deployments', 'heading_prefix' => null, 'heading_accent' => null, 'sample_input' => null, 'icon' => 'Rocket', 'sort_order' => 7],
            ['slug' => 'php-syntax-checker', 'header_label' => 'DEV_TOOL_08 // PHP_SYNTAX', 'page_title' => 'PHP Syntax Checker', 'heading_prefix' => 'PHP', 'heading_accent' => 'Syntax', 'sample_input' => "<?php\n\ndeclare(strict_types=1);\n\nfunction greet(string \$name): string\n{\n    return \"Hello, {\$name}\";\n}", 'icon' => 'Braces', 'sort_order' => 8],
            ['slug' => 'html-syntax-checker', 'header_label' => 'DEV_TOOL_09 // HTML_SYNTAX', 'page_title' => 'HTML Syntax Checker', 'heading_prefix' => 'HTML', 'heading_accent' => 'Syntax', 'sample_input' => null, 'icon' => 'Code2', 'sort_order' => 9],
            ['slug' => 'color-converter', 'header_label' => 'DEV_TOOL_10 // COLOR_CONVERTER', 'page_title' => 'Color Converter', 'heading_prefix' => 'Color', 'heading_accent' => 'Converter', 'sample_input' => '#ccff00', 'icon' => 'Palette', 'sort_order' => 10],
            ['slug' => 'regex-lab', 'header_label' => 'DEV_TOOL_11 // REGEX_LAB', 'page_title' => 'Regex Lab', 'heading_prefix' => 'Regex', 'heading_accent' => 'Lab', 'sample_input' => null, 'icon' => 'Regex', 'sort_order' => 11],
            ['slug' => 'sql-builder', 'header_label' => 'DEV_TOOL_12 // SQL_BUILDER', 'page_title' => 'SQL Builder', 'heading_prefix' => 'SQL', 'heading_accent' => 'Builder', 'sample_input' => 'id, name, email', 'icon' => 'Table2', 'sort_order' => 12],
        ];

        foreach ($pages as $page) {
            DevToolPage::query()->updateOrCreate(
                ['slug' => $page['slug']],
                $page + ['is_active' => true],
            );
        }
    }

    private function seedPageSections(): void
    {
        foreach ([
            [
                'slug' => 'projects',
                'section_label' => 'PROJECTS_PROTOCOL',
                'title' => 'Active',
                'title_accent' => 'Deployments',
                'body' => 'Pipeline snapshots and release nodes will surface here as the project archive grows.',
                'sort_order' => 1,
            ],
            [
                'slug' => 'logs',
                'section_label' => 'SYSTEM_LOGS',
                'title' => 'Neural',
                'title_accent' => 'Telemetry',
                'body' => 'Runtime traces, build events, and operator notes will stream into this channel.',
                'sort_order' => 2,
            ],
        ] as $section) {
            PageSection::query()->updateOrCreate(
                ['slug' => $section['slug']],
                $section + ['is_active' => true],
            );
        }
    }

    private function seedNavigation(): void
    {
        $topLevel = [
            ['label' => 'TERMINAL', 'href' => '/', 'icon' => 'Terminal', 'sort_order' => 1, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'MACHINES', 'href' => '/machines', 'icon' => 'Cpu', 'sort_order' => 3, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'TECH_STACK', 'href' => '/tech-stack', 'icon' => 'Layers', 'sort_order' => 4, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'USEFUL_SITES', 'href' => '/useful-sites', 'icon' => 'Globe', 'sort_order' => 5, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'FREE_APIS', 'href' => '/free-apis', 'icon' => 'Database', 'sort_order' => 6, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'PROJECTS', 'href' => '/#projects', 'icon' => 'Share2', 'sort_order' => 7, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'SYSTEM_LOGS', 'href' => '/#logs', 'icon' => 'FileText', 'sort_order' => 8, 'requires_auth' => false, 'is_group' => false],
            ['label' => 'PROFILE', 'href' => '/profile', 'icon' => 'Command', 'sort_order' => 9, 'requires_auth' => true, 'is_group' => false],
        ];

        foreach ($topLevel as $item) {
            NavigationItem::query()->updateOrCreate(
                ['label' => $item['label'], 'parent_id' => null],
                $item + ['is_active' => true],
            );
        }

        $devTools = NavigationItem::query()->updateOrCreate(
            ['label' => 'COOL_STUFF', 'parent_id' => null],
            [
                'href' => null,
                'icon' => 'Sparkles',
                'sort_order' => 2,
                'is_active' => true,
                'is_group' => true,
                'requires_auth' => false,
            ],
        );

        foreach ([
            ['label' => 'CONSOLE', 'href' => '/dev-tools/console', 'sort_order' => 1],
            ['label' => 'RUNTIME', 'href' => '/dev-tools/runtime', 'sort_order' => 2],
            ['label' => 'HASH_GENERATOR', 'href' => '/dev-tools/hash-generator', 'sort_order' => 3],
            ['label' => 'QR_GENERATOR', 'href' => '/dev-tools/qr-generator', 'sort_order' => 4],
            ['label' => 'CRON_GURU', 'href' => '/dev-tools/cron-guru', 'sort_order' => 5],
            ['label' => 'IMAGE_COMPRESSOR', 'href' => '/dev-tools/image-compressor', 'sort_order' => 6],
            ['label' => 'DEPLOYMENTS', 'href' => '/dev-tools/deployments', 'sort_order' => 7],
            ['label' => 'PHP_SYNTAX', 'href' => '/dev-tools/php-syntax-checker', 'sort_order' => 8],
            ['label' => 'HTML_SYNTAX', 'href' => '/dev-tools/html-syntax-checker', 'sort_order' => 9],
            ['label' => 'COLOR_CONVERTER', 'href' => '/dev-tools/color-converter', 'sort_order' => 10],
            ['label' => 'REGEX_LAB', 'href' => '/dev-tools/regex-lab', 'sort_order' => 11],
            ['label' => 'SQL_BUILDER', 'href' => '/dev-tools/sql-builder', 'sort_order' => 12],
        ] as $link) {
            NavigationItem::query()->updateOrCreate(
                ['href' => $link['href']],
                [
                    'parent_id' => $devTools->id,
                    'label' => $link['label'],
                    'sort_order' => $link['sort_order'],
                    'is_active' => true,
                    'requires_auth' => false,
                    'is_group' => false,
                ],
            );
        }
    }

    /**
     * @param  class-string  $model
     * @param  array<string, mixed>  $attributes
     */
    private function upsertSingleton(string $model, array $attributes): void
    {
        $record = $model::query()->first();

        if ($record) {
            $record->update($attributes);

            return;
        }

        $model::query()->create($attributes);
    }
}
