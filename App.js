import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { getWeatherByStadium } from "./src/data/repositories/weatherRepository";
import { createGetWeather } from "./src/domain/usecases/getWeather";
import MainScreen from "./src/presentation/screens/MainScreen";

const getWeather = createGetWeather(getWeatherByStadium);

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <MainScreen getWeather={getWeather} />
    </SafeAreaProvider>
  );
}
