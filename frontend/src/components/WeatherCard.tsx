'use client';

import React from 'react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
    weatherData: WeatherData;
    units: 'metric' | 'imperial';
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, units }) => {
    const { weather, main, wind, name, dt } = weatherData;
    const currentWeather = weather[0];

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getWindDirection = (degrees: number) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    };

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-2xl p-6 max-w-sm mx-auto border border-white/10">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">{name}</h2>
                <p className="text-white/90 drop-shadow-sm">{formatDate(dt)}</p>
                <div className="flex items-center justify-center mt-4">
                    <img
                        src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                        alt={currentWeather.description}
                        className="w-16 h-16 drop-shadow-lg"
                    />
                    <div className="ml-4">
                        <p className="text-4xl font-bold text-white drop-shadow-lg">
                            {Math.round(main.temp)}°{units === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className="text-white/90 capitalize drop-shadow-sm">{currentWeather.description}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-white/90">Feels Like</p>
                    <p className="text-xl font-semibold text-white drop-shadow-sm">
                        {Math.round(main.feels_like)}°{units === 'metric' ? 'C' : 'F'}
                    </p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-white/90">Humidity</p>
                    <p className="text-xl font-semibold text-white drop-shadow-sm">{main.humidity}%</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-white/90">Wind</p>
                    <p className="text-xl font-semibold text-white drop-shadow-sm">
                        {wind.speed} {units === 'metric' ? 'm/s' : 'mph'} {getWindDirection(wind.deg)}
                    </p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-white/90">Pressure</p>
                    <p className="text-xl font-semibold text-white drop-shadow-sm">{main.pressure} hPa</p>
                </div>
            </div>
        </div>
    );
}; 