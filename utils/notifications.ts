import { supabase } from "@/lib/supabaseClient";

// Public VAPID Key - This should be an environment variable in production
// For now, we use a placeholder or a test key if available.
// You can generate one at https://web-push-codelab.glitch.me/
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeToPushNotifications(userId: string) {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.error("Push notifications are not supported");
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.error("Notification permission denied");
            return false;
        }

        // Subscribe
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // Save to Supabase
        if (supabase) {
            const { error } = await supabase
                .from("profiles")
                .update({ subscription: subscription })
                .eq("id", userId);

            if (error) {
                console.error("Error saving subscription to Supabase:", error);
                return false;
            }
        }

        console.log("Subscribed to push notifications:", subscription);
        return true;
    } catch (error) {
        console.error("Error subscribing to push notifications:", error);
        return false;
    }
}

export async function unsubscribeFromPushNotifications(userId: string) {
    // In a real app, we would also remove the subscription from the service worker
    // and potentially from the backend.
    // For now, we just update the backend to remove the subscription.
    if (supabase) {
        const { error } = await supabase
            .from("profiles")
            .update({ subscription: null })
            .eq("id", userId);

        if (error) {
            console.error("Error removing subscription from Supabase:", error);
            return false;
        }
    }
    return true;
}
