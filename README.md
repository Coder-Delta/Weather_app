# Atmos Weather

A beautiful, responsive weather app built with plain HTML, CSS, and JavaScript.

It features a polished glassmorphism-style interface, live city search, and current weather data powered by the Open-Meteo APIs.

Live demo: https://weatheruuu.netlify.app/

## Features

- Search weather by city name
- Clean, modern UI with animated background accents
- Current temperature and feels-like temperature
- Weather condition, humidity, wind speed, cloud cover, and precipitation
- Loading and error states for a smoother experience
- Mobile-friendly responsive layout

## Tech Stack

- HTML
- CSS
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API

## Project Structure

- [index.html](/home/zedx/Codes/Weather_app/index.html) contains the app layout
- [styles.css](/home/zedx/Codes/Weather_app/styles.css) contains the visual design and responsive styles
- [script.js](/home/zedx/Codes/Weather_app/script.js) handles city lookup, weather fetching, and rendering

## Run Locally

1. Clone or download the project.
2. Open the project folder.
3. Run it with any simple local server.

Example:

```bash
python3 -m http.server 3000
```

Then open `http://127.0.0.1:3000` in your browser.

## Notes

- The app uses Open-Meteo because it works well directly in the browser without the CORS issue that affected the previous API setup.
- No build step or package installation is required.

## Preview

Search for cities like `Mumbai`, `London`, `Tokyo`, or `New York` to see live weather conditions.
