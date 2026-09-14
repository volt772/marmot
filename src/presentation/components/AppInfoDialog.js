import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export default function AppInfoDialog({ visible, onConfirm }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityViewIsModal>
          <View style={styles.icon}>
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Circle
                cx={12}
                cy={12}
                r={9}
                fill="none"
                stroke="#0D141C"
                strokeWidth={2}
              />
              <Circle cx={9} cy={10} r={1} fill="#0D141C" />
              <Circle cx={15} cy={10} r={1} fill="#0D141C" />
              <Path
                d="M8 14 Q12 18 16 14"
                fill="none"
                stroke="#0D141C"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <Text style={styles.title}>환영합니다!</Text>

          <ScrollView style={styles.body}>
            <Text style={styles.description}>
              데이터 제공사의 상황에 따라 일부 날씨 정보가 부정확할 수 있으며,
              날씨 표기가 다소 부자연스러울 수 있습니다. 모든 내용은
              참고용도로만 이용하시기 바랍니다.
            </Text>
          </ScrollView>

          <Pressable
            style={styles.confirmButton}
            onPress={onConfirm}
            accessibilityRole="button"
          >
            <Text style={styles.confirmText}>확인하였습니다</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "88%",
    maxWidth: 400,
    maxHeight: "100%",
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#0D141C",
    marginBottom: 16,
  },
  body: {
    flexShrink: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    color: "#0D141C",
  },
  confirmButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D141C",
  },
});
