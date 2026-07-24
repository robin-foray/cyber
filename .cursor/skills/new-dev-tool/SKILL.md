---
name: new-dev-tool
description: Add a new public dev-tool to the Foray cyber toolkit. Use when creating a new tool page, lib module, route, sidebar link, or tests for dev-tools.
---

# New Dev-Tool Workflow

## Before starting

Read an existing similar tool:
- Client-only reference: `resources/js/pages/dev-tools/console.tsx` + `resources/js/lib/json-formatter.ts`
- Server-backed reference: `resources/js/pages/dev-tools/hash-generator.tsx` + `app/Http/Controllers/DevTools/HashGeneratorController.php`

## Steps

### 1. Create lib module

File: `resources/js/lib/<tool-name>.ts`

- Export types and pure functions
- Return `{ output, error }` pattern — never throw to the page
- Keep functions testable (no React, no DOM unless required)

### 2. Create Vitest tests

File: `resources/js/lib/<tool-name>.test.ts`

- Test valid input, invalid input, edge cases
- Run: `npm test`

### 3. Create Inertia page

File: `resources/js/pages/dev-tools/<tool-name>.tsx`

Structure:
- Wrap in `<CyberShell>`
- `<Head title="Tool Name" />`
- Cyber section with `DEV_TOOL_XX // LABEL` header
- Status tiles, dual-pane input/output, `.cyber-tool-button` actions
- Import logic from `@/lib/<tool-name>`
- Include sample data in initial state

### 4. Register route

In `routes/web.php`:

```php
Route::get('dev-tools/<tool-name>', function () {
    return Inertia::render('dev-tools/<tool-name>');
})->name('dev-tools.<tool-name>');
```

If server API needed, create controller in `app/Http/Controllers/DevTools/` and add POST routes.

### 5. Filament admin (mandatory)

**Navigation:** add a `NavigationItem` child under the DEV_TOOLS parent — via Filament **Menüpontok** or `CmsSeeder`. Do not hardcode links in `sidebar.tsx`.

**Editable content:** if the tool exposes CMS-managed copy or lists, add model + migration + Filament Resource + `ContentService` method. See `.cursor/rules/filament-cms.mdc`.

### 6. Add PHPUnit test

In `tests/Feature/DevTools/DevToolsRoutesTest.php`, add entry to `devToolRoutesProvider`:

```php
'tool-name' => ['dev-tools.<tool-name>', 'dev-tools/<tool-name>'],
```

If server endpoints exist, add tests to `HashGeneratorTest` or a new test class in the same file.

If CMS content was added, add a `ContentService` test in `tests/Feature/Cms/`.

### 7. Verify

```bash
npm test
./vendor/bin/phpunit --filter DevTools
npm run build
```

## Server-backed API (only when needed)

Controller template:

```php
namespace App\Http\Controllers\DevTools;

class ExampleController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('dev-tools/example');
    }

    public function process(Request $request): JsonResponse
    {
        $validated = $request->validate([...]);
        return response()->json([...]);
    }
}
```

Frontend: use `fetch` with CSRF token from `document.querySelector('meta[name="csrf-token"]')`.
