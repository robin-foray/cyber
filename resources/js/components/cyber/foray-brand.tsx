import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import GlitchText from './glitch-text';

type ForayBrandProps = {
    className?: string;
    isOpen?: boolean;
    onOpen?: () => void;
};

export default function ForayBrand({ className = '', isOpen, onOpen }: ForayBrandProps) {
    if (typeof isOpen === 'boolean') {
        return (
            <div className={`mb-2 flex h-8 items-center ${isOpen ? 'ml-1.5 gap-2' : 'w-10 justify-center'} ${className}`}>
                <button
                    type="button"
                    aria-label={isOpen ? 'Foray brand' : 'Open sidebar'}
                    onClick={() => {
                        if (!isOpen) {
                            onOpen?.();
                        }
                    }}
                    className={`foray-brand-mark ${isOpen ? 'cursor-default' : 'cursor-pointer hover:border-primary/60 hover:bg-primary hover:text-black hover:shadow-[0_0_16px_rgba(204,255,0,0.45)]'}`}
                >
                    {isOpen ? <AppLogoIcon className="size-[18px] text-primary" /> : <Menu size={16} />}
                </button>

                {isOpen && <ForayBrand />}
            </div>
        );
    }

    return (
        <Link href="/" className={`foray-brand ${className}`} aria-label="Foray home">
            <GlitchText className="text-lg tracking-[0.035em]" intensity="soft">
                foray
            </GlitchText>
        </Link>
    );
}
