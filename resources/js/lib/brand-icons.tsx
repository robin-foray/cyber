import { SiFacebook, SiGithub, SiInstagram, SiX } from '@icons-pack/react-simple-icons';
import { type ComponentProps, type ComponentType } from 'react';

type BrandIconProps = ComponentProps<'svg'> & {
    size?: number | string;
};

function adaptBrandIcon(Icon: typeof SiGithub): ComponentType<BrandIconProps> {
    return function BrandIcon({ size = 24, className, ...props }: BrandIconProps) {
        return <Icon size={Number(size) || 24} className={className} color="currentColor" {...props} />;
    };
}

export const Github = adaptBrandIcon(SiGithub);
export const Twitter = adaptBrandIcon(SiX);
export const Instagram = adaptBrandIcon(SiInstagram);
export const Facebook = adaptBrandIcon(SiFacebook);
