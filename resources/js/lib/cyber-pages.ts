const cyberShellPagePattern = /^(welcome|profile|auth\/login|machines\/gallery|tech-stack\/index|useful-sites\/index|free-apis\/index|dev-tools\/)/;

export function usesCyberShellLayout(pageName: string) {
    return cyberShellPagePattern.test(pageName);
}
