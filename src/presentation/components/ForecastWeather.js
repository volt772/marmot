import { ScrollView, StyleSheet, Text, View } from "react-native";
import WeatherIcon from "./WeatherIcon";

const KOREA_OFFSET = 9 * 60 * 60 * 1000;

function getKoreaDate(timestamp) {
  return new Date(timestamp + KOREA_OFFSET).toISOString().slice(0, 10);
}

function getKoreaHour(timestamp) {
  return new Date(timestamp + KOREA_OFFSET).getUTCHours();
}

export default function ForecastWeather({ forecast, colors }) {
  const now = Date.now();
  const today = getKoreaDate(now);

  const todayForecast = (forecast?.list ?? [])
    .filter((item) => {
      const timestamp = item.dt * 1000;

      return (
        Number.isFinite(timestamp) &&
        timestamp > now &&
        getKoreaDate(timestamp) === today &&
        item.weather?.[0] &&
        Number.isFinite(item.main?.temp)
      );
    })
    .sort((a, b) => a.dt - b.dt);

  if (todayForecast.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {todayForecast.map((item, index) => (
          <View
            key={item.dt}
            style={[
              styles.item,
              { backgroundColor: colors.background },
              index > 0 && styles.itemSpacing,
            ]}
          >
            <Text style={[styles.text, { color: colors.content }]}>
              {getKoreaHour(item.dt * 1000)}시
            </Text>

            <View style={styles.icon}>
              <WeatherIcon
                weatherId={item.weather[0].id}
                size={50}
                color={colors.content}
              />
            </View>

            <Text style={[styles.text, { color: colors.content }]}>
              {Math.round(item.main.temp)}°C
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    width: 130,
    height: 130,
    borderRadius: 10,
    padding: 13,
    alignItems: "center",
  },
  itemSpacing: {
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
  },
  icon: {
    marginVertical: 5,
  },
});
