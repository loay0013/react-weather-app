import { DateTime } from "luxon";
import axios from 'axios';

const API_KEY = "fa41908c49d29f3b0991209cc304e533"; // API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = async (infoType, searchParams) => {
    const url = `${BASE_URL}/${infoType}`;
    const params = { ...searchParams, appid: API_KEY };

    try {
        performance.mark('axios-start'); // Start tidsmåling
        const response = await axios.get(url, { params });
        performance.mark('axios-end'); // Slut tidsmåling
        performance.measure('Axios API', 'axios-start', 'axios-end'); // Mål tidsforbruget
        console.log(performance.getEntriesByName('Axios API')[0].duration + " ms"); // Log tidsforbruget

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.data.message}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

const formatCurrentWeather = (data) => {
    console.log("Fetched data:", data); // Log the entire data object
    if (!data || !data.coord) {
        throw new Error("Incomplete data for current weather formatting.");
    }
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        timezone,
        wind: { speed }
    } = data;
    const { main: details, icon } = weather[0];
    return {
        name, // Make sure 'name' is correctly extracted
        lat, lon, temp, temp_max, temp_min, humidity, timezone,
        feels_like, dt, country, sunrise, sunset, speed, details, icon
    };
};

const formattedToLocalTime = (secs, zoneOffsetInSeconds, format = "cccc, dd LLL yyyy ' | Local time: 'hh:mm a") => {
    const zone = `UTC${zoneOffsetInSeconds >= 0 ? '+' : ''}${zoneOffsetInSeconds / 3600}`;
    return DateTime.fromSeconds(secs, { zone }).toFormat(format);
};

const getFormattedWeatherData = async (searchParams) => {
    try {
        const currentWeatherData = await getWeatherData('weather', searchParams);
        const formattedWeather = formatCurrentWeather(currentWeatherData);
        return formattedWeather;
    } catch (error) {
        console.error('Error processing formatted weather data:', error);
        throw error;
    }
};

export default getFormattedWeatherData;
export { formattedToLocalTime };
