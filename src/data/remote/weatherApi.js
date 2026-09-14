const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function requestWeather(path, lat, lon, apiKey, signal) {
  if (!apiKey) {
    throw new Error("OpenWeather API 키가 없습니다.");
  }

  const query = [
    `lat=${encodeURIComponent(lat)}`,
    `lon=${encodeURIComponent(lon)}`,
    `appid=${encodeURIComponent(apiKey)}`,
    "units=metric",
    "lang=en",
  ].join("&");

  const response = await fetch(`${BASE_URL}/${path}?${query}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`날씨 데이터를 가져오지 못했습니다. (${response.status})`);
  }

  return await response.json();
}

export async function getCurrentWeatherData(lat, lon, apiKey, signal) {
  return await requestWeather("weather", lat, lon, apiKey, signal);
}

export async function getForecastWeatherData(lat, lon, apiKey, signal) {
  return await requestWeather("forecast", lat, lon, apiKey, signal);
}

export async function getAllWeatherData(lat, lon, apiKey, signal) {
  const [current, forecast] = await Promise.all([
    getCurrentWeatherData(lat, lon, apiKey, signal),
    getForecastWeatherData(lat, lon, apiKey, signal),
  ]);

  return {
    current,
    forecast,
  };
}
