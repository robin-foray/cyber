<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DevTools\HashGeneratorController;
use App\Http\Controllers\DevTools\PhpSyntaxCheckerController;
use App\Http\Controllers\FreeApiController;
use App\Http\Controllers\GuestPassController;
use App\Http\Controllers\MachineGalleryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QrLinkController;
use App\Http\Controllers\QrRedirectController;
use App\Http\Controllers\TechStackController;
use App\Http\Controllers\UsefulSiteController;
use App\Http\Controllers\WelcomeController;
use App\Services\GuestPassSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    if ($request->user()?->is_admin) {
        return app(WelcomeController::class)->index();
    }

    if (app(GuestPassSession::class)->current($request)) {
        return app(WelcomeController::class)->index();
    }

    return app(AuthenticatedSessionController::class)->create($request);
})->name('home');

Route::get('pass/{token}', [GuestPassController::class, 'redeem'])
    ->middleware('throttle:10,1')
    ->name('guest-pass.redeem');

Route::get('q/{slug}', QrRedirectController::class)
    ->middleware('throttle:60,1')
    ->name('qr.redirect');

Route::post('guest-pass/logout', [GuestPassController::class, 'logout'])
    ->name('guest-pass.logout');

if (app()->environment('local', 'testing') || config('foray.preview.welcome')) {
    Route::get('teszt/kezdolap', [WelcomeController::class, 'index'])
        ->middleware('throttle:60,1')
        ->name('test.welcome-preview');
}

Route::get('media/guest-pass/{guestPass}', [GuestPassController::class, 'avatar'])
    ->name('guest-pass.avatar');

Route::middleware(['site.access'])->group(function () {
    Route::get('machines', [MachineGalleryController::class, 'index'])->name('machines.index');
    Route::get('tech-stack', [TechStackController::class, 'index'])->name('tech-stack.index');
    Route::get('useful-sites', [UsefulSiteController::class, 'index'])->name('useful-sites.index');
    Route::get('free-apis', [FreeApiController::class, 'index'])->name('free-apis.index');
    Route::post('free-apis/probe', [FreeApiController::class, 'probe'])
        ->middleware('throttle:30,1')
        ->name('free-apis.probe');

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
    Route::get('dev-tools/sql-builder', function () {
        return Inertia::render('dev-tools/sql-builder');
    })->name('dev-tools.sql-builder');
});

Route::middleware(['auth'])->group(function () {
    Route::get('qr-links', [QrLinkController::class, 'index'])->name('qr-links.index');
    Route::get('qr-links/mobile', [QrLinkController::class, 'mobile'])->name('qr-links.mobile');
    Route::post('qr-links', [QrLinkController::class, 'store'])->name('qr-links.store');
    Route::match(['patch', 'post'], 'qr-links/{qrLink}', [QrLinkController::class, 'update'])->name('qr-links.update');
    Route::get('qr-links/{qrLink}/logo', [QrLinkController::class, 'logo'])->name('qr-links.logo');
    Route::delete('qr-links/{qrLink}', [QrLinkController::class, 'destroy'])->name('qr-links.destroy');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::match(['patch', 'post'], 'profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('media/avatar', [ProfileController::class, 'avatar'])->name('profile.avatar');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
