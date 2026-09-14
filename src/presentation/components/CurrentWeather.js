import { StyleSheet, Text, View } from "react-native";
import WeatherIcon from "./WeatherIcon";

export default function CurrentWeather({ weather, stadiumName, colors }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.description, { color: colors.content }]}>
        {weather.description}
      </Text>

      <View style={styles.icon}>
        <WeatherIcon
          weatherId={weather.weatherId}
          size={160}
          color={colors.content}
        />
      </View>

      <Text style={[styles.temperature, { color: colors.content }]}>
        {Math.round(weather.temp)}°C
      </Text>

      <Text style={[styles.stadiumName, { color: colors.content }]}>
        {stadiumName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  description: {
    fontSize: 22,
    fontWeight: "500",
  },
  temperature: {
    marginTop: 16,
    fontSize: 80,
    fontWeight: "bold",
  },
  stadiumName: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "600",
  },
  icon: {
    marginTop: 24,
  },
});
