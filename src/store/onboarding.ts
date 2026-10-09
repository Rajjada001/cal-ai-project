import { File, Paths } from 'expo-file-system';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { ActivityLevel, Goal, Sex, UnitSystem } from '@/lib/nutrition';

export type OnboardingAnswers = {
  unitSystem: UnitSystem;
  sex: Sex | null;
  birthdate: string; // YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
  targetWeightKg: number;
  weeklyRateKg: number;
};

const defaults: OnboardingAnswers = {
  unitSystem: 'metric',
  sex: null,
  birthdate: '2000-01-01',
  heightCm: 175,
  weightKg: 70,
  activityLevel: null,
  goal: null,
  targetWeightKg: 75,
  weeklyRateKg: 0.5,
};

type OnboardingStore = OnboardingAnswers & {
  set: (patch: Partial<OnboardingAnswers>) => void;
  reset: () => void;
};

// Persist to a JSON file in the app's document directory (no extra native module needed).
const file = new File(Paths.document, 'onboarding.json');
const fileStorage: StateStorage = {
  getItem: () => (file.exists ? file.textSync() : null),
  setItem: (_name, value) => {
    if (!file.exists) file.create();
    file.write(value);
  },
  removeItem: () => {
    if (file.exists) file.delete();
  },
};

export const useOnboarding = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...defaults,
      set: (patch) => set(patch),
      reset: () => set(defaults),
    }),
    { name: 'onboarding', storage: createJSONStorage(() => fileStorage) },
  ),
);
