---
name: laravel-feature
description: Add a Laravel backend feature with Inertia page — controller, route, request validation, model changes, and PHPUnit tests. Use for auth-gated pages, settings, profile, or new API endpoints outside dev-tools.
---

# Laravel Feature Workflow

## Before starting

Find the closest existing feature:
- Settings: `app/Http/Controllers/Settings/ProfileController.php`
- Cyber profile: `app/Http/Controllers/ProfileController.php`
- Auth: `app/Http/Controllers/Auth/`

## Steps

### 1. Route

Add to `routes/web.php` (public), `routes/settings.php` (auth + settings), or `routes/auth.php`.

```php
Route::middleware(['auth'])->group(function () {
    Route::get('example', [ExampleController::class, 'show'])->name('example.show');
    Route::patch('example', [ExampleController::class, 'update'])->name('example.update');
});
```

### 2. Controller

```php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ExampleController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('example/show');
    }
}
```

### 3. Form request (if validation is non-trivial)

`app/Http/Requests/ExampleUpdateRequest.php` with `rules()` method.

### 4. Model / migration (if DB changes)

```bash
php artisan make:migration add_fields_to_users_table
php artisan migrate
```

Update `app/Models/User.php` — add to `$fillable`, accessors as needed.

### 5. Inertia page

Choose layout:
- Cyber: `CyberShell` → `resources/js/pages/...`
- Admin: `AppLayout` → `resources/js/layouts/app/...`

Use `useForm` for mutations:

```tsx
const { data, setData, patch, processing, errors } = useForm({ ... });
```

### 6. Shared props

If new data must be globally available, add to `app/Http/Middleware/HandleInertiaRequests.php` `share()` method. Update `resources/js/types/index.ts` accordingly.

### 7. Tests

```php
// tests/Feature/ExampleTest.php
public function test_guests_cannot_access(): void
{
    $this->get(route('example.show'))->assertRedirect(route('login'));
}

public function test_authenticated_users_can_view(): void
{
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get(route('example.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('example/show'));
}
```

### 8. Verify

```bash
./vendor/bin/phpunit --filter Example
vendor/bin/pint
npm run build
```

## Route naming

Use unique names. Avoid duplicating `profile.update` (conflict between `web.php` and `settings.php`).
