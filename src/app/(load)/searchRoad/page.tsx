'use client';
import React, { useState } from 'react';
import { GoogleMap, Polyline, Marker, useLoadScript } from "@react-google-maps/api";
import { Navigation, MapPin, Clock, Route as RouteIcon, Car, User, Bike, Train } from 'lucide-react';

type LatLng = { lat: number; lng: number };
type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

const SearchRoad = () => {
    const [route, setRoute] = useState<any>(null);
    const [startPosition, setStartPosition] = useState<string>('東京駅');
    const [goalPosition, setGoalPosition] = useState<string>('新宿駅');
    const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING');
    const [loading, setLoading] = useState(false);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" });

    const fetchRoute = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/directions/', { // 修正済み
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origin: startPosition, destination: goalPosition, travelMode }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setRoute(data.data[0]);
            } else {
                console.error('API Error:', data.error);
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Failed to fetch route:', error);
            alert(`ルートの取得に失敗しました: ${error}`);
        } finally {
            setLoading(false);
        }
    };
    const decodePolyline = (encoded: string) => {
        const points = [];
        let index = 0, lat = 0, lng = 0;
        while (index < encoded.length) {
            let result = 0, shift = 0, b;
            do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            lat += result & 1 ? ~(result >> 1) : result >> 1;
            result = shift = 0;
            do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            lng += result & 1 ? ~(result >> 1) : result >> 1;
            points.push({ lat: lat / 1e5, lng: lng / 1e5 });
        }
        return points;
    };

    if (!isLoaded) return <p>マップを読み込み中...</p>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <RouteIcon className="w-6 h-6" /> ルート検索
            </h1>
            <div className="grid grid-cols-2 gap-4">
                <input value={startPosition} onChange={(e) => setStartPosition(e.target.value)} placeholder="出発地" className="p-2 border rounded" />
                <input value={goalPosition} onChange={(e) => setGoalPosition(e.target.value)} placeholder="目的地" className="p-2 border rounded" />
            </div>
            <div className="flex gap-2 my-4">
                {['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'].map(mode => (
                    <button key={mode} onClick={() => setTravelMode(mode as TravelMode)} className={`p-2 border rounded ${travelMode === mode ? 'bg-blue-500 text-white' : ''}`}>
                        {mode}
                    </button>
                ))}
            </div>
            <button onClick={fetchRoute} disabled={loading} className="bg-blue-500 text-white p-2 rounded">
                {loading ? '検索中...' : 'ルート検索'}
            </button>
            {route && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">ルート詳細</h2>
                    <p>距離: {route.legs[0].distance.text}</p>
                    <p>時間: {route.legs[0].duration.text}</p>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={route.legs[0].start_location}
                        zoom={13}
                    >
                        <Polyline path={decodePolyline(route.overview_polyline.points)} options={{ strokeColor: '#0000FF' }} />
                        <Marker position={route.legs[0].start_location} />
                        <Marker position={route.legs[0].end_location} />
                    </GoogleMap>
                </div>
            )}
        </div>
    );
};

export default SearchRoad;