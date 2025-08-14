const apiKey = 'f1d605d851194502a93150612251008';

async function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    const resultDiv = document.getElementById('result');

    if (!city) {
        resultDiv.innerHTML = "<p style='color:red;'>Please enter a city name</p>";
        return;
    }

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`
        );
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        // Display 6 key weather details
        resultDiv.innerHTML = `
                    <p><strong>Location:</strong> ${data.location.name}, ${data.location.country}</p>
                    <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
                    <p><strong>Condition:</strong> ${data.current.condition.text}</p>
                    <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
                    <p><strong>Local Time:</strong> ${data.location.localtime}</p>
                `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}