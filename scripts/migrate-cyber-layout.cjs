const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'resources/js/pages');
const files = [
    'welcome.tsx',
    'free-apis/index.tsx',
    'tech-stack/index.tsx',
    'useful-sites/index.tsx',
    'machines/gallery.tsx',
    'profile.tsx',
    'auth/login.tsx',
    'auth/register.tsx',
    'dev-tools/console.tsx',
    'dev-tools/runtime.tsx',
    'dev-tools/cron-guru.tsx',
    'dev-tools/image-compressor.tsx',
    'dev-tools/hash-generator.tsx',
    'dev-tools/deployments.tsx',
];

for (const rel of files) {
    const file = path.join(root, rel);
    let c = fs.readFileSync(file, 'utf8');

    if (c.includes('cyberLayout')) {
        console.log('skip', rel);
        continue;
    }

    c = c.replace(/import CyberShell from '@\/components\/cyber-shell';\r?\n/, '');

    if (!c.includes("from '@/layouts/cyber-layout'")) {
        c = "import { cyberLayout } from '@/layouts/cyber-layout';\n" + c;
    }

    c = c.replace(/<CyberShell>\s*/g, '');
    c = c.replace(/\s*<\/CyberShell>/g, '');

    const m = c.match(/export default function ([A-Za-z0-9_]+)/);
    if (!m) {
        console.log('NO EXPORT', rel);
        continue;
    }

    const name = m[1];
    if (!c.includes(name + '.layout')) {
        c = c.trimEnd() + '\n\n' + name + '.layout = cyberLayout;\n';
    }

    fs.writeFileSync(file, c);
    console.log('ok', rel, name);
}
