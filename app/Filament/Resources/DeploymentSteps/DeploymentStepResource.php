<?php

namespace App\Filament\Resources\DeploymentSteps;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use App\Filament\Resources\DeploymentSteps\Pages\ManageDeploymentSteps;
use App\Models\DeploymentStep;
use Filament\Resources\Resource;
use Filament\Tables\Table;

class DeploymentStepResource extends Resource
{
    protected static ?string $model = DeploymentStep::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-rocket-launch';

    protected static string | \UnitEnum | null $navigationGroup = 'Dev Tools';

    protected static ?string $navigationLabel = 'Deployment lépések';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('label')->label('Lépés szöveg')->required(),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label'),
                TextColumn::make('sort_order')->sortable(),
                IconColumn::make('is_active')->boolean(),
            ])
            ->reorderable('sort_order')
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageDeploymentSteps::route('/')];
    }
}
