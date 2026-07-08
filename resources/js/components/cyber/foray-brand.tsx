import { Link } from '@inertiajs/react';
import { Menu, Zap } from 'lucide-react';
import GlitchText from './glitch-text';

type ForayBrandProps = {
    className?: string;
    isOpen?: boolean;
    onOpen?: () => void;
};

export default function ForayBrand({ className = '', isOpen, onOpen }: ForayBrandProps) {
    if (typeof isOpen === 'boolean') {
        return (
            <div className={`mb-5 flex h-8 items-center ${isOpen ? 'ml-3 gap-3' : 'w-12 justify-center'} ${className}`}>
                <button
                    type="button"
                    aria-label={isOpen ? 'Brand mark' : 'Open sidebar'}
                    onClick={() => {
                        if (!isOpen) {
                            onOpen?.();
                        }
                    }}
                    className={`foray-brand-mark ${isOpen ? 'cursor-default' : 'cursor-pointer hover:border-primary/60 hover:bg-primary hover:text-black hover:shadow-[0_0_16px_rgba(204,255,0,0.45)]'}`}
                >
                    {isOpen ? <Zap className="text-primary" size={18} /> : <Menu size={16} />}
                </button>

                {isOpen && <ForayBrand />}
            </div>
        );
    }

    return (
        <Link href="/" className={`foray-brand ${className}`} aria-label="Foray home">
            <GlitchText className="text-xl tracking-[0.035em]" intensity="soft">
                foray
            </GlitchText>
        </Link>
    );
}
