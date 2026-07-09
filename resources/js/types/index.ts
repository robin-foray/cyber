import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    cms: CmsContent;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    avatar_url?: string;
    role?: 'admin' | 'member' | string;
    title?: string | null;
    bio?: string | null;
    avatar_seed?: string | null;
    is_admin?: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface CmsNavigationChild {
    label: string;
    href: string;
}

export interface CmsNavigationItem {
    id: number;
    label: string;
    href: string | null;
    icon: string | null;
    requiresAuth: boolean;
    isGroup: boolean;
    children: CmsNavigationChild[];
}

export interface CmsHero {
    badge: string;
    titleLine: string;
    titleAccent: string;
    ctaLabel: string;
    backgroundImage: string;
}

export interface CmsHomeConsole {
    sectionLabel: string;
    inputSample: string;
    outputSample: string;
}

export interface CmsSkill {
    label: string;
    progress: number;
}

export interface CmsStack {
    name: string;
    signal: string;
    summary: string;
    bullets: string[];
    docs: string;
    icon: string;
}

export interface CmsTicker {
    text: string;
    isHighlighted: boolean;
}

export interface CmsSocialLink {
    platform: string;
    url: string | null;
}

export interface CmsContent {
    navigation: CmsNavigationItem[];
    hero: CmsHero;
    homeConsole: CmsHomeConsole;
    skills: CmsSkill[];
    stacks: CmsStack[];
    tickers: {
        topbar: CmsTicker[];
        footer: CmsTicker[];
    };
    socialLinks: CmsSocialLink[];
    deploymentSteps: string[];
    settings: Record<string, string>;
}
