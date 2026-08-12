<?php

namespace App\Filament\Pages;

use BezhanSalleh\GoogleAnalytics\Pages\GoogleAnalyticsDashboard as BaseGoogleAnalyticsDashboard;
use UnitEnum;

class AnalyticsDashboard extends BaseGoogleAnalyticsDashboard
{
    protected static string|UnitEnum|null $navigationGroup = 'Statisztika';

    protected static ?int $navigationSort = 1;

    public static function getNavigationLabel(): string
    {
        return 'Google Analytics';
    }

    public static function canView(): bool
    {
        return true;
    }

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }
}
