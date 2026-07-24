<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SkillMetricResource\Pages;
use App\Models\SkillMetric;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SkillMetricResource extends Resource
{
    protected static ?string $model = SkillMetric::class;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $navigationGroup = 'Kezdőlap';

    protected static ?string $navigationLabel = 'Integrity metrikák';

    protected static ?string $modelLabel = 'Metrika';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('label')->label('Felirat')->required(),
            Forms\Components\TextInput::make('progress')->label('Progress %')->numeric()->minValue(0)->maxValue(100)->required(),
            Forms\Components\TextInput::make('sort_order')->label('Sorrend')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Aktív')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label'),
                Tables\Columns\TextColumn::make('progress')->suffix('%'),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageSkillMetrics::route('/'),
        ];
    }
}
