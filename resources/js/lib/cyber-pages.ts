const cyberShellPagePattern = /^(welcome|profile|machines\/gallery|tech-stack\/index|useful-sites\/index|free-apis\/index|qr-links\/(index|mobile)|dev-tools\/)/;

export function usesCyberShellLayout(pageName: string) {
    return cyberShellPagePattern.test(pageName);
}
