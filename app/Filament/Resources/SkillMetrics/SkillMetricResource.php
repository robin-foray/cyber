<?php

namespace App\Filament\Resources\SkillMetrics;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use App\Filament\Resources\SkillMetrics\Pages\ManageSkillMetrics;
use App\Models\SkillMetric;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class SkillMetricResource extends Resource
{
    protected static ?string $model = SkillMetric::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-chart-bar';

    protected static string | \UnitEnum | null $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Integrity metrikák';

    protected static ?string $modelLabel = 'Metrika';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('label')->label('Felirat')->required(),
            TextInput::make('progress')->label('Progress %')->numeric()->minValue(0)->maxValue(100)->required(),
            TextInput::make('sort_order')->label('Sorrend')->numeric()->default(0),
            Toggle::make('is_active')->label('Aktív')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label'),
                TextColumn::make('progress')->suffix('%'),
                TextColumn::make('sort_order')->sortable(),
                IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSkillMetrics::route('/'),
        ];
    }
}
