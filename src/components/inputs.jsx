import React, { useState } from 'react';
import { UilSearch, UilLocationPoint } from '@iconscout/react-unicons';

function Inputs({ setQuery, setUnits }) {
    const [input, setInput] = useState("");

    const handleSearchClick = () => {
        if (input) setQuery({ q: input });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleLocationClick = () => {
        // Optionally, you could use the Geolocation API to get the user's current location
        navigator.geolocation.getCurrentPosition((position) => {
            setQuery({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
        });
    };

    const handleUnitChange = (unit) => {
        setUnits(unit);
    };

    return <div className="flex flex-row justify-center my-6">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input
                type="text"
                placeholder="Search for city..."
                className="text-xl font-light p-2 w-full shadow-2xl focus:outline-none capitalize"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <UilSearch size={25} className="text-white cursor-pointer transition ease-out hover:scale-125" onClick={handleSearchClick} />
            <UilLocationPoint size={25} className="text-white cursor-pointer transition ease-out hover:scale-125" onClick={handleLocationClick} />
        </div>
        <div className="flex flex-row w-1/4 items-center justify-center">
            <button className="text-xl font-light text-white" onClick={() => handleUnitChange('metric')}>°C</button>
            <p className="text-white text-xl mx-1">|</p>
            <button className="text-xl font-light text-white" onClick={() => handleUnitChange('imperial')}>°F</button>
        </div>
    </div>;
}

export default Inputs;
