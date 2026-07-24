import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type MotionValue,
    type SpringOptions,
} from 'motion/react';
import {
    Children,
    cloneElement,
    isValidElement,
    type KeyboardEvent,
    type ReactElement,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import './dock.css';

export type DockItemData = {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
    href?: string;
};

type DockProps = {
    items: DockItemData[];
    className?: string;
    spring?: SpringOptions;
    magnification?: number;
    distance?: number;
    panelHeight?: number;
    dockHeight?: number;
    baseItemSize?: number;
    orientation?: 'horizontal' | 'vertical';
};

type DockItemProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    mouseX: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    magnification: number;
    baseItemSize: number;
    label: string;
    orientation: 'horizontal' | 'vertical';
};

function DockItem({
    children,
    className = '',
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
    label,
    orientation,
}: DockItemProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, (val) => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            y: 0,
            width: baseItemSize,
            height: baseItemSize,
        };

        if (orientation === 'vertical') {
            return val - rect.y - baseItemSize / 2;
        }

        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
    }

    return (
        <motion.div
            ref={ref}
            style={{ width: size, height: size }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`dock-item ${className}`}
            tabIndex={0}
            role="button"
            aria-label={label}
            onKeyDown={handleKeyDown}
        >
            {Children.map(children, (child) => {
                if (!isValidElement(child)) {
                    return child;
                }

                return cloneElement(child as ReactElement<{ isHovered?: MotionValue<number>; orientation?: 'horizontal' | 'vertical' }>, {
                    isHovered,
                    orientation,
                });
            })}
        </motion.div>
    );
}

function DockLabel({
    children,
    className = '',
    isHovered,
    orientation = 'horizontal',
}: {
    children: ReactNode;
    className?: string;
    isHovered?: MotionValue<number>;
    orientation?: 'horizontal' | 'vertical';
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            return;
        }

        const unsubscribe = isHovered.on('change', (latest) => {
            setIsVisible(latest === 1);
        });

        return () => unsubscribe();
    }, [isHovered]);

    const enter = orientation === 'vertical' ? { opacity: 0, x: -4, y: '-50%' } : { opacity: 0, x: '-50%', y: 0 };
    const active = orientation === 'vertical' ? { opacity: 1, x: 0, y: '-50%' } : { opacity: 1, x: '-50%', y: -10 };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={enter}
                    animate={active}
                    exit={enter}
                    transition={{ duration: 0.2 }}
                    className={`dock-label ${className}`}
                    role="tooltip"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 56,
    distance = 140,
    panelHeight = 58,
    baseItemSize = 40,
    orientation = 'horizontal',
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);
    const isVertical = orientation === 'vertical';

    return (
        <div
            className={`dock-outer ${isVertical ? 'dock-outer--vertical' : ''}`}
            style={isVertical ? { width: panelHeight } : { height: panelHeight }}
        >
            <div
                onMouseMove={(event) => {
                    isHovered.set(1);
                    mouseX.set(isVertical ? event.pageY : event.pageX);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseX.set(Infinity);
                }}
                className={`dock-panel ${isVertical ? 'dock-panel--vertical' : ''} ${className}`}
                style={isVertical ? { width: panelHeight } : { height: panelHeight }}
                role="toolbar"
                aria-label="Social dock"
            >
                {items.map((item) => (
                    <DockItem
                        key={item.label}
                        onClick={item.onClick}
                        className={item.className}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                        label={item.label}
                        orientation={orientation}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel orientation={orientation}>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </div>
        </div>
    );
}
