// app/api/directions/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface DirectionsRequest {
    origin: string;
    destination: string;
    travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
    language?: string;
}

interface GoogleDirectionsResponse {
    routes: Array<{
        legs: Array<{
            distance: { text: string; value: number };
            duration: { text: string; value: number };
            start_location: { lat: number; lng: number };
            end_location: { lat: number; lng: number };
            steps: Array<{
                distance: { text: string; value: number };
                duration: { text: string; value: number };
                start_location: { lat: number; lng: number };
                end_location: { lat: number; lng: number };
                html_instructions: string;
                maneuver?: string;
                polyline: { points: string };
            }>;
        }>;
        overview_polyline: { points: string };
        summary: string;
        warnings: string[];
        waypoint_order: number[];
    }>;
    status: string;
    error_message?: string;
}

export async function POST(request: NextRequest) {
    console.log('POST /api/directions called');

    try {
        const body: DirectionsRequest = await request.json();
        console.log('Request body:', body);

        const { origin, destination, travelMode = 'DRIVING', language = 'ja' } = body;

        // 入力値の検証
        if (!origin || !destination) {
            console.log('Missing origin or destination');
            return NextResponse.json(
                { error: 'Origin and destination are required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        console.log('API Key exists:', !!apiKey);

        if (!apiKey) {
            console.log('Missing Google Maps API key');
            return NextResponse.json(
                { error: 'Google Maps API key is not configured' },
                { status: 500 }
            );
        }

        // Google Directions API のURL構築
        const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
        const params = new URLSearchParams({
            origin: origin,
            destination: destination,
            mode: travelMode.toLowerCase(),
            language: language,
            key: apiKey,
            alternatives: 'false',
            units: 'metric',
        });

        const url = `${baseUrl}?${params.toString()}`;
        console.log('Calling Google API:', url.replace(apiKey, 'HIDDEN'));

        // Google Directions API を呼び出し
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Google API response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GoogleDirectionsResponse = await response.json();
        console.log('Google API response status:', data.status);

        // APIレスポンスのステータスチェック
        if (data.status !== 'OK') {
            let errorMessage = 'Unknown error occurred';

            switch (data.status) {
                case 'NOT_FOUND':
                    errorMessage = '指定された場所が見つかりませんでした';
                    break;
                case 'ZERO_RESULTS':
                    errorMessage = '指定された場所間のルートが見つかりませんでした';
                    break;
                case 'MAX_WAYPOINTS_EXCEEDED':
                    errorMessage = '経由地の数が上限を超えています';
                    break;
                case 'INVALID_REQUEST':
                    errorMessage = 'リクエストが無効です';
                    break;
                case 'OVER_DAILY_LIMIT':
                    errorMessage = '1日の利用制限を超えました';
                    break;
                case 'OVER_QUERY_LIMIT':
                    errorMessage = 'クエリ制限を超えました';
                    break;
                case 'REQUEST_DENIED':
                    errorMessage = 'リクエストが拒否されました';
                    break;
                case 'UNKNOWN_ERROR':
                    errorMessage = 'サーバーエラーが発生しました';
                    break;
                default:
                    errorMessage = data.error_message || errorMessage;
            }

            console.log('Google API error:', errorMessage);
            return NextResponse.json(
                { error: errorMessage, status: data.status },
                { status: 400 }
            );
        }

        console.log('Success: returning route data');
        // 成功レスポンスを返す
        return NextResponse.json({
            success: true,
            data: {
                routes: data.routes,
                status: data.status,
            },
        });

    } catch (error) {
        console.error('Directions API Error:', error);

        return NextResponse.json(
            {
                error: 'ルート情報の取得に失敗しました',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// GET メソッドも対応（テスト用）
export async function GET(request: NextRequest) {
    console.log('GET /api/directions called');

    try {
        const { searchParams } = new URL(request.url);
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const travelMode = searchParams.get('travelMode') as DirectionsRequest['travelMode'] || 'DRIVING';
        const language = searchParams.get('language') || 'ja';

        console.log('GET params:', { origin, destination, travelMode, language });

        if (!origin || !destination) {
            return NextResponse.json(
                { error: 'Origin and destination are required' },
                { status: 400 }
            );
        }

        // POST メソッドと同じロジックを実行
        const body: DirectionsRequest = {
            origin,
            destination,
            travelMode,
            language,
        };

        // POST メソッドの処理を再利用するため、リクエストを模擬
        const mockRequest = {
            json: async () => body,
        } as NextRequest;

        return POST(mockRequest);

    } catch (error) {
        console.error('Directions API GET Error:', error);

        return NextResponse.json(
            {
                error: 'ルート情報の取得に失敗しました',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}