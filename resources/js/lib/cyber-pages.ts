const cyberShellPagePattern = /^(welcome|profile|auth\/(login|register)|dev-tools\/)/;

export function usesCyberShellLayout(pageName: string) {
    return cyberShellPagePattern.test(pageName);
}
