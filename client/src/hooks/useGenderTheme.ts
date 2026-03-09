import { useApp, Gender } from "@/contexts/AppContext";
import { THEME } from "@/lib/constants";

export function useGenderTheme(overrideGender?: Gender) {
  const { activeGender } = useApp();
  const gender = overrideGender || activeGender;
  const theme = gender === "female" ? THEME.female : THEME.male;
  return { ...theme, gender, shared: THEME.shared };
}
