<?php

namespace App\Providers;

use App\Models\DeploymentStep;
use App\Models\DevToolPage;
use App\Models\FreeApi;
use App\Models\HeroContent;
use App\Models\HomeConsoleContent;
use App\Models\Machine;
use App\Models\NavigationItem;
use App\Models\PageSection;
use App\Models\QrLink;
use App\Models\SiteSetting;
use App\Models\SkillMetric;
use App\Models\SocialLink;
use App\Models\StackTechnology;
use App\Models\TechCategory;
use App\Models\TechStack;
use App\Models\TickerMessage;
use App\Models\UsefulSite;
use App\Services\ContentService;
use App\Services\ImagePipeline;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! $this->app->runningInConsole() && request()->secure()) {
            URL::forceScheme('https');
        } elseif (str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        Vite::createAssetPathsUsing(
            fn (string $path, ?bool $secure = null) => '/'.ltrim($path, '/'),
        );

        Route::bind('qrLink', function (string $value) {
            return QrLink::query()
                ->ownedBy(auth()->id())
                ->whereKey($value)
                ->firstOrFail();
        });

        $flush = function (): void {
            app(ContentService::class)->flush();
            Cache::forget('welcome.page');
        };

        foreach ([
            NavigationItem::class,
            HeroContent::class,
            HomeConsoleContent::class,
            SkillMetric::class,
            StackTechnology::class,
            TickerMessage::class,
            SocialLink::class,
            DeploymentStep::class,
            DevToolPage::class,
            PageSection::class,
            SiteSetting::class,
            TechStack::class,
            TechCategory::class,
            Machine::class,
            FreeApi::class,
            UsefulSite::class,
        ] as $model) {
            $model::saved($flush);
            $model::deleted($flush);
        }

        // Optimize raster uploads after Filament/public_web saves (SVG untouched).
        $optimizeIcon = function (TechStack $stack): void {
            if (! $stack->wasChanged('icon') || blank($stack->icon)) {
                return;
            }

            $path = ltrim((string) $stack->icon, '/');
            $optimized = app(ImagePipeline::class)->optimizeStored($path, 'public_web', 512);

            if ($optimized !== $path) {
                $stack->withoutEvents(fn () => $stack->update(['icon' => $optimized]));
            }
        };
        TechStack::saved($optimizeIcon);

        $optimizeMachineImage = function (Machine $machine): void {
            if (! $machine->wasChanged('image_url') || blank($machine->image_url)) {
                return;
            }

            $url = (string) $machine->image_url;
            if (! str_starts_with($url, '/storage/machines/')) {
                return;
            }

            $path = ltrim(substr($url, strlen('/storage/')), '/');
            $optimized = app(ImagePipeline::class)->optimizeStored($path, 'public', 1600);

            if ($optimized !== $path) {
                $machine->withoutEvents(fn () => $machine->update(['image_url' => '/storage/'.$optimized]));
            }
        };
        Machine::saved($optimizeMachineImage);
    }
}
