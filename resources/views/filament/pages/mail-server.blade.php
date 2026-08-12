<x-filament-panels::page>
    <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500 dark:text-gray-400">Összes cím</div>
            <div class="mt-1 text-2xl font-semibold">{{ $this->mailboxStats['total'] }}</div>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500 dark:text-gray-400">Aktív</div>
            <div class="mt-1 text-2xl font-semibold">{{ $this->mailboxStats['active'] }}</div>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500 dark:text-gray-400">Postafiók</div>
            <div class="mt-1 text-2xl font-semibold">{{ $this->mailboxStats['mailbox'] }}</div>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500 dark:text-gray-400">Alias</div>
            <div class="mt-1 text-2xl font-semibold">{{ $this->mailboxStats['alias'] }}</div>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500 dark:text-gray-400">Továbbítás</div>
            <div class="mt-1 text-2xl font-semibold">{{ $this->mailboxStats['forward'] }}</div>
        </div>
    </div>

    <form wire:submit="save" class="space-y-6">
        {{ $this->form }}

        <div class="flex flex-wrap items-center gap-3">
            <x-filament::button type="submit">
                Beállítások mentése
            </x-filament::button>

            <x-filament::button
                tag="a"
                color="gray"
                :href="\App\Filament\Resources\FamilyMailboxResource::getUrl()"
            >
                Családi emailek kezelése
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
