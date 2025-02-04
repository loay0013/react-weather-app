import React from "react";
import { UilArrowUp, UilArrowDown, UilTemperatureEmpty, UilTear, UilWind, UilSun, UilSunset } from '@iconscout/react-unicons';
import {formattedToLocalTime}    from '../services/weatherService'
function TemperatureAndDetails({ weather }) {
    const {
        details = "No data",
        icon,
        temp = 0,
        temp_min = 0,
        temp_max = 0,
        sunrise,
        sunset,
        speed = 0,
        humidity = 0,
        feels_like = 0,
        timezone = 0
    } = weather || {};


    const formattedSunrise = (typeof sunrise === 'number') ? formattedToLocalTime(sunrise, timezone, 'hh:mm a') : "No data";
    const formattedSunset = (typeof sunset === 'number') ? formattedToLocalTime(sunset, timezone, 'hh:mm a') : "No data";

    return (
        <div>
            <div className="flex items-center justify-center py-5 text-3xl text-cyan-500">
                <p>{details}</p>
            </div>
            <div className="flex flex-row items-center justify-between text-white py-3">
                <img src={icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : "/default-icon.png"} alt="Weather Icon" className="w-20"/>
                <p className="text-5xl">{ `${temp.toFixed()}°`}</p>

                <div className="flex flex-col space-y-2">
                    <div className="flex font-light text-sm items-center justify-center">
                        <UilTemperatureEmpty size={18} className="mr-1" />
                        Real Feel:
                        <span className="font-medium ml-1">{`${feels_like.toFixed()}°`}</span>
                    </div>
                    <div className="flex font-light text-sm items-center justify-center">
                        <UilTear size={18} className="mr-1" />
                        Humidity:
                        <span className="font-medium ml-1">{`${humidity}%`}</span>
                    </div>
                    <div className="flex font-light text-sm items-center justify-center">
                        <UilWind size={18} className="mr-1" />
                        Wind:
                        <span className="font-medium ml-1">{`${speed } km/h`}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center justify-center space-x-4 text-white text-sm py-3">
                <UilSun size={40} />
                <p className="font-light">
                    Sunrise: <span className="font-medium ml-1">{formattedSunrise}</span>
                </p>
                <p className="font-light">|</p>

                <UilSunset size={40} />
                <p className="font-light">
                    Sunset: <span className="font-medium ml-1">{formattedSunset}</span>
                </p>
                <p className="font-light">|</p>

                <UilSun size={40} />
                <p className="font-light">
                    High: <span className="font-medium ml-1">{`${temp_max}°`}</span>
                </p>
                <p className="font-light">|</p>

                <UilSun size={40} />
                <p className="font-light">
                    Low: <span className="font-medium ml-1">{`${temp_min}°`}</span>
                </p>
            </div>
        </div>
    );
}
export default TemperatureAndDetails;


import React, { useState } from 'react';
import useApi from '../hooks/useapi';
import Navigation from '../components/navigation';

const GraphicsSelection = ({ step, setStep, selectedLevel, setSelectedProcessor }) => {
    const { loading, data, error } = useApi();
    const [selectedOption, setSelectedOption] = useState('');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Filtrer grafikkort baseret på det valgte niveau
    let hardware = Array.isArray(data?.grafik) ? data.grafik : [];
    if (selectedLevel) {
        hardware = hardware.filter((grafik) => {
            const requirements = grafik.meta.requirements ? grafik.meta.requirements.trim().toLowerCase() : '';
            const level = selectedLevel.trim().toLowerCase();
            return requirements === level;
        });
    }

    // Når et grafikkort vælges
    const handleGraphicsSelect = (grafik) => {
        setSelectedOption(grafik.id);

        // Find processor baseret på både requirements og class_requirements fra det valgte grafikkort
        const requirements = grafik.meta.requirements.trim().toLowerCase();
        const classRequirements = grafik.meta.class_requirements;
        selectProcessorAutomatically(requirements, classRequirements);
    };

    // Funktion til at finde processor med både samme requirements og class_requirements som det valgte grafikkort
    const selectProcessorAutomatically = (requirements, classRequirements) => {
        const { data: processorData } = useApi(); // Hent processor data
        let processors = Array.isArray(processorData?.processors) ? processorData.processors : [];

        // Filtrér processorer baseret på `requirements` OG `class_requirements`
        const matchingProcessors = processors.filter((processor) => {
            const processorRequirements = processor.meta.requirements ? processor.meta.requirements.trim().toLowerCase() : '';
            const processorClassRequirements = processor.meta.class_requirements;

            return processorRequirements === requirements && processorClassRequirements === classRequirements;
        });

        // Vælg den første processor som standard, eller tilføj mere logik hvis nødvendigt
        if (matchingProcessors.length > 0) {
            setSelectedProcessor(matchingProcessors[0]);
            console.log("Automatisk Valgt Processor:", matchingProcessors[0].title);
        } else {
            console.log("Ingen matchende processor fundet");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2>Trin 2 - Grafisk Udseende</h2>
            <p className="mb-4">
                Vælg det grafikkort, der passer til dine behov. Vi viser alle tilgængelige grafikkort baseret på det valgte spilniveau.
            </p>

            <div className="row justify-content-center">
                {hardware.map((grafik) => (
                    <div key={grafik.id} className="col-md-4 mb-4">
                        <div
                            className={`card ${selectedOption === grafik.id ? 'selected' : ''}`}
                            onClick={() => handleGraphicsSelect(grafik)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={grafik.meta.hardware_img}
                                className="card-img-top"
                                alt={grafik.title}
                                style={{ height: '200px', objectFit: 'contain' }}
                            />
                            <div className="card-body" style={{ backgroundColor: '#6c5ce7', color: 'white' }}>
                                <h5 className="card-title">{grafik.title}</h5>
                                <p className="card-text">{grafik.meta.description}</p>
                                <div className="badge bg-primary me-2">
                                    Klasse Krav: {grafik.meta.class_requirements}
                                </div>
                                {selectedOption === grafik.id && (
                                    <div className="selected-overlay">
                                        <i className="bi bi-check-circle-fill"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Navigation
                step={step}
                setStep={setStep}
                canProceed={selectedOption !== ''}
            />
        </div>
    );
};

export default GraphicsSelection;
