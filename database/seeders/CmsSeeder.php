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
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        HeroContent::query()->create([
            'badge' => 'Deployment Protocol // Archive_01',
            'title_line' => 'Architecting the',
            'title_accent' => 'Digital Future',
            'cta_label' => 'LAUNCH_CORE',
            'background_image' => '/assets/hero-cyber-archer.png',
        ]);

        HomeConsoleContent::query()->create([
            'section_label' => 'DEV_TOOLS_CONSOLE',
            'input_sample' => '{ "node": "0x4a2b", "status": "sync" }',
            'output_sample' => '{ "verified": true, "latency": "0.4ms" }',
        ]);

        foreach ([
            ['label' => 'REACT_ECOSYSTEM', 'progress' => 92, 'sort_order' => 1],
            ['label' => 'LARAVEL_RUNTIME', 'progress' => 88, 'sort_order' => 2],
            ['label' => 'NODE_PIPELINE', 'progress' => 75, 'sort_order' => 3],
        ] as $skill) {
            SkillMetric::query()->create($skill + ['is_active' => true]);
        }

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
            StackTechnology::query()->create($stack + ['is_active' => true]);
        }

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
            TickerMessage::query()->create($ticker + ['is_active' => true]);
        }

        foreach ([
            ['platform' => 'Github', 'url' => null, 'sort_order' => 1],
            ['platform' => 'Twitter', 'url' => null, 'sort_order' => 2],
            ['platform' => 'Instagram', 'url' => null, 'sort_order' => 3],
            ['platform' => 'Facebook', 'url' => null, 'sort_order' => 4],
        ] as $social) {
            SocialLink::query()->create($social + ['is_active' => true]);
        }

        foreach ([
            'archive_01 prepared',
            'manifest synced',
            'assets compiled',
            'queue clear',
        ] as $index => $label) {
            DeploymentStep::query()->create([
                'label' => $label,
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        }

        SiteSetting::query()->insert([
            ['key' => 'footer_copyright', 'value' => '(c)2026 DEV_HUB_CORE.', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'welcome_page_title', 'value' => 'Neural Dev Dashboard', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'integrity_section_title', 'value' => 'Integrity_Check', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'stacks_section_title', 'value' => 'STACKS_PROTOCOL', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'stacks_heading_prefix', 'value' => 'Tech', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'stacks_heading_accent', 'value' => 'Stack', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'stacks_panel_hint', 'value' => 'live module registry // click a cell to open stack telemetry', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'topbar_terminal', 'value' => 'TERMINAL', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'topbar_dev_tools', 'value' => 'DEV_TOOLS', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'topbar_access_gate', 'value' => 'ACCESS_GATE', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'topbar_node_registration', 'value' => 'NODE_REGISTRATION', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'topbar_profile', 'value' => 'PROFILE', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $devToolPages = [
            ['slug' => 'console', 'header_label' => 'DEV_TOOL_01 // JSON_FORMATTER', 'page_title' => 'JSON Formatter', 'heading_prefix' => 'JSON', 'heading_accent' => 'Formatter', 'sample_input' => '{"node":"foray-core","status":"sync","tools":["json_formatter","runtime_probe"],"payload":{"latency":0.4,"verified":true}}', 'icon' => 'FileJson2', 'sort_order' => 1],
            ['slug' => 'runtime', 'header_label' => 'DEV_TOOL_02 // PAYLOAD_CODEC', 'page_title' => 'Runtime Codec', 'heading_prefix' => 'Runtime', 'heading_accent' => 'Codec', 'sample_input' => 'eyJub2RlIjoiZm9yYXktcnVudGltZSIsInN0YXR1cyI6Im9ubGluZSJ9', 'icon' => 'Binary', 'sort_order' => 2],
            ['slug' => 'hash-generator', 'header_label' => 'DEV_TOOL_03 // HASH_GENERATOR', 'page_title' => 'Hash Generator', 'heading_prefix' => 'Hash', 'heading_accent' => 'Generator', 'sample_input' => 'foray-admin-node', 'icon' => 'Fingerprint', 'sort_order' => 3],
            ['slug' => 'qr-generator', 'header_label' => 'DEV_TOOL_04 // QR_GENERATOR', 'page_title' => 'QR Generator', 'heading_prefix' => 'QR', 'heading_accent' => 'Generator', 'sample_input' => 'https://foray.local/dev-tools', 'icon' => 'QrCode', 'sort_order' => 4],
            ['slug' => 'cron-guru', 'header_label' => 'DEV_TOOL_05 // CRON_GURU', 'page_title' => 'Cron Guru', 'heading_prefix' => 'Cron', 'heading_accent' => 'Guru', 'sample_input' => '*/15 9-17 * * 1-5', 'icon' => 'CalendarClock', 'sort_order' => 5],
            ['slug' => 'image-compressor', 'header_label' => 'DEV_TOOL_06 // IMAGE_COMPRESSOR', 'page_title' => 'Image Compressor', 'heading_prefix' => 'Image', 'heading_accent' => 'Compressor', 'sample_input' => null, 'icon' => 'ImageDown', 'sort_order' => 6],
            ['slug' => 'deployments', 'header_label' => 'DEPLOYMENT_PROTOCOL', 'page_title' => 'Deployments', 'heading_prefix' => null, 'heading_accent' => null, 'sample_input' => null, 'icon' => 'Rocket', 'sort_order' => 7],
        ];

        foreach ($devToolPages as $page) {
            DevToolPage::query()->create($page + ['is_active' => true]);
        }

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
            PageSection::query()->create($section + ['is_active' => true]);
        }

        $devTools = NavigationItem::query()->create([
            'label' => 'DEV_TOOLS',
            'href' => null,
            'icon' => 'Construction',
            'sort_order' => 2,
            'is_active' => true,
            'is_group' => true,
        ]);

        $devToolLinks = [
            ['label' => 'CONSOLE', 'href' => '/dev-tools/console', 'sort_order' => 1],
            ['label' => 'RUNTIME', 'href' => '/dev-tools/runtime', 'sort_order' => 2],
            ['label' => 'HASH_GENERATOR', 'href' => '/dev-tools/hash-generator', 'sort_order' => 3],
            ['label' => 'QR_GENERATOR', 'href' => '/dev-tools/qr-generator', 'sort_order' => 4],
            ['label' => 'CRON_GURU', 'href' => '/dev-tools/cron-guru', 'sort_order' => 5],
            ['label' => 'IMAGE_COMPRESSOR', 'href' => '/dev-tools/image-compressor', 'sort_order' => 6],
            ['label' => 'DEPLOYMENTS', 'href' => '/dev-tools/deployments', 'sort_order' => 7],
        ];

        foreach ($devToolLinks as $link) {
            NavigationItem::query()->create([
                'parent_id' => $devTools->id,
                'label' => $link['label'],
                'href' => $link['href'],
                'sort_order' => $link['sort_order'],
                'is_active' => true,
            ]);
        }

        NavigationItem::query()->insert([
            ['label' => 'TERMINAL', 'href' => '/', 'icon' => 'Terminal', 'sort_order' => 1, 'is_active' => true, 'requires_auth' => false, 'is_group' => false, 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'PROJECTS', 'href' => '/#projects', 'icon' => 'Share2', 'sort_order' => 3, 'is_active' => true, 'requires_auth' => false, 'is_group' => false, 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'SYSTEM_LOGS', 'href' => '/#logs', 'icon' => 'FileText', 'sort_order' => 4, 'is_active' => true, 'requires_auth' => false, 'is_group' => false, 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'PROFILE', 'href' => '/profile', 'icon' => 'Command', 'sort_order' => 5, 'is_active' => true, 'requires_auth' => true, 'is_group' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);

        User::query()->updateOrCreate(
            ['email' => 'admin@foray.local'],
            [
                'name' => 'Root Operator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'title' => 'Root Operator',
                'avatar_seed' => 'root-operator',
            ],
        );
    }
}
