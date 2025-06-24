import { NextRequest, NextResponse } from 'next/server';

interface DirectionsRequest {
    origin: string;
    destination: string;
    travelMode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
    language?: string;
}

interface GoogleDirectionsResponse {
    routes: any[];
    status: string;
    error_message?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: DirectionsRequest = await request.json();
        const { origin, destination, travelMode, language = 'ja' } = body;

        // 入力検証
        if (!origin || !destination) {
            return NextResponse.json(
                { success: false, error: '出発地と目的地は必須です' },
                { status: 400 }
            );
        }

        // Google Maps API キーの確認
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: 'Google Maps API キーが設定されていません' },
                { status: 500 }
            );
        }

        // Google Directions API のURL構築
        const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
        const params = new URLSearchParams({
            origin: encodeURIComponent(origin),
            destination: encodeURIComponent(destination),
            mode: travelMode.toLowerCase(),
            language,
            key: apiKey,
            alternatives: 'true', // 代替ルートも取得
            units: 'metric', // メートル法を使用
        });

        console.log('Directions API リクエスト:', `${baseUrl}?${params.toString()}`);

        // Google Directions API を呼び出し
        const response = await fetch(`${baseUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Navigation-App/1.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Google API HTTPエラー: ${response.status} ${response.statusText}`);
        }

        const data: GoogleDirectionsResponse = await response.json();

        console.log('Directions API レスポンス:', data.status);

        // APIレスポンスの確認
        if (data.status !== 'OK') {
            let errorMessage = 'ルートが見つかりませんでした';

            switch (data.status) {
                case 'NOT_FOUND':
                    errorMessage = '指定された場所が見つかりませんでした。住所や場所名を確認してください。';
                    break;
                case 'ZERO_RESULTS':
                    errorMessage = '指定された場所間のルートが見つかりませんでした。移動手段を変更してみてください。';
                    break;
                case 'MAX_WAYPOINTS_EXCEEDED':
                    errorMessage = '経由地の数が上限を超えています。';
                    break;
                case 'INVALID_REQUEST':
                    errorMessage = '無効なリクエストです。入力内容を確認してください。';
                    break;
                case 'OVER_DAILY_LIMIT':
                    errorMessage = 'API使用量の日次上限に達しました。しばらく時間をおいてからお試しください。';
                    break;
                case 'OVER_QUERY_LIMIT':
                    errorMessage = 'API使用量の上限に達しました。しばらく時間をおいてからお試しください。';
                    break;
                case 'REQUEST_DENIED':
                    errorMessage = 'APIアクセスが拒否されました。API設定を確認してください。';
                    break;
                case 'UNKNOWN_ERROR':
                    errorMessage = '不明なエラーが発生しました。しばらく時間をおいてからお試しください。';
                    break;
                default:
                    errorMessage = `API エラー: ${data.status}`;
            }

            return NextResponse.json(
                {
                    success: false,
                    error: errorMessage,
                    status: data.status,
                    details: data.error_message
                },
                { status: 400 }
            );
        }

        // ルートデータの検証
        if (!data.routes || data.routes.length === 0) {
            return NextResponse.json(
                { success: false, error: 'ルートデータが見つかりませんでした' },
                { status: 404 }
            );
        }

        // レスポンスデータの整形
        const formattedRoutes = data.routes.map((route: any, index: number) => ({
            routeIndex: index,
            summary: route.summary || `ルート ${index + 1}`,
            legs: route.legs.map((leg: any) => ({
                distance: leg.distance,
                duration: leg.duration,
                startAddress: leg.start_address,
                endAddress: leg.end_address,
                steps: leg.steps.map((step: any) => ({
                    instructions: step.html_instructions,
                    distance: step.distance,
                    duration: step.duration,
                    maneuver: step.maneuver,
                    startLocation: step.start_location,
                    endLocation: step.end_location,
                })),
            })),
            overviewPolyline: route.overview_polyline,
            bounds: route.bounds,
            copyrights: route.copyrights,
            warnings: route.warnings || [],
        }));

        // 成功レスポンス
        return NextResponse.json({
            success: true,
            data: {
                routes: formattedRoutes,
                status: data.status,
                requestInfo: {
                    origin,
                    destination,
                    travelMode,
                    language,
                    timestamp: new Date().toISOString(),
                },
            },
        });

    } catch (error) {
        console.error('Directions API エラー:', error);

        // エラーの詳細をログに記録
        if (error instanceof Error) {
            console.error('エラー詳細:', {
                message: error.message,
                stack: error.stack,
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '内部サーバーエラーが発生しました',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

// GET メソッドのサポート（テスト・ドキュメント用）
export async function GET() {
    return NextResponse.json({
        message: 'Google Directions API エンドポイント',
        description: 'ルート検索のためのAPIエンドポイントです',
        usage: {
            method: 'POST',
            contentType: 'application/json',
            body: {
                origin: 'string (必須) - 出発地',
                destination: 'string (必須) - 目的地',
                travelMode: 'DRIVING | WALKING | BICYCLING | TRANSIT (必須) - 移動手段',
                language: 'string (オプション) - 言語コード (デフォルト: ja)',
            },
        },
        example: {
            origin: '東京駅',
            destination: '新宿駅',
            travelMode: 'DRIVING',
            language: 'ja',
        },
        supportedTravelModes: [
            { value: 'DRIVING', label: '車' },
            { value: 'WALKING', label: '徒歩' },
            { value: 'BICYCLING', label: '自転車' },
            { value: 'TRANSIT', label: '公共交通機関' },
        ],
        notes: [
            'Google Maps API キーが必要です',
            '環境変数 GOOGLE_MAPS_API_KEY を設定してください',
            'Directions API が有効化されている必要があります',
        ],
    });
}

// OPTIONS メソッドのサポート（CORS対応）
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}