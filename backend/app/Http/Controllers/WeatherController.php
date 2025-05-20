<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    /**
     * Search for cities using OpenWeatherMap Geocoding API
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchCities(Request $request)
    {
        $query = $request->query('q');
        $apiKey = env('OPENWEATHER_API_KEY');
        
        try {
            $response = Http::get("http://api.openweathermap.org/geo/1.0/direct", [
                'q' => $query,
                'limit' => 5,
                'appid' => $apiKey
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Failed to fetch cities',
                'message' => $response->json()['message'] ?? 'Unknown error'
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get weather data for a specific city
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    // public function getWeather(Request $request)
    // {
    //     $city = $request->query('city', 'London');
    //     $units = $request->query('units', 'metric');
    //     $apiKey = env('OPENWEATHER_API_KEY');
        
    //     try {
    //         $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
    //             'q' => $city,
    //             'appid' => $apiKey,
    //             'units' => $units
    //         ]);

    //         if ($response->successful()) {
    //             return response()->json($response->json());
    //         }

    //         return response()->json([
    //             'error' => 'Failed to fetch weather data',
    //             'message' => $response->json()['message'] ?? 'Unknown error'
    //         ], $response->status());

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => 'Server error',
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }



    public function getWeather(Request $request)
{
    try {
        $city = $request->query('city', 'London');
        $units = $request->query('units', 'metric');
        $apiKey = env('OPENWEATHER_API_KEY');
        
        if (!$apiKey) {
            return response()->json([
                'error' => 'API key not configured',
                'message' => 'OpenWeather API key is missing'
            ], 500);
        }

        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $city,
            'appid' => $apiKey,
            'units' => $units
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        \Log::error('Weather API Error', [
            'status' => $response->status(),
            'response' => $response->json()
        ]);

        return response()->json([
            'error' => 'Failed to fetch weather data',
            'message' => $response->json()['message'] ?? 'Unknown error'
        ], $response->status());

    } catch (\Exception $e) {
        \Log::error('Weather API Exception', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}
    /**
     * Get forecast data for a specific city
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForecast(Request $request)
    {
        $city = $request->query('city', 'London');
        $units = $request->query('units', 'metric');
        $apiKey = env('OPENWEATHER_API_KEY');
        
        try {
            $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
                'q' => $city,
                'appid' => $apiKey,
                'units' => $units
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Failed to fetch forecast data',
                'message' => $response->json()['message'] ?? 'Unknown error'
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 