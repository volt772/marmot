import { getWeatherTranslatedDescription } from "../constants/translatedDescription";

export function createGetWeather(getWeatherByStadium) {
  return async function getWeather(stadium, options = {}) {
    const data = await getWeatherByStadium(stadium, options);
    const current = data.current;
    const weather = current.weather[0];

    return {
      currentWeather: {
        weatherId: weather.id,
        description: getWeatherTranslatedDescription(
          weather.id,
          weather.description,
        ),
        temp: current.main.temp,
      },
      forecast: data.forecast,
      updatedAt: data.updatedAt,
      isStale: data.isStale,
      warning: data.warning ?? null,
    };
  };
}
