import React from "react";
import { StyleSheet, Text as RNText } from "react-native";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { fontFamilyForWeight, typography } from "../../theme";

// Loads the four Inter weights used across the app. App.js gates the whole
// navigator on the returned boolean so text never renders in the fallback font.
export const useInterFonts = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  return fontsLoaded;
};

// AppText resolves the concrete Inter family from the final `fontWeight`
// (Android ignores fontWeight whenever an explicit family is supplied).
export const AppText = ({ children, style, variant = "body", weight, ...rest }) => {
  const flat =
    StyleSheet.flatten([typography[variant] || typography.body, style]) || {};
  const fontWeight =
    weight === undefined || weight === null ? flat.fontWeight : String(weight);
  const fontFamily = flat.fontFamily || fontFamilyForWeight(fontWeight);

  return (
    <RNText {...rest} style={[flat, { fontWeight, fontFamily }]}>
      {children}
    </RNText>
  );
};

export default AppText;
