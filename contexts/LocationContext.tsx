"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useReactNativeData } from "@/hooks/useReactNativeData";

interface Location {
    latitude: number;
    longitude: number;
}

interface LocationContextType {
    location: Location | null;
    setLocation: (location: Location | null) => void;
    error: string | null;
    isLoading: boolean;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

    const { data } = useReactNativeData();
    const hasRNLocation = useRef(false);

    // Vérifier la permission
    useEffect(() => {
        const checkPermission = async () => {
            if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
                try {
                    const result = await navigator.permissions.query({ name: 'geolocation' });
                    setPermissionStatus(result.state);

                    // Écouter les changements de permission
                    result.addEventListener('change', () => {
                        setPermissionStatus(result.state);
                    });
                } catch (err) {
                    console.warn("Impossible de vérifier les permissions");
                }
            }
        };

        checkPermission();
    }, []);

    useEffect(() => {
        // If we have React Native data with location, use it and stop loading
        if (data?.location?.coords) {
            hasRNLocation.current = true;
            setLocation({
                latitude: data.location.coords.latitude,
                longitude: data.location.coords.longitude,
            });
            setIsLoading(false);
            return;
        }

        // Otherwise, try browser geolocation
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur");
            setIsLoading(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Only set if we haven't received RN data in the meantime
                if (hasRNLocation.current) return;

                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setIsLoading(false);
            },
            (err) => {
                // If we have RN data, ignore errors from browser geolocation
                if (hasRNLocation.current) return;

                console.error("Geolocation error:", err);
                let errorMessage = "Impossible d'obtenir votre position";

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = "L'utilisateur a refusé la demande de géolocalisation.";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = "Les informations de localisation ne sont pas disponibles.";
                        break;
                    case err.TIMEOUT:
                        errorMessage = "La demande de localisation a expiré.";
                        break;
                    default:
                        errorMessage = "Une erreur inconnue est survenue.";
                        break;
                }

                setError(errorMessage);
                setIsLoading(false);
            },
            options
        );
    }, [data]);

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    return (
        <LocationContext.Provider value={{ location, setLocation, error, isLoading, calculateDistance }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocationContext() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error("useLocationContext must be used within a LocationProvider");
    }
    return context;
}
