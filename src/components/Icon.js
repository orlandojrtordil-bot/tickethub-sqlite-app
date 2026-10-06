import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme";

// Only glyphs verified to exist in the bundled MaterialCommunityIcons glyphmap
// are mapped here. Note: `user-circle` and `globe-with-magnifier` do NOT exist
// in this version, so `account-circle` and a composed globe are used instead.
const GLYPHS = {
  // Navigation / chrome
  menu: "menu",
  close: "close",
  check: "check",
  "check-circle": "check-circle",
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "chevron-right": "chevron-right",
  "chevron-down": "chevron-down",

  // Header
  bell: "bell",
  "bell-outline": "bell-outline",
  "account-circle": "account-circle-outline",

  // Trip form
  airplane: "airplane",
  plane: "airplane",
  "airplane-takeoff": "airplane-takeoff",
  "airplane-landing": "airplane-landing",
  "swap-vertical": "swap-vertical",
  calendar: "calendar",
  "account-group": "account-group-outline",
  magnify: "magnify",
  "tune-vertical": "tune-vertical",
  barcode: "barcode",

  // Details / actions
  camera: "camera",
  "camera-outline": "camera-outline",
  "image-plus": "image-plus",
  "content-save": "content-save",
  "bag-suitcase": "bag-suitcase",
  "bag-carry-on": "bag-carry-on",
  "bag-checked": "bag-checked",
  "card-account-details": "card-account-details-outline",
  "account-details": "account-details-outline",
  "credit-card": "credit-card-outline",
  headset: "headset",
  "help-circle": "help-circle-outline",
  lock: "lock",
  logout: "logout",
  download: "download",
  "silverware-fork-knife": "silverware-fork-knife",
  ticket: "ticket",
  "ticket-outline": "ticket-outline",
  star: "star",
  "shield-check": "shield-check-outline",
  seat: "seat-recline-normal",
  "content-copy": "content-copy",
  email: "email-outline",
  phone: "phone-outline",
  minus: "minus",
  plus: "plus",
  trash: "trash-can",

  // Tab bar
  home: "home",
  "home-outline": "home-outline",
  account: "account",
  "account-outline": "account-outline",
  earth: "earth",
};

export const Icon = ({ name, size = 20, color = colors.primary, style }) => {
  const glyph = GLYPHS[name];
  if (!glyph) return null;

  return (
    <MaterialCommunityIcons
      name={glyph}
      size={size}
      color={color}
      style={style}
    />
  );
};

export const hasIcon = (name) => Boolean(GLYPHS[name]);

export default Icon;
