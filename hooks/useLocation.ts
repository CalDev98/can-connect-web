"use client";

import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
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
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
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
  }, []);

  useEffect(() => {
    if (location) {
      console.log("location", location);
    }
  }, [location]);

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

  return {
    location,
    error,
    isLoading,
    calculateDistance,
  };
}

