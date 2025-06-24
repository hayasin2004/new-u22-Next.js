"use client"

import React, { useState } from 'react';
import { Navigation, MapPin, Clock, Route, Car, Bike, User, Bus, AlertCircle, Loader2 } from 'lucide-react';

interface StepData {
    instructions: string;
    distance: { text: string; value: number };
    duration: { text: string; value: number };
}

interface LegData {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    startAddress: string;
    endAddress: string;
    steps: StepData[];
}

interface RouteData {
    summary: string;
    legs: LegData[];
}

interface DirectionsApiResponse {
    success: boolean;
    data?: {
        routes: RouteData[];
    };
    error?: string;
}

const SimpleNavigationApp: React.FC = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [travelMode, setTravelMode] = useState<'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT'>('DRIVING');
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const travelModeOptions = [
        { value: 'DRIVING', label: '車', icon: Car },
        { value: 'WALKING', label: '徒歩', icon: User },
        { value: 'BICYCLING', label: '自転車', icon: Bike },
        { value: 'TRANSIT', label: '公共交通機関', icon: Bus },
    ];

    const stripHtml = (html: string): string => {
        return html.replace(/<[^>]*>/g, '');
    };

    const searchRoute = async () => {
        if (!origin.trim() || !destination.trim()) {
            setError('出発地と目的地を入力してください');
            return;
        }

        setLoading(true);
        setError(null);
        setRoutes([]);

        try {
            const response = await fetch('/api/directions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: origin.trim(),
                    destination: destination.trim(),
                    travelMode,
                    language: 'ja',
                }),
            });

            const result: DirectionsApiResponse = await response.json();

            if (result.success && result.data) {
                setRoutes(result.data.routes);
            } else {
                setError(result.error || 'ルートの検索に失敗しました');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const currentRoute = routes[0];
    const currentLeg = currentRoute?.legs[0];
    const steps = currentLeg?.steps || [];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* ヘッダー */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
                    <Navigation className="h-6 w-6 text-blue-600" />
                    ナビゲーション
                </h1>

                <div className="space-y-4">
                    {/* 出発地 */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            出発地
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="出発地を入力してください"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 目的地 */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-600" />
                            目的地
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="目的地を入力してください"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 移動手段 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">移動手段</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={travelMode}
                            onChange={(e) => setTravelMode(e.target.value as any)}
                            disabled={loading}
                        >
                            {travelModeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 検索ボタン */}
                    <button
                        onClick={searchRoute}
                        disabled={loading || !origin.trim() || !destination.trim()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                検索中...
                            </>
                        ) : (
                            <>
                                <Route className="h-4 w-4" />
                                ルート検索
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* エラー表示 */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* ルート結果 */}
            {currentRoute && currentLeg && (
                <div className="space-y-6">
                    {/* ルート概要 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">ルート概要</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Route className="h-4 w-4 text-blue-600" />
                                <div>
                                    <div className="text-sm text-gray-600">距離</div>
                                    <div className="font-semibold">{currentLeg.distance.text}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-green-600" />
                                <div>
                                    <div className="text-sm text-gray-600">所要時間</div>
                                    <div className="font-semibold">{currentLeg.duration.text}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-green-600 mt-1" />
                                <div>
                                    <div className="text-sm text-gray-600">出発地</div>
                                    <div className="text-sm">{currentLeg.startAddress}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-red-600 mt-1" />
                                <div>
                                    <div className="text-sm text-gray-600">目的地</div>
                                    <div className="text-sm">{currentLeg.endAddress}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ナビゲーション案内 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">ナビゲーション案内</h2>

                        {steps.length > 0 ? (
                            <div className="space-y-3">
                                {steps.map((step, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium mb-1">
                                                    {stripHtml(step.instructions)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {step.distance.text} • {step.duration.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                ルートを検索すると、ここにナビゲーション案内が表示されます
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleNavigationApp;