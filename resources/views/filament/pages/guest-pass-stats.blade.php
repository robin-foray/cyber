<x-filament-panels::page>
    <div class="mb-6 grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-primary/20 bg-gray-950 p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Aktív belépők</p>
            <p class="mt-2 text-3xl font-bold text-primary">{{ number_format($this->activePasses) }}</p>
        </div>
        <div class="rounded-xl border border-primary/20 bg-gray-950 p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Összes megtekintés</p>
            <p class="mt-2 text-3xl font-bold text-primary">{{ number_format($this->totalViews) }}</p>
        </div>
        <div class="rounded-xl border border-primary/20 bg-gray-950 p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Ma</p>
            <p class="mt-2 text-3xl font-bold text-primary">{{ number_format($this->viewsToday) }}</p>
        </div>
    </div>

    {{ $this->table }}
</x-filament-panels::page>
