"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navigation, MapPin, Route, Car, Bike, User, Bus, AlertCircle, Loader2, Map } from "lucide-react";

const SimpleNavigationApp: React.FC = () => {
    const [origin, setOrigin] = useState(""); // 出発地
    const [destination, setDestination] = useState(""); // 目的地
    const [travelMode, setTravelMode] = useState<string>("DRIVING"); // 移動手段
    const [loading, setLoading] = useState(false); // ローディング状態
    const [error, setError] = useState<string | null>(null); // エラーメッセージ
    const mapRef = useRef<HTMLDivElement>(null); // マップの参照
    const [map, setMap] = useState<google.maps.Map | null>(null); // Google Maps インスタンス
    const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null); // DirectionsRendererの参照
    const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null); // TrafficLayerの参照

    const travelModeOptions = [
        { value: "DRIVING", label: "車", icon: Car },
        { value: "WALKING", label: "徒歩", icon: User },
        { value: "BICYCLING", label: "自転車", icon: Bike },
        { value: "TRANSIT", label: "公共交通機関", icon: Bus },
    ];

    // Google Maps APIのスクリプトを動的に読み込む
    useEffect(() => {
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
            if (!mapRef.current) return;

            const mapInstance = new google.maps.Map(mapRef.current, {
                center: { lat: 35.6895, lng: 139.6917 }, // 東京の中心座標
                zoom: 14,
            });

            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(mapInstance);

            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayerRef.current = trafficLayer;

            setMap(mapInstance);
            directionsRendererRef.current = directionsRenderer;
        };

        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            initMap();
        }
    }, []);

    // travelMode の変更を監視して TrafficLayer を追加または削除
    useEffect(() => {
        if (map && trafficLayerRef.current) {
            if (travelMode === "DRIVING") {
                trafficLayerRef.current.setMap(map); // 車の場合、TrafficLayerを表示
            } else {
                trafficLayerRef.current.setMap(null); // その他の場合、TrafficLayerを非表示
            }
        }
    }, [travelMode]);

    // ルート検索とマップ描画
    const searchRoute = async () => {
        if (!origin.trim() || !destination.trim()) {
            setError("出発地と目的地を入力してください");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!map || !directionsRendererRef.current) {
                throw new Error("マップが初期化されていません");
            }

            const directionsService = new google.maps.DirectionsService();

            const request: google.maps.DirectionsRequest = {
                origin,
                destination,
                travelMode: travelMode as google.maps.TravelMode,
            };

            directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRendererRef.current?.setDirections(result);
                } else {
                    setError("ルート案内に失敗しました: " + status);
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ヘッダー */}
            <div>
                <h1>
                    <Navigation />
                    ナビゲーション
                </h1>

                <div>
                    {/* 出発地 */}
                    <div>
                        <label>
                            <MapPin />
                            出発地
                        </label>
                        <input
                            type="text"
                            placeholder="例: 東京駅"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 目的地 */}
                    <div>
                        <label>
                            <MapPin />
                            目的地
                        </label>
                        <input
                            type="text"
                            placeholder="例: 新宿駅"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 移動手段 */}
                    <div>
                        <label>移動手段</label>
                        <select
                            value={travelMode}
                            onChange={(e) => setTravelMode(e.target.value)}
                            disabled={loading}
                        >
                            {travelModeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ルート検索ボタン */}
                    <div>
                        <button
                            onClick={searchRoute}
                            disabled={loading || !origin.trim() || !destination.trim()}
                        >
                            {loading ? "検索中..." : "ルート検索"}
                        </button>
                    </div>
                </div>
            </div>

            {/* エラー表示 */}
            {error && (
                <div>
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            )}

            {/* マップ表示 */}
            <div>
                <h2>
                    <Map />
                    マップ
                </h2>
                <div
                    ref={mapRef}
                    style={{ width: "100%", height: "400px", backgroundColor: "#f0f0f0" }}
                />
            </div>
        </div>
    );
};

export default SimpleNavigationApp;