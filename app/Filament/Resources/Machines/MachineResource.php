<?php

namespace App\Filament\Resources\Machines;

use App\Filament\Resources\Machines\Pages\CreateMachine;
use App\Filament\Resources\Machines\Pages\EditMachine;
use App\Filament\Resources\Machines\Pages\ListMachines;
use App\Models\Machine;
use App\Services\ImagePipeline;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use pxlrbt\FilamentExcel\Actions\ExportBulkAction;

class MachineResource extends Resource
{
    protected static ?string $model = Machine::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cpu-chip';

    protected static string|\UnitEnum|null $navigationGroup = 'Machines';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('machine_category_id')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            Textarea::make('description')->rows(3)->columnSpanFull(),
            TextInput::make('image_url')
                ->label('Image URL')
                ->url()
                ->required()
                ->columnSpanFull()
                ->helperText('Külső URL, vagy tölts fel képet alább (WebP/AVIF).'),
            FileUpload::make('image_upload')
                ->label('Upload image')
                ->image()
                ->disk('public')
                ->directory('machines')
                ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'])
                ->maxSize(5120)
                ->dehydrated(false)
                ->columnSpanFull()
                ->helperText('Mentés a /storage/machines alá (WebP/AVIF). Ne ütközzön a /machines galéria route-tal.')
                ->afterStateUpdated(function ($state, Set $set): void {
                    $file = is_array($state) ? ($state[0] ?? null) : $state;
                    if (! $file instanceof TemporaryUploadedFile) {
                        return;
                    }

                    $result = app(ImagePipeline::class)->storeOptimized(
                        $file,
                        'machines',
                        'public',
                        maxWidth: 1600,
                    );

                    $url = $result['urls']['avif']
                        ?? $result['urls']['webp']
                        ?? $result['urls']['original']
                        ?? '/storage/'.ltrim($result['path'], '/');

                    $set('image_url', $url);
                }),
            TextInput::make('url')->url()->nullable()->columnSpanFull(),
            TextInput::make('height')->numeric()->default(500)->required(),
            TextInput::make('sort_order')->numeric()->default(0)->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_url')->label('Image'),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('category.name')->sortable(),
                TextColumn::make('height'),
                TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                SelectFilter::make('machine_category_id')
                    ->relationship('category', 'name')
                    ->label('Category'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    ExportBulkAction::make(),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMachines::route('/'),
            'create' => CreateMachine::route('/create'),
            'edit' => EditMachine::route('/{record}/edit'),
        ];
    }
}
