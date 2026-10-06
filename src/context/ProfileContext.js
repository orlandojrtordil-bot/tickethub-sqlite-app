import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Versioned key so a future shape change invalidates older cached profiles.
const STORAGE_KEY = "@tickethub/profile/v1";

// Seed matches the original hardcoded identity so the app looks unchanged on
// a fresh install, while every screen reads these values through the context.
export const DEFAULT_PROFILE = {
  fullName: "Alex Morgan",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 234-5678",
  photoUri: null,
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const wordsOf = (fullName) =>
  String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

// "Alex Morgan" -> "AM", "Cher" -> "CH", "" -> "?"
export const getInitials = (fullName) => {
  const words = wordsOf(fullName);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

// "Alex Morgan" -> "Alex" (used by the Home greeting).
export const getFirstName = (fullName) => wordsOf(fullName)[0] || "";

const ProfileContext = createContext(undefined);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore the persisted profile once on mount.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && stored) {
          const parsed = JSON.parse(stored);
          // Ignore corrupt or foreign payloads rather than crashing on boot.
          if (isPlainObject(parsed)) {
            setProfile({ ...DEFAULT_PROFILE, ...parsed });
          }
        }
      } catch (_error) {
        // Storage/parse failures fall back to the seed profile.
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  // Optimistic update: the UI reflects the edit immediately even if the
  // write fails (the state is still correct for the current session).
  // Merges into the *current* profile so partial patches never clobber the
  // other fields back to their defaults.
  const updateProfile = useCallback(
    async (patch) => {
      const next = { ...profile, ...(patch || {}) };
      setProfile(next);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_error) {
        // Non-fatal — the in-memory profile is still saved for this session.
      }
      return next;
    },
    [profile]
  );

  const resetProfile = useCallback(async () => {
    setProfile(DEFAULT_PROFILE);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Non-fatal.
    }
    return DEFAULT_PROFILE;
  }, []);

  const value = useMemo(
    () => ({
      profile,
      isHydrated,
      updateProfile,
      resetProfile,
      initials: getInitials(profile.fullName),
      firstName: getFirstName(profile.fullName),
    }),
    [profile, isHydrated, updateProfile, resetProfile]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a <ProfileProvider>");
  }
  return context;
}

export default ProfileContext;
