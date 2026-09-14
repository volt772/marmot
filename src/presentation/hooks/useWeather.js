import { useCallback, useEffect, useRef, useState } from "react";

export default function useWeather(stadium, getWeather) {
  const [weatherState, setWeatherState] = useState({
    stadiumCode: null,
    data: null,
    loading: false,
    refreshing: false,
    error: null,
  });

  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadWeather = useCallback(
    async (forceRefresh = false) => {
      controllerRef.current?.abort();

      const requestId = ++requestIdRef.current;

      if (!stadium) {
        setWeatherState({
          stadiumCode: null,
          data: null,
          loading: false,
          refreshing: false,
          error: null,
        });
        return;
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setWeatherState((previous) => {
        const data =
          previous.stadiumCode === stadium.code ? previous.data : null;

        return {
          stadiumCode: stadium.code,
          data,
          loading: data === null,
          refreshing: data !== null,
          error: null,
        };
      });

      try {
        const data = await getWeather(stadium, {
          forceRefresh,
          signal: controller.signal,
        });

        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        setWeatherState({
          stadiumCode: stadium.code,
          data,
          loading: false,
          refreshing: false,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        setWeatherState((previous) => ({
          ...previous,
          loading: false,
          refreshing: false,
          error: error.message || "날씨를 가져오지 못했습니다.",
        }));
      }
    },
    [stadium, getWeather],
  );

  useEffect(() => {
    loadWeather();

    return () => {
      controllerRef.current?.abort();
      requestIdRef.current += 1;
    };
  }, [loadWeather]);

  const refresh = useCallback(() => {
    return loadWeather();
  }, [loadWeather]);

  // 경기장이 바뀐 직후 이전 경기장의 날씨가 표시되는 것을 방지
  const isCurrentStadium = weatherState.stadiumCode === stadium?.code;

  return {
    data: isCurrentStadium ? weatherState.data : null,
    loading: stadium ? !isCurrentStadium || weatherState.loading : false,
    refreshing: isCurrentStadium ? weatherState.refreshing : false,
    error: isCurrentStadium ? weatherState.error : null,
    refresh,
  };
}
