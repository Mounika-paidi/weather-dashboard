import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const quotes = [
  "Weather is a great metaphor for life - sometimes it's good, sometimes it's bad, and there's nothing much you can do about it but carry an umbrella.",
  "Wherever you go, no matter what the weather, always bring your own sunshine.",
  "There is no such thing as bad weather, only different kinds of good weather."
];

const lifestyleTips = {
  clear: "Perfect day for outdoor activities! Don't forget your sunglasses.",
  clouds: "A cozy day! Maybe enjoy a book with a warm drink.",
  rain: "Don't forget your umbrella! Stay dry and wear waterproof shoes.",
  snow: "Layer up! It's a great day for hot cocoa and a warm sweater.",
  thunderstorm: "Stay indoors if possible! Avoid using electrical appliances.",
};

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [textColor, setTextColor] = useState("#ffffff");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [city]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      updateBackground(response.data.weather[0].main);
      setHistory((prevHistory) =>
        prevHistory.includes(city) ? prevHistory : [...prevHistory, city]
      );
    } catch (error) {
      setError("Failed to fetch weather data. Please check the city name.");
    } finally {
      setLoading(false);
    }
  };

  const updateTextColor = (condition) => {
    let color = condition.toLowerCase() === "thunderstorm" ? "#ffffff" : "#000000";
    setTextColor(color);
  };

  const updateBackground = (condition) => {
    const backgrounds = {
      clear: "/assetss/Sunny.jpg",
      clouds: "/assetss/cloud.jpg",
      rain: "/assetss/rainy.jpg",
      snow: "/assetss/snow.jpg",
      thunderstorm: "/assetss/storm.jpg",
      default: "/assetss/default-bg.jpg",
    };

    const bgImage = backgrounds[condition.toLowerCase()] || backgrounds.default;
    
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    updateTextColor(condition);
  };

  return (
    <div className="weather-dashboard" style={{ color: textColor }}>
      <h1 className="title animate-fade-in">Weather Dashboard</h1>
      <input
        type="text"
        className="city-input"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
      />
      
      {loading ? (
        <p className="loading animate-fade-in">Fetching weather data...</p>
      ) : error ? (
        <p className="error animate-fade-in">{error}</p>
      ) : weather ? (
        <div className="weather-info animate-pop-in">
          <h2 className="weather-title">{weather.name}</h2>
          <p className="weather-temp">
            Temperature: <strong>{weather.main.temp}°C</strong> 🌡️
          </p>
          <p className="weather-desc">
            Weather: <strong>{weather.weather[0].description}</strong> 
            {weather.weather[0].main.toLowerCase() === "clear" && " ☀️"}
            {weather.weather[0].main.toLowerCase() === "clouds" && " ☁️"}
            {weather.weather[0].main.toLowerCase() === "rain" && " 🌧️"}
            {weather.weather[0].main.toLowerCase() === "snow" && " ❄️"}
            {weather.weather[0].main.toLowerCase() === "thunderstorm" && " ⛈️"}
          </p>
          <p className="lifestyle-tip">
            {lifestyleTips[weather.weather[0].main.toLowerCase()] || "Enjoy your day!"}
          </p>
        </div>
      ) : null}

      <p className="quote animate-slide-in">{quotes[quoteIndex]}</p>

      <button className="history-button" onClick={() => setShowHistory(!showHistory)}>
        History
      </button>

      {showHistory && (
        <div className="history-container animate-fade-in">
          <h3>Search History</h3>
          <ul>
            {history.map((pastCity, index) => (
              <li key={index} onClick={() => setCity(pastCity)}>
                {pastCity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;