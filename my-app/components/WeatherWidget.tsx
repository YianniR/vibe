import React, { useEffect, useState } from 'react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    location: '',
    temperature: '',
    description: '',
    iconUrl: ''
  });

  useEffect(() => {
    const apiKey = '8e023d8710e2083e37b45f85714e1e51';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const location = data.name;
        const temperature = `${Math.round(data.main.temp)}°C`;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

        setWeather({ location, temperature, description, iconUrl });
      })
      .catch(error => console.log('Error fetching weather data:', error));
  }, []);

  return (
    <div className="weather-widget">
      <div className="weather-description">{weather.description}</div>
      <div className="weather-temperature">{weather.temperature}</div>
      <div className="weather-icon">
        <img src={weather.iconUrl} alt="Weather Icon" />
      </div>
      <div className="weather-location">{weather.location}</div>
    </div>
  );
};

export default WeatherWidget;
