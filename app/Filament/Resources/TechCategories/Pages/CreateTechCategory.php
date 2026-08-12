<?php

namespace App\Filament\Resources\TechCategories\Pages;

use App\Filament\Resources\TechCategories\TechCategoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateTechCategory extends CreateRecord
{
    protected static string $resource = TechCategoryResource::class;
}
