// hooks/useReactNativeData.ts
import { useState, useEffect } from 'react';

interface ReactNativeData {
    deviceName?: string;
    location?: {
        coords: {
            latitude: number;
            longitude: number;
        };
    };
    language?: string;
}

export function useReactNativeData() {
    const [data, setData] = useState<ReactNativeData | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Vérifier si les données sont déjà disponibles
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
            setData((window as any).ReactNativeWebView);
            setIsReady(true);
        }

        // Écouter l'événement de données prêtes
        const handleDataReady = () => {
            if ((window as any).ReactNativeWebView) {
                setData((window as any).ReactNativeWebView);
                setIsReady(true);
            }
        };

        window.addEventListener('ReactNativeDataReady', handleDataReady);

        return () => {
            window.removeEventListener('ReactNativeDataReady', handleDataReady);
        };
    }, []);

    return { data, isReady, isWebView: data !== null };
}