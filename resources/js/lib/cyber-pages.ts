const cyberShellPagePattern = /^(welcome|profile|dev-tools\/|auth\/(login|register))$/;

export function usesCyberShellLayout(pageName: string) {
    return cyberShellPagePattern.test(pageName);
}
