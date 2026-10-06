import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function ScreenStatusBar({ style }) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar style={style} /> : null;
}
