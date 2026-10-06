import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontFamilyForWeight, radii, spacing } from "../../theme";
import { AppText } from "../components/AppText";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { getInitials, useProfile } from "../context/ProfileContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[0-9\s()+.-]{7,20}$/;

const validateFullName = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your full name.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (/\d/.test(trimmed)) return "Name cannot contain numbers.";
  if (trimmed.length > 60) return "Name must be 60 characters or fewer.";
  return null;
};

const validateEmail = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address.";
  return null;
};

const validatePhone = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your phone number.";
  if (!PHONE_PATTERN.test(trimmed)) {
    return "Use digits, spaces, +, ( ) or - only.";
  }
  if (trimmed.replace(/\D/g, "").length < 7) {
    return "Phone number must be at least 7 digits.";
  }
  return null;
};

const VALIDATORS = {
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone,
};

// Shared input shell so every field keeps the same height, icon slot and
// error state — only the TextInput inside differs per field.
function Field({ label, icon, error, children }) {
  return (
    <View style={styles.fieldWrap}>
      <AppText weight="600" style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.inputShell, error ? styles.inputShellError : null]}>
        <Icon
          name={icon}
          size={18}
          color={error ? colors.error : colors.textMuted}
        />
        {children}
      </View>
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </View>
  );
}

// Frame 08 — Personal Details (edit profile).
export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useProfile();

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);

  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const initials = getInitials(fullName);

  const clearError = (key) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: null } : prev));

  const handlePickPhoto = async () => {
    setNotice(null);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setNotice(
          "Photo library access is needed to change your picture. You can still save your details.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled) return;
      const asset = result.assets && result.assets[0];
      if (asset && asset.uri) setPhotoUri(asset.uri);
    } catch (_error) {
      setNotice("We couldn't open your photo library. Please try again.");
    }
  };

  const handleSave = async () => {
    const nextErrors = {
      fullName: VALIDATORS.fullName(fullName),
      email: VALIDATORS.email(email),
      phone: VALIDATORS.phone(phone),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        photoUri,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Personal Details</AppText>
        <View style={styles.headerSlot} />
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
        >
          {/* Avatar */}
          <View style={styles.avatarBlock}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={handlePickPhoto}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <View style={styles.avatarRing}>
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <AppText weight="700" style={styles.avatarInitials}>
                      {initials}
                    </AppText>
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={15} color={colors.white} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickPhoto}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Upload a new photo"
            >
              <AppText weight="600" style={styles.changePhoto}>
                Change Photo
              </AppText>
            </TouchableOpacity>

            {photoUri ? (
              <TouchableOpacity
                onPress={() => setPhotoUri(null)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Remove profile photo"
              >
                <AppText style={styles.removePhoto}>Remove photo</AppText>
              </TouchableOpacity>
            ) : null}
          </View>

          {notice ? (
            <View style={styles.notice}>
              <Icon name="close" size={16} color={colors.error} />
              <AppText style={styles.noticeText}>{notice}</AppText>
            </View>
          ) : null}

          {/* Fields */}
          <View style={styles.form}>
            <Field label="Full Name" icon="account" error={errors.fullName}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  clearError("fullName");
                }}
                placeholder="e.g. Alex Morgan"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailRef.current && emailRef.current.focus()
                }
                accessibilityLabel="Full Name"
              />
            </Field>

            <Field label="Email Address" icon="email" error={errors.email}>
              <TextInput
                ref={emailRef}
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError("email");
                }}
                placeholder="e.g. alex.morgan@email.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() =>
                  phoneRef.current && phoneRef.current.focus()
                }
                accessibilityLabel="Email Address"
              />
            </Field>

            <Field label="Phone Number" icon="phone" error={errors.phone}>
              <TextInput
                ref={phoneRef}
                style={styles.input}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  clearError("phone");
                }}
                placeholder="e.g. +1 (555) 234-5678"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                returnKeyType="done"
                accessibilityLabel="Phone Number"
              />
            </Field>
          </View>
        </ScrollView>

        {/* Actions */}
        <View
          style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
          >
            <Icon name="content-save" size={18} color={colors.white} />
            <AppText weight="600" style={styles.saveText}>
              {saving ? "Saving..." : "Save Changes"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, saving && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={saving}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Cancel editing"
          >
            <AppText weight="600" style={styles.cancelText}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSlot: { width: 24 },

  body: { flex: 1 },
  contentContainer: { padding: spacing.md, paddingBottom: spacing.xl },

  avatarBlock: { alignItems: "center", paddingTop: spacing.md },
  avatarButton: { marginBottom: spacing.sm },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: radii.full,
    borderWidth: 3,
    borderColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: 96, height: 96, borderRadius: 48 },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { fontSize: 32, color: colors.white },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhoto: { fontSize: 15, color: colors.primary },
  removePhoto: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  form: { marginTop: spacing.lg, gap: spacing.lg },

  fieldWrap: { width: "100%" },
  label: { fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  inputShellError: { borderColor: colors.error },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fontFamilyForWeight("400"),
    paddingVertical: 0,
  },
  errorText: { fontSize: 12, color: colors.error, marginTop: spacing.xs },

  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
  },
  saveText: { fontSize: 17, color: colors.white },
  cancelButton: {
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 16, color: colors.textSecondary },
  buttonDisabled: { opacity: 0.6 },
});
