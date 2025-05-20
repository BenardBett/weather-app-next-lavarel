const API_BASE_URL = 'http://localhost:8000/api';

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

export async function getWeather(city: string, units: 'metric' | 'imperial' = 'metric') {
    try {
        console.log('Fetching weather for:', city);
        const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}&units=${units}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Weather API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        return data;
    } catch (error) {
        console.error('Weather fetch error:', error);
        throw error;
    }
}

export async function getForecast(city: string, units: 'metric' | 'imperial' = 'metric') {
    try {
        console.log('Fetching forecast for:', city);
        const response = await fetch(`${API_BASE_URL}/forecast?city=${encodeURIComponent(city)}&units=${units}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Forecast API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(errorData.message || 'Failed to fetch forecast data');
        }
        
        const data = await response.json();
        console.log('Forecast data received:', data);
        return data;
    } catch (error) {
        console.error('Forecast fetch error:', error);
        throw error;
    }
}