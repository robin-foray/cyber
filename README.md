# Foray (Cyber)

Laravel + Inertia + React developer toolkit with a cyberpunk UI. Public dev-tools (JSON formatter, hash generator, QR codes, cron parser, image compressor, and more) plus authenticated dashboard and profile.

## Stack

- **Backend:** PHP 8.2+, Laravel 12, Inertia Laravel 2, Ziggy
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide icons
- **Tests:** PHPUnit 11, Vitest 3

## Setup

```bash
cp .env.example .env
composer install
npm ci
php artisan key:generate
touch database/database.sqlite
php artisan migrate
composer run dev
```

Visit `http://localhost:8000`.

## Dev tools

| Tool | URL |
|------|-----|
| JSON Formatter | `/dev-tools/console` |
| Runtime Codec | `/dev-tools/runtime` |
| Hash Generator | `/dev-tools/hash-generator` |
| QR Generator | `/dev-tools/qr-generator` |
| Cron Guru | `/dev-tools/cron-guru` |
| Image Compressor | `/dev-tools/image-compressor` |
| Deployments | `/dev-tools/deployments` |

## Scripts

```bash
composer run dev      # Full dev stack (server, queue, logs, vite)
npm run dev           # Vite only
npm test              # Vitest
./vendor/bin/phpunit  # PHP tests
vendor/bin/pint       # PHP formatter
npm run lint          # ESLint
npm run format        # Prettier
```

## AI / Cursor setup

This repo includes agent infrastructure for Cursor:

- **`AGENTS.md`** — architecture and conventions for AI agents
- **`.cursor/rules/`** — stack-specific coding rules
- **`.cursor/skills/`** — reusable workflows (new dev-tool, Laravel feature, run & test)
- **`.cursor/mcp.json.example`** — template for MCP servers (GitHub, etc.)

Copy `.cursor/mcp.json.example` to `.cursor/mcp.json` and add your tokens in Cursor Desktop settings.

## Admin (Filament CMS)

Content is editable at `/admin` (admin users only).

```bash
php artisan migrate
php artisan db:seed --class=CmsSeeder
```

Default admin: `admin@foray.local` / `password`

Manage navigation, hero, stacks, tickers, social links, and deployment steps from the admin panel.

## License

MIT
