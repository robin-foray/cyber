<?php

use App\Http\Controllers\DevTools\HashGeneratorController;
use App\Http\Controllers\DevTools\PhpSyntaxCheckerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('dev-tools/console', function () {
    return Inertia::render('dev-tools/console');
})->name('dev-tools.console');

Route::get('dev-tools/runtime', function () {
    return Inertia::render('dev-tools/runtime');
})->name('dev-tools.runtime');

Route::get('dev-tools/cron-guru', function () {
    return Inertia::render('dev-tools/cron-guru');
})->name('dev-tools.cron-guru');

Route::get('dev-tools/image-compressor', function () {
    return Inertia::render('dev-tools/image-compressor');
})->name('dev-tools.image-compressor');

Route::get('dev-tools/deployments', function () {
    return Inertia::render('dev-tools/deployments');
})->name('dev-tools.deployments');

Route::get('dev-tools/hash-generator', [HashGeneratorController::class, 'show'])->name('dev-tools.hash-generator');
Route::post('dev-tools/hash-generator/bcrypt', [HashGeneratorController::class, 'bcrypt'])->name('dev-tools.hash-generator.bcrypt');
Route::post('dev-tools/hash-generator/verify', [HashGeneratorController::class, 'verify'])->name('dev-tools.hash-generator.verify');
Route::get('dev-tools/qr-generator', function () {
    return Inertia::render('dev-tools/qr-generator');
})->name('dev-tools.qr-generator');
Route::get('dev-tools/php-syntax-checker', [PhpSyntaxCheckerController::class, 'show'])->name('dev-tools.php-syntax-checker');
Route::post('dev-tools/php-syntax-checker/lint', [PhpSyntaxCheckerController::class, 'lint'])->name('dev-tools.php-syntax-checker.lint');
Route::get('dev-tools/html-syntax-checker', function () {
    return Inertia::render('dev-tools/html-syntax-checker');
})->name('dev-tools.html-syntax-checker');
Route::get('dev-tools/color-converter', function () {
    return Inertia::render('dev-tools/color-converter');
})->name('dev-tools.color-converter');
Route::get('dev-tools/regex-lab', function () {
    return Inertia::render('dev-tools/regex-lab');
})->name('dev-tools.regex-lab');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
