"use client";

import { useEffect, useState } from "react";

export default function NavigationPage() {
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        // Google Maps APIのスクリプトを動的に読み込む
        const loadGoogleMapsScript = () => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => {
                initMap();
            };
            document.head.appendChild(script);
        };

        const initMap = () => {
            const mapElement = document.getElementById("map") as HTMLElement;

            const mapInstance = new google.maps.Map(mapElement, {
                center: { lat: 35.6895, lng: 139.6917 }, // 東京の中心座標
                zoom: 14,
            });

            setMap(mapInstance);
        };

        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initMap();
        }
    }, []);

    const startNavigation = () => {
        if (!map) return;

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        directionsRenderer.setMap(map);

        const request = {
            origin: "Shinjuku Station, Tokyo", // 出発地
            destination: "Tokyo Tower, Tokyo", // 目的地
            travelMode: google.maps.TravelMode.DRIVING, // 移動手段
        };

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
            } else {
                console.error("ルート案内に失敗しました: ", status);
            }
        });
    };

    return (
        <div>
            <h1>ルート案内</h1>
            <div
                id="map"
                style={{ width: "100%", height: "500px", marginBottom: "20px" }}
            ></div>
            <button onClick={startNavigation}>ナビゲーションを開始</button>
        </div>
    );
}