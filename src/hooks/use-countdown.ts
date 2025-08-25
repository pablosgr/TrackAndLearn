import { useEffect, useState } from "react";

export function useCountdown(
    startTime: string,
    limitMinutes: number | null,
    onExpire?: () => void
) {
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        if (!limitMinutes) return;

        const start = new Date(startTime).getTime();
        const limitMs = limitMinutes * 60 * 1000;

        const initialRemaining = Math.max(start + limitMs - Date.now(), 0);
        setRemaining(initialRemaining);

        if (initialRemaining <= 0) {
            if (onExpire) onExpire();
            return;
        }

        const timer = setInterval(() => {
            const diff = start + limitMs - Date.now();
            const newRemaining = Math.max(diff, 0);
            setRemaining(newRemaining);

            if (newRemaining === 0) {
                clearInterval(timer);
                if (onExpire) onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime, limitMinutes, onExpire]);

    return remaining;
}
