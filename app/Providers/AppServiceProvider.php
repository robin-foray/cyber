<?php

namespace App\Providers;

use App\Models\DeploymentStep;
use App\Models\HeroContent;
use App\Models\HomeConsoleContent;
use App\Models\NavigationItem;
use App\Models\SiteSetting;
use App\Models\SkillMetric;
use App\Models\SocialLink;
use App\Models\StackTechnology;
use App\Models\TickerMessage;
use App\Services\ContentService;
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
        $flush = fn () => app(ContentService::class)->flush();

        foreach ([
            NavigationItem::class,
            HeroContent::class,
            HomeConsoleContent::class,
            SkillMetric::class,
            StackTechnology::class,
            TickerMessage::class,
            SocialLink::class,
            DeploymentStep::class,
            SiteSetting::class,
        ] as $model) {
            $model::saved($flush);
            $model::deleted($flush);
        }
    }
}
