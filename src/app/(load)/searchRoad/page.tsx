"use client";
import { useState} from "react";
import {GoogleMap, Polyline, useLoadScript} from "@react-google-maps/api";
import {getDirections} from "@/acitons/getDirections/getDirections";

type LatLng = {
    lat: number;
    lng: number;
};


type RouteLeg = {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_location: LatLng;
    end_location: LatLng;
};

type Route = {
    legs: RouteLeg[];
    overview_polyline: { points: string };
};

const SearchRoad= () => {
    const [route, setRoute] = useState<Route | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [startPosition, setStartPosition] = useState<string | null>(null);
    const [goalPosition, setGoalPosition] = useState<string | null>(null);

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const fetchRoute = async () => {
        const origin = startPosition
        const destination = goalPosition

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        try {
            const data = await getDirections(origin, destination, apiKey);
            if (data && data.routes.length > 0) {
                setRoute(data.routes[0]);
            } else {
                setError("No routes found.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch route information.");
        }
    };

    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div>
            <h1>Route Information</h1>
            {error && <p style={{color: "red"}}>{error}</p>}
            {route ? (
                <div>
                    <h2>Route Overview</h2>
                    <p>
                        <strong>Distance:</strong> {route.legs[0].distance.text}
                    </p>
                    <p>
                        <strong>Duration:</strong> {route.legs[0].duration.text}
                    </p>
                    <GoogleMap
                        mapContainerStyle={{width: "100%", height: "400px"}}
                        center={{
                            lat: route.legs[0].start_location.lat,
                            lng: route.legs[0].start_location.lng,
                        }}
                        zoom={10}
                    >
                        <Polyline
                            path={decodePolyline(route.overview_polyline.points)}
                            options={{
                                strokeColor: "#Fecc00",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            }}
                        />
                    </GoogleMap>
                </div>
            ) : (
                <p>Loading route information...</p>
            )}
            <label htmlFor="start">
                スタート位置
                <input type="text" name={"start"} onChange={(e) => setStartPosition(e.target.value)}/>
            </label>
            <label htmlFor="goal">
                ゴール位置
                <input type="text" name={"goal"} onChange={(e) => setGoalPosition(e.target.value)}/>
            </label>

            <button onClick={fetchRoute}>
                送信
            </button>
        </div>
    );
}

// ポリラインをデコードする関数
function decodePolyline(encoded: string) {
    const points = [];
    let index = 0;
        const    len = encoded.length;
    let lat = 0,
        lng = 0;

    while (index < len) {
        let b, shift = 0,
            result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = result & 1 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = result & 1 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        points.push({lat: lat / 1e5, lng: lng / 1e5});
    }

    return points;
}

export default SearchRoad