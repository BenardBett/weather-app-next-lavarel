'use client';

import { useState, useEffect, useRef } from 'react';
import { WeatherCard } from '../components/WeatherCard';
import { Forecast } from '../components/Forecast';
import { getWeather, getForecast, searchCities, City } from '../lib/api';
import { WeatherData, ForecastData } from '../types/weather';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}: {error: Error}) {
    return (
        <div className="bg-red-100/90 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 backdrop-blur-sm">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
        </div>
    );
}



export default function Home() {
    const [city, setCity] = useState('London');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // const searchTimeout = useRef<NodeJS.Timeout>();
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCitySearch = async (value: string) => {
        setCity(value);
        if (value.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(async () => {
            try {
                const results = await searchCities(value);
                setSuggestions(results);
                setShowSuggestions(true);
            } catch (err) {
                console.error('Failed to fetch city suggestions:', err);
            }
        }, 300);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowSuggestions(false);

        try {
            const [weather, forecast] = await Promise.all([
                getWeather(city, units),
                getForecast(city, units)
            ]);
            setWeatherData(weather);
            setForecastData(forecast);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (selectedCity: City) => {
        setCity(`${selectedCity.name}, ${selectedCity.country}`);
        setShowSuggestions(false);
    };

    const toggleUnits = () => {
        setUnits(units === 'metric' ? 'imperial' : 'metric');
    };

    // Get background class based on weather condition
    const getBackgroundClass = () => {
        if (!weatherData) return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';
        
        const weatherMain = weatherData.weather[0].main.toLowerCase();
        const temp = weatherData.main.temp;
        
        switch (weatherMain) {
            case 'clear':
                if (temp > 25) {
                    return 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600';
                } else if (temp > 15) {
                    return 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600';
                } else {
                    return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600';
                }
            case 'clouds':
                return 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800';
            case 'rain':
                return 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900';
            case 'snow':
                return 'bg-gradient-to-br from-sky-200 via-blue-300 to-indigo-400';
            case 'thunderstorm':
                return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
            default:
                return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';
        }
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className={`min-h-screen ${getBackgroundClass()} transition-all duration-500 py-8 px-4`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                        Weather Forecast
                    </h1>
                    <button
                        onClick={toggleUnits}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-colors duration-200"
                    >
                        °{units === 'metric' ? 'C' : 'F'}
                    </button>
                </div>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative flex gap-4 max-w-md mx-auto">
                        <div className="flex-1 relative" ref={suggestionsRef}>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => handleCitySearch(e.target.value)}
                                placeholder="Enter city name"
                                className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
                                    {suggestions.map((suggestion) => (
                                        <div
                                            key={`${suggestion.lat}-${suggestion.lon}`}
                                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion.name}, {suggestion.country}
                                            {suggestion.state && `, ${suggestion.state}`}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Search'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-100/90 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {weatherData && <WeatherCard weatherData={weatherData} units={units} />}
                {forecastData && <Forecast forecastData={forecastData} units={units} />}
            </div>
        </main>
        </ErrorBoundary>
    );
}
