<?php

namespace App\Filament\Pages;

use App\Models\GuestPass;
use App\Models\GuestPassView;
use Filament\Pages\Page;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class GuestPassStatsPage extends Page implements HasTable
{
    use InteractsWithTable;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar-square';

    protected static string|UnitEnum|null $navigationGroup = 'Statisztika';

    protected static ?string $navigationLabel = 'Vendég statisztika';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Vendég belépő statisztika';

    protected string $view = 'filament.pages.guest-pass-stats';

    public int $activePasses = 0;

    public int $totalViews = 0;

    public int $viewsToday = 0;

    public function mount(): void
    {
        $this->activePasses = GuestPass::query()
            ->where('is_active', true)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->count();

        $this->totalViews = GuestPassView::query()->count();

        $this->viewsToday = GuestPassView::query()
            ->where('viewed_at', '>=', now()->startOfDay())
            ->count();
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                GuestPassView::query()->with('guestPass')->latest('viewed_at')
            )
            ->columns([
                TextColumn::make('viewed_at')
                    ->label('Időpont')
                    ->dateTime('Y-m-d H:i:s')
                    ->sortable(),
                TextColumn::make('guestPass.display_name')
                    ->label('Vendég')
                    ->searchable(),
                TextColumn::make('guestPass.label')
                    ->label('Admin címke')
                    ->toggleable(),
                TextColumn::make('page_label')
                    ->label('Oldal')
                    ->searchable(),
                TextColumn::make('path')
                    ->label('Útvonal')
                    ->searchable()
                    ->limit(40),
            ])
            ->defaultSort('viewed_at', 'desc')
            ->paginated([25, 50, 100]);
    }
}
