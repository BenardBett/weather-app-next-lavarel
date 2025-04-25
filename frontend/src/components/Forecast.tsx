'use client';

import React from 'react';
import { ForecastData } from '../types/weather';

interface ForecastProps {
    forecastData: ForecastData;
    units: 'metric' | 'imperial';
}

export const Forecast: React.FC<ForecastProps> = ({ forecastData, units }) => {
    // Group forecast by day
    const dailyForecast = forecastData.list.reduce((acc: { [key: string]: any[] }, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    // Get the next 3 days
    const nextThreeDays = Object.entries(dailyForecast).slice(0, 3);

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">3-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nextThreeDays.map(([day, forecasts]) => {
                    const avgTemp = Math.round(
                        forecasts.reduce((sum, item) => sum + item.main.temp, 0) / forecasts.length
                    );
                    const weather = forecasts[0].weather[0];

                    return (
                        <div key={day} className="bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <h3 className="text-xl font-semibold text-white drop-shadow-sm">{day}</h3>
                            <div className="flex items-center justify-center my-2">
                                <img
                                    src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                    alt={weather.description}
                                    className="w-12 h-12 drop-shadow-lg"
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white drop-shadow-sm">
                                    {avgTemp}°{units === 'metric' ? 'C' : 'F'}
                                </p>
                                <p className="text-white/90 capitalize drop-shadow-sm">{weather.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 