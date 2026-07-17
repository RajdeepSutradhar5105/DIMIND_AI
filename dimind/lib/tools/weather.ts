const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(city?: string): Promise<string> {
  if (!city) return "Weather error: missing city";

  try {
    const geoRes = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`
    );
    if (!geoRes.ok) throw new Error(`geocoding request failed (${geoRes.status})`);
    const geoData = await geoRes.json();
    const results = geoData?.results;
    if (!results || results.length === 0) return "City not found";

    const location = results[0];
    const { latitude, longitude, name: cityName, country = "" } = location;

    const weatherRes = await fetch(
      `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    if (!weatherRes.ok) throw new Error(`forecast request failed (${weatherRes.status})`);
    const weatherData = await weatherRes.json();
    const current = weatherData?.current_weather ?? {};

    const temperature = current.temperature ?? "N/A";
    const windSpeed = current.windspeed ?? "N/A";
    const weatherCode = current.weathercode ?? "N/A";

    return `Current weather in ${cityName}, ${country}: Temperature: ${temperature}°C, Wind Speed: ${windSpeed} m/s, Weather Code: ${weatherCode}`;
  } catch (e: any) {
    return `Weather error: ${e?.message ?? e}`;
  }
}
