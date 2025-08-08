import { useEffect, useState } from "react";

export function useCountdown(
    startTime: string,
    limitMinutes: number | null,
    onExpire?: () => void
) {
    if (!limitMinutes) return null;

    const start = new Date(startTime).getTime();
    const limitMs = limitMinutes * 60 * 1000;

    const [remaining, setRemaining] = useState(() => {
        const diff = start + limitMs - Date.now();
        return Math.max(diff, 0);
    });

    useEffect(() => {
        if (remaining <= 0) return;

        const timer = setInterval(() => {
            const diff = start + limitMs - Date.now();
            setRemaining(Math.max(diff, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [start, limitMs]);

    useEffect(() => {
        if (remaining === 0 && onExpire) {
            onExpire();
        }
    }, [remaining, onExpire]);

    return remaining;
}
