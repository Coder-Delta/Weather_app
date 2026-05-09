const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const resultDiv = document.getElementById("result");
const submitButton = form.querySelector("button");

const weatherCodeMap = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Depositing rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Light freezing drizzle", icon: "🌨️" },
  57: { label: "Freezing drizzle", icon: "🌨️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "⛈️" },
  66: { label: "Light freezing rain", icon: "🌨️" },
  67: { label: "Freezing rain", icon: "🌨️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "🌨️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Rain showers", icon: "🌧️" },
  82: { label: "Violent rain showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Thunderstorm with heavy hail", icon: "⛈️" }
};

function renderMessage(title, copy, state = "default", loading = false) {
  const stateClass = state === "error" ? "error-card" : "";
  const shimmerClass = loading ? "loading-shimmer" : "";

  resultDiv.innerHTML = `
    <div class="status-card ${stateClass} ${shimmerClass}">
      <p class="status-label">${loading ? "Loading weather" : state === "error" ? "Search error" : "Weather waiting"}</p>
      <h2>${title}</h2>
      <p class="status-copy">${copy}</p>
    </div>
  `;
}

function formatLocalTime(localtime, timeZone) {
  const date = new Date(localtime);

  if (Number.isNaN(date.getTime())) {
    return localtime;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    timeZone
  }).format(date);
}

function renderWeather(data) {
  const { location, current } = data;
  const condition = weatherCodeMap[current.weatherCode] || {
    label: "Current conditions",
    icon: "🌤️"
  };
  const rainAmount = current.precipitation > 0 ? `${current.precipitation} mm` : "Low";

  resultDiv.innerHTML = `
    <article class="weather-card">
      <div>
        <p class="weather-kicker">Now in ${location.country}</p>
        <div class="weather-top">
          <div class="weather-location">
            <h2>${location.name}</h2>
            <p class="meta-line">${formatLocalTime(current.time, location.timezone)}</p>
          </div>
          <div class="weather-temp">
            <strong>${Math.round(current.temperature)}°C</strong>
            <p class="meta-line">Feels like ${Math.round(current.apparentTemperature)}°C</p>
          </div>
        </div>
      </div>

      <div class="condition-chip">
        <div class="condition-emoji" aria-hidden="true">${condition.icon}</div>
        <div>
          <p class="detail-label">Condition</p>
          <p class="detail-value">${condition.label}</p>
        </div>
      </div>

      <p class="weather-summary">
        The air is sitting at ${current.temperature}°C with ${current.humidity}% humidity and winds moving at ${current.windSpeed} kph.
      </p>

      <div class="details-grid">
        <div class="detail-tile">
          <p class="detail-label">Humidity</p>
          <p class="detail-value">${current.humidity}%</p>
        </div>
        <div class="detail-tile">
          <p class="detail-label">Wind Speed</p>
          <p class="detail-value">${current.windSpeed} kph</p>
        </div>
        <div class="detail-tile">
          <p class="detail-label">Cloud Cover</p>
          <p class="detail-value">${current.cloudCover}%</p>
        </div>
        <div class="detail-tile">
          <p class="detail-label">Precipitation</p>
          <p class="detail-value">${rainAmount}</p>
        </div>
      </div>
    </article>
  `;
}

async function getCoordinates(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error("Location lookup failed. Please try again.");
  }

  const data = await response.json();
  const place = data.results?.[0];

  if (!place) {
    throw new Error("City not found. Try a different spelling or a nearby major city.");
  }

  return {
    name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone
  };
}

async function getForecast(location) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&wind_speed_unit=kmh&timezone=${encodeURIComponent(location.timezone)}`
  );

  if (!response.ok) {
    throw new Error("Weather service is unavailable right now.");
  }

  const data = await response.json();

  return {
    location,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      windSpeed: data.current.wind_speed_10m
    }
  };
}

async function getWeather(city) {
  if (!city) {
    renderMessage("Search for a city", "Enter a city name to see the current weather.", "error");
    return;
  }

  submitButton.disabled = true;
  renderMessage("Fetching latest conditions", `Looking up the weather for ${city}...`, "default", true);

  try {
    const location = await getCoordinates(city);
    const weather = await getForecast(location);
    renderWeather(weather);
  } catch (error) {
    renderMessage("Unable to load weather", error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeather(cityInput.value.trim());
});

window.addEventListener("load", () => {
  cityInput.value = "Mumbai";
  getWeather("Mumbai");
});
