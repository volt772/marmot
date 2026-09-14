import {
  currentHourlyTimestamp,
  loadWeatherCache,
  saveWeatherCache,
} from "../local/weatherCache";
import { getAllWeatherData } from "../remote/weatherApi";

export async function getWeatherByStadium(
  stadium,
  { forceRefresh = false, signal } = {},
) {
  const updatedAt = currentHourlyTimestamp();
  let cache = null;

  const checkAborted = () => {
    if (signal?.aborted) {
      const error = new Error("날씨 조회가 취소되었습니다.");
      error.name = "AbortError";
      throw error;
    }
  };

  checkAborted();

  try {
    cache = await loadWeatherCache(stadium.code);
  } catch {
    // 캐시를 읽지 못하면 API로 조회
  }

  checkAborted();

  if (!forceRefresh && cache?.updatedAt === updatedAt) {
    console.log(`[날씨][${stadium.code}] 캐시 사용`);

    return {
      current: cache.current,
      forecast: cache.forecast,
      updatedAt: cache.updatedAt,
      isStale: false,
    };
  }

  let data;

  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
    console.log(
      `[날씨][${stadium.code}] API 요청`,
      forceRefresh ? "강제 새로고침" : "현재 시간대 캐시 없음",
    );
    data = await getAllWeatherData(stadium.lat, stadium.lon, apiKey, signal);
    console.log(`[날씨][${stadium.code}] API 응답 수신`);
    checkAborted();

    if (
      !Array.isArray(data.current?.weather) ||
      data.current.weather.length === 0 ||
      !Number.isFinite(data.current.weather[0]?.id) ||
      !Number.isFinite(data.current?.main?.temp) ||
      !Array.isArray(data.forecast?.list) ||
      data.forecast.list.length === 0
    ) {
      throw new Error("날씨 응답 데이터가 올바르지 않습니다.");
    }
  } catch (error) {
    if (signal?.aborted || error.name === "AbortError") {
      throw error;
    }

    if (cache) {
      console.log(`[날씨][${stadium.code}] API 실패 → 저장된 캐시 사용`);

      return {
        current: cache.current,
        forecast: cache.forecast,
        updatedAt: cache.updatedAt,
        isStale: cache.updatedAt !== updatedAt,
        warning: "최신 날씨를 가져오지 못해 저장된 데이터를 표시합니다.",
      };
    }

    throw error;
  }

  try {
    await saveWeatherCache(stadium.code, data, updatedAt);
  } catch {
    // 저장에 실패해도 받아온 날씨는 표시
  }

  checkAborted();

  return {
    current: data.current,
    forecast: data.forecast,
    updatedAt,
    isStale: false,
  };
}
