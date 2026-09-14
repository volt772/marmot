import AsyncStorage from "@react-native-async-storage/async-storage";

const WEATHER_CACHE_PREFIX = "weatherCache";

export function currentHourlyTimestamp() {
  const now = new Date();
  now.setMinutes(0, 0, 0);

  return now.getTime();
}

function getCacheKey(stadiumCode) {
  return `${WEATHER_CACHE_PREFIX}:${stadiumCode}`;
}

export async function saveWeatherCache(stadiumCode, data, updatedAt) {
  const cache = {
    updatedAt,
    current: data.current,
    forecast: data.forecast,
  };

  await AsyncStorage.setItem(getCacheKey(stadiumCode), JSON.stringify(cache));
}

export async function loadWeatherCache(stadiumCode) {
  const value = await AsyncStorage.getItem(getCacheKey(stadiumCode));

  if (!value) {
    return null;
  }

  let cache;

  try {
    cache = JSON.parse(value);
  } catch {
    return null;
  }

  if (
    !cache ||
    !Number.isFinite(cache.updatedAt) ||
    !Array.isArray(cache.current?.weather) ||
    cache.current.weather.length === 0 ||
    !Number.isFinite(cache.current.weather[0]?.id) ||
    !Number.isFinite(cache.current?.main?.temp) ||
    !Array.isArray(cache.forecast?.list) ||
    cache.forecast.list.length === 0
  ) {
    return null;
  }

  return cache;
}
