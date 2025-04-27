const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface City {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export async function searchCities(query: string): Promise<City[]> {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch cities');
    }
    return response.json();
}

// export async function getWeather(city: string, units: 'metric' | 'imperial' = 'metric') {
//     const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}&units=${units}`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch weather data');
//     }
//     return response.json();
// }

export async function getWeather(city: string, units: 'metric' | 'imperial' = 'metric') {
    try {
        console.log('Fetching weather from:', `${API_BASE_URL}/weather`);
        const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}&units=${units}`);
        if (!response.ok) {
            console.error('Weather fetch failed:', response.status, response.statusText);
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    } catch (error) {
        console.error('Weather fetch error:', error);
        throw error;
    }
}

export async function getForecast(city: string, units: 'metric' | 'imperial' = 'metric') {
    const response = await fetch(`${API_BASE_URL}/forecast?city=${encodeURIComponent(city)}&units=${units}`);
    if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
    }
    return response.json();
} 