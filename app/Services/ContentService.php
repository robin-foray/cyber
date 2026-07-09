<?php

namespace App\Services;

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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class ContentService
{
    public function sharedPayload(): array
    {
        return Cache::remember('cms.shared', now()->addMinutes(5), function (): array {
            return [
                'navigation' => $this->navigation(),
                'hero' => $this->hero(),
                'homeConsole' => $this->homeConsole(),
                'skills' => $this->skills(),
                'stacks' => $this->stacks(),
                'tickers' => [
                    'topbar' => $this->tickers('topbar'),
                    'footer' => $this->tickers('footer'),
                ],
                'socialLinks' => $this->socialLinks(),
                'deploymentSteps' => $this->deploymentSteps(),
                'devToolPages' => $this->devToolPages(),
                'pageSections' => $this->pageSections(),
                'topbarLabels' => $this->topbarLabels(),
                'settings' => $this->settings(),
            ];
        });
    }

    public function flush(): void
    {
        Cache::forget('cms.shared');
    }

    public function navigation(): array
    {
        if (! Schema::hasTable('navigation_items')) {
            return [];
        }

        $items = NavigationItem::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->with(['children' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')])
            ->get();

        return $items->map(fn (NavigationItem $item) => $this->formatNavigationItem($item))->all();
    }

    public function hero(): array
    {
        if (! Schema::hasTable('hero_contents')) {
            return $this->defaultHero();
        }

        $hero = HeroContent::query()->first();

        if (! $hero) {
            return $this->defaultHero();
        }

        return [
            'badge' => $hero->badge,
            'titleLine' => $hero->title_line,
            'titleAccent' => $hero->title_accent,
            'ctaLabel' => $hero->cta_label ?? 'LAUNCH_CORE',
            'backgroundImage' => $hero->background_image ?? '/assets/hero-cyber-archer.png',
        ];
    }

    public function homeConsole(): array
    {
        if (! Schema::hasTable('home_console_contents')) {
            return $this->defaultHomeConsole();
        }

        $console = HomeConsoleContent::query()->first();

        if (! $console) {
            return $this->defaultHomeConsole();
        }

        return [
            'sectionLabel' => $console->section_label,
            'inputSample' => $console->input_sample,
            'outputSample' => $console->output_sample,
        ];
    }

    public function skills(): array
    {
        if (! Schema::hasTable('skill_metrics')) {
            return [];
        }

        return SkillMetric::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['label', 'progress'])
            ->map(fn (SkillMetric $skill) => [
                'label' => $skill->label,
                'progress' => $skill->progress,
            ])
            ->all();
    }

    public function stacks(): array
    {
        if (! Schema::hasTable('stack_technologies')) {
            return [];
        }

        return StackTechnology::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (StackTechnology $stack) => [
                'name' => $stack->name,
                'signal' => $stack->signal,
                'summary' => $stack->summary,
                'bullets' => $stack->bullets,
                'docs' => $stack->docs_url,
                'icon' => $stack->icon,
            ])
            ->all();
    }

    public function tickers(string $location): array
    {
        if (! Schema::hasTable('ticker_messages')) {
            return [];
        }

        return TickerMessage::query()
            ->where('location', $location)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['text', 'is_highlighted'])
            ->map(fn (TickerMessage $ticker) => [
                'text' => $ticker->text,
                'isHighlighted' => $ticker->is_highlighted,
            ])
            ->all();
    }

    public function socialLinks(): array
    {
        if (! Schema::hasTable('social_links')) {
            return [];
        }

        return SocialLink::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['platform', 'url'])
            ->map(fn (SocialLink $link) => [
                'platform' => $link->platform,
                'url' => $link->url,
            ])
            ->all();
    }

    public function deploymentSteps(): array
    {
        if (! Schema::hasTable('deployment_steps')) {
            return [];
        }

        return DeploymentStep::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->pluck('label')
            ->all();
    }

    public function settings(): array
    {
        if (! Schema::hasTable('site_settings')) {
            return [];
        }

        return SiteSetting::query()
            ->pluck('value', 'key')
            ->all();
    }

    public function devToolPages(): array
    {
        if (! Schema::hasTable('dev_tool_pages')) {
            return [];
        }

        return DevToolPage::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(fn (DevToolPage $page) => [
                $page->slug => [
                    'headerLabel' => $page->header_label,
                    'pageTitle' => $page->page_title,
                    'headingPrefix' => $page->heading_prefix,
                    'headingAccent' => $page->heading_accent,
                    'sampleInput' => $page->sample_input,
                    'icon' => $page->icon,
                ],
            ])
            ->all();
    }

    public function pageSections(): array
    {
        if (! Schema::hasTable('page_sections')) {
            return [];
        }

        return PageSection::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (PageSection $section) => [
                'slug' => $section->slug,
                'sectionLabel' => $section->section_label,
                'title' => $section->title,
                'titleAccent' => $section->title_accent,
                'body' => $section->body,
            ])
            ->all();
    }

    public function topbarLabels(): array
    {
        $settings = $this->settings();

        return [
            'terminal' => $settings['topbar_terminal'] ?? 'TERMINAL',
            'devTools' => $settings['topbar_dev_tools'] ?? 'DEV_TOOLS',
            'accessGate' => $settings['topbar_access_gate'] ?? 'ACCESS_GATE',
            'nodeRegistration' => $settings['topbar_node_registration'] ?? 'NODE_REGISTRATION',
            'profile' => $settings['topbar_profile'] ?? 'PROFILE',
        ];
    }

    private function formatNavigationItem(NavigationItem $item): array
    {
        return [
            'id' => $item->id,
            'label' => $item->label,
            'href' => $item->href,
            'icon' => $item->icon,
            'requiresAuth' => $item->requires_auth,
            'isGroup' => $item->is_group,
            'children' => $item->children
                ->map(fn (NavigationItem $child) => [
                    'label' => $child->label,
                    'href' => $child->href,
                ])
                ->all(),
        ];
    }

    private function defaultHero(): array
    {
        return [
            'badge' => 'Deployment Protocol // Archive_01',
            'titleLine' => 'Architecting the',
            'titleAccent' => 'Digital Future',
            'ctaLabel' => 'LAUNCH_CORE',
            'backgroundImage' => '/assets/hero-cyber-archer.png',
        ];
    }

    private function defaultHomeConsole(): array
    {
        return [
            'sectionLabel' => 'DEV_TOOLS_CONSOLE',
            'inputSample' => '{ "node": "0x4a2b", "status": "sync" }',
            'outputSample' => '{ "verified": true, "latency": "0.4ms" }',
        ];
    }
}
