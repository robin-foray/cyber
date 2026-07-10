const cyberShellPagePattern = /^(welcome|profile|dev-tools\/|auth\/(login|register))$/;

export function usesCyberShellLayout(pageName: string) {
    return cyberShellPagePattern.test(pageName);
}

export const eagerCyberPages = import.meta.glob(['./pages/welcome.tsx', './pages/profile.tsx', './pages/dev-tools/*.tsx'], {
    eager: true,
});

export const lazyPages = import.meta.glob('./pages/**/*.tsx');

export const inertiaPages = {
    ...lazyPages,
    ...eagerCyberPages,
};
