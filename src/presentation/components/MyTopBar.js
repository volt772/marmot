import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export default function MyTopBar({ onInfoClick, colors }) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable
        style={styles.button}
        onPress={onInfoClick}
        accessibilityRole="button"
        accessibilityLabel="앱 안내"
      >
        <Svg width={26} height={26} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} fill={colors.content} />
          <Circle cx={12} cy={7} r={1.2} fill={colors.background} />
          <Path
            d="M12 11V17"
            stroke={colors.background}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
