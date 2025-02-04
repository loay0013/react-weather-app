import React from 'react';
import { formattedToLocalTime } from '../services/weatherService';

function TimeAndLocation({ weather }) {
    console.log("Weather data received:", weather); // Debugging the received data

    const location = weather && weather.name && weather.country
        ? `${weather.name}, ${weather.country}`
        : "Location unavailable";
    const time = weather && weather.dt && weather.timezone !== undefined
        ? formattedToLocalTime(weather.dt, weather.timezone)
        : "Time unavailable";

    return (
        <div>
            <div className="flex items-center justify-center my-6">
                <p className="text-white text-xl font-extralight">
                    {time}
                </p>
            </div>
            <div className="flex items-center justify-center my-3">
                <p className="text-white text-3xl font-medium">
                    {location}
                </p>
            </div>
        </div>
    );
}

export default TimeAndLocation;
