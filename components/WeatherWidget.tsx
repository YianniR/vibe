import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const WeatherWidget: React.FC = () => {
  const weatherLocation = useSelector((state: any) => state.settings.weatherLocation);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '8e023d8710e2083e37b45f85714e1e51';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeatherData({
          location: data.name,
          temperature: `${Math.round(data.main.temp)}°C`,
          description: data.weather[0].description,
          iconUrl: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        });
        setLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [weatherLocation]);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="weather-widget">
      <div className="weather-description">{weatherData.description}</div>
      <div className="weather-temperature">{weatherData.temperature}</div>
      <div className="weather-icon"><img src={weatherData.iconUrl} alt="Weather Icon" /></div>
      <div className="weather-location">{weatherData.location}</div>
    </div>
  );
};

export default WeatherWidget;
