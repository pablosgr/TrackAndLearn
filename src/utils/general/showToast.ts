import { toast } from "sonner";

export function showToast(message: string, type: 'success' | 'error') {
    const colors = {
        success: {
            bg: '#A7F3D0',
            text: '#059669',
        },
        error: {
            bg: '#FCA5A5',
            text: '#B91C1C',
        },
    };

    const colorScheme = type === 'success' ? colors.success : colors.error;

    return toast(message, {
        dismissible: true,
        closeButton: true,
        duration: 2000,
        style: {
            backgroundColor: colorScheme.bg,
            color: colorScheme.text,
            borderRadius: '12px',
            border: `1px solid ${colorScheme.text}`,
            padding: '18px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontWeight: 500,
            fontSize: '16px',
        },
    });
}
