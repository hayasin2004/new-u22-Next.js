"use server"

export async function getDirections(origin: string, destination: string, apiKey: string | undefined) {
    const baseUrl = "https://maps.googleapis.com/maps/api/directions/json";
    const url = `${baseUrl}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching directions: ${response.statusText}`);
        }
        const data = await response.json();

        // エラーが含まれている場合のチェック
        if (data.status !== "OK") {
            throw new Error(`Error from API: ${data.error_message || data.status}`);
        }

        return data; // ルート情報を返す
    } catch (error) {
        console.error("Failed to fetch directions:", error);
        return null;
    }
}