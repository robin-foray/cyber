import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function isFullPageVisit(visit: { only?: string[]; showProgress?: boolean }) {
    const isPartialReload = Array.isArray(visit.only) && visit.only.length > 0;

    return !isPartialReload && visit.showProgress !== false;
}

export function useCyberNavigation() {
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (isFullPageVisit(event.detail.visit)) {
                setIsNavigating(true);
            }
        });

        const removeFinish = router.on('finish', () => {
            setIsNavigating(false);
        });

        const removeCancel = router.on('cancel', () => {
            setIsNavigating(false);
        });

        return () => {
            removeStart();
            removeFinish();
            removeCancel();
        };
    }, []);

    return isNavigating;
}
