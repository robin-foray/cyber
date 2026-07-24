import Masonry, { type MasonryItem } from '@/components/cyber/masonry';
import SpecularButton from '@/components/cyber/specular-button';
import { Head, router } from '@inertiajs/react';
import { Cpu, Layers3 } from 'lucide-react';
import { useMemo, useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
};

type MachineCard = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    img: string;
    url: string | null;
    height: number;
    category: string | null;
    category_slug: string | null;
};

type GalleryProps = {
    categories: Category[];
    machines: MachineCard[];
    activeCategory: string | null;
};

export default function MachineGallery({ categories, machines, activeCategory }: GalleryProps) {
    const [selected, setSelected] = useState<MachineCard | null>(null);

    const items = useMemo<MasonryItem[]>(
        () =>
            machines.map((machine) => ({
                id: machine.id,
                img: machine.img,
                url: machine.url ?? undefined,
                height: machine.height,
                title: machine.name,
                category: machine.category ?? undefined,
            })),
        [machines],
    );

    function selectCategory(slug: string | null) {
        router.get(
            '/machines',
            slug ? { category: slug } : {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    const activeMeta = categories.find((category) => category.slug === activeCategory);

    return (
        <>
            <Head title="Machines" />

            <section className="space-y-6">
                <div className="cyber-grid rounded-3xl border border-primary/15 bg-surface/80 p-6 shadow-[0_0_22px_rgba(204,255,0,0.08)] sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-2 flex items-center gap-3 text-sm font-bold tracking-widest text-primary">
                                <Cpu size={18} />
                                MACHINE_GALLERY
                            </div>
                            <p className="max-w-2xl text-sm text-on-surface-variant">
                                {activeMeta?.description ?? 'Browse hardware nodes by category. Filter the masonry grid to inspect classified machines.'}
                            </p>
                        </div>
                        <div className="rounded-xl border border-primary/20 bg-black/40 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase">
                            {machines.length} units // {categories.length} categories
                        </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                        <Layers3 size={14} className="text-primary" />
                        Category_Filter
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="w-auto min-w-[7.5rem]">
                            <SpecularButton
                                type="button"
                                size="sm"
                                active={!activeCategory}
                                autoAnimate={!activeCategory}
                                onClick={() => selectCategory(null)}
                                labelClassName="justify-center"
                            >
                                ALL
                            </SpecularButton>
                        </div>
                        {categories.map((category) => (
                            <div key={category.id} className="w-auto min-w-[7.5rem]">
                                <SpecularButton
                                    type="button"
                                    size="sm"
                                    active={activeCategory === category.slug}
                                    autoAnimate={activeCategory === category.slug}
                                    onClick={() => selectCategory(category.slug)}
                                    labelClassName="justify-center"
                                >
                                    {category.name.toUpperCase().replaceAll(' ', '_')}
                                </SpecularButton>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-primary/10 bg-surface-low/60 p-3 sm:p-4">
                    {items.length > 0 ? (
                        <Masonry
                            key={activeCategory ?? 'all'}
                            items={items}
                            animateFrom="bottom"
                            blurToFocus
                            colorShiftOnHover
                            scaleOnHover
                            onItemClick={(item) => {
                                const machine = machines.find((entry) => entry.id === item.id);
                                setSelected(machine ?? null);
                            }}
                        />
                    ) : (
                        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-primary/20 text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
                            No machines in this category
                        </div>
                    )}
                </div>

                {selected && (
                    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setSelected(null)}>
                        <div
                            className="w-full max-w-lg overflow-hidden rounded-3xl border border-primary/25 bg-surface shadow-[0_0_40px_rgba(204,255,0,0.15)]"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url(${selected.img})` }} />
                            <div className="space-y-3 p-6">
                                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{selected.category}</p>
                                <h2 className="font-display text-2xl font-bold tracking-wide">{selected.name}</h2>
                                <p className="text-sm text-on-surface-variant">{selected.description}</p>
                                <div className="flex gap-2 pt-2">
                                    <div className="min-w-[8rem] flex-1">
                                        <SpecularButton type="button" size="sm" active onClick={() => setSelected(null)} labelClassName="justify-center">
                                            CLOSE
                                        </SpecularButton>
                                    </div>
                                    {selected.url && (
                                        <div className="min-w-[8rem] flex-1">
                                            <SpecularButton
                                                as="a"
                                                href={selected.url}
                                                size="sm"
                                                labelClassName="justify-center"
                                                onClick={() => window.open(selected.url!, '_blank', 'noopener')}
                                            >
                                                OPEN_LINK
                                            </SpecularButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
