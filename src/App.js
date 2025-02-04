import React, { useEffect, useState } from 'react';
import './App.css';
import TopButton from "./components/TopButton";
import Inputs from "./components/inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import getFormattedWeatherData from "./services/weatherService";

function App() {
    const [query, setQuery] = useState({ q: 'Berlin' });
    const [units, setUnits] = useState('metric');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null); // Reset errors before fetching new data
            try {
                const data = await getFormattedWeatherData({ ...query, units });
                setWeather(data);
            } catch (error) {
                setError('Failed to fetch weather data');
                console.error(error);
            }
        };

        fetchData();

        // Optional: Cleanup function if needed
        return () => {
            // Cleanup tasks if necessary
        };
    }, [query, units]);

    return (
        <div className="mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-2xl shadow-gray-400">
            <TopButton setQuery={setQuery} />
            <Inputs setQuery={setQuery} setUnits={setUnits} />

            {error ? <div>Error: {error}</div> : (
                <>
                    <TimeAndLocation weather={weather} />
                    <TemperatureAndDetails weather={weather} />
                </>
            )}
        </div>
    );
}

export default App;
