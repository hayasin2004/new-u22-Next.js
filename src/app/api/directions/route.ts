import { NextRequest, NextResponse } from 'next/server';

interface DirectionsRequest {
    origin: string;
    destination: string;
    travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
    language?: string;
}

interface GoogleDirectionsResponse {
    status: string;
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
    }>;
    error_message?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { origin, destination, travelMode = 'DRIVING', language = 'ja' } = await request.json() as DirectionsRequest;

        if (!origin || !destination) {
            return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Google Maps API key is not configured' }, { status: 500 });
        }
        console.log("test1")

        const params = new URLSearchParams({
            origin: origin.trim(),
            destination: destination.trim(),
            mode: travelMode.toLowerCase(),
            language,
            key: apiKey,
            alternatives: 'false',
            units: 'metric',
            region: 'jp',
        });

        const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
        const response = await fetch(url, { method: 'GET' });
        console.log("test2")

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google API error response:', errorText);
            console.log("test3")
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GoogleDirectionsResponse = await response.json();
        if (data.status !== 'OK') {
            console.log("test4" + JSON.stringify(data))
            return NextResponse.json({ error: data.error_message || 'Failed to fetch directions', status: data.status }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: data.routes });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred', details: error }, { status: 500 });
    }
}