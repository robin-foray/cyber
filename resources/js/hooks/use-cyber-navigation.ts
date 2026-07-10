import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const skeletonDelayMs = 100;

function isFullPageVisit(visit: { only?: string[]; showProgress?: boolean }) {
    const isPartialReload = Array.isArray(visit.only) && visit.only.length > 0;

    return !isPartialReload && visit.showProgress !== false;
}

export function useCyberNavigation() {
    const [showSkeleton, setShowSkeleton] = useState(false);
    const skeletonTimerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        const clearSkeletonTimer = () => {
            if (skeletonTimerRef.current) {
                clearTimeout(skeletonTimerRef.current);
                skeletonTimerRef.current = undefined;
            }
        };

        const removeStart = router.on('start', (event) => {
            if (!isFullPageVisit(event.detail.visit)) {
                return;
            }

            clearSkeletonTimer();
            skeletonTimerRef.current = setTimeout(() => setShowSkeleton(true), skeletonDelayMs);
        });

        const finishNavigation = () => {
            clearSkeletonTimer();
            setShowSkeleton(false);
        };

        const removeFinish = router.on('finish', finishNavigation);
        const removeCancel = router.on('cancel', finishNavigation);

        return () => {
            clearSkeletonTimer();
            removeStart();
            removeFinish();
            removeCancel();
        };
    }, []);

    return showSkeleton;
}
