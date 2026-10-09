export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
export type Goal = 'lose' | 'maintain' | 'gain';
export type UnitSystem = 'metric' | 'imperial';

export type TargetInput = {
  sex: Sex;
  birthdate: string; // YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  weeklyRateKg: number;
};

export type Targets = { calories: number; proteinG: number; carbsG: number; fatG: number };

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

const KCAL_PER_KG = 7700;

export function ageFromBirthdate(birthdate: string, now = new Date()) {
  const [y, m, d] = birthdate.split('-').map(Number);
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  return age;
}

// Mifflin-St Jeor, activity multiplier, goal adjustment, safety floors (PLAN.md A1).
export function calculateTargets(input: TargetInput): Targets {
  const age = ageFromBirthdate(input.birthdate);
  const bmr =
    10 * input.weightKg + 6.25 * input.heightCm - 5 * age + (input.sex === 'male' ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTOR[input.activityLevel];

  // Weekly pace is capped at about 1% of body weight.
  const rate = Math.min(input.weeklyRateKg, input.weightKg * 0.01);
  const dailyDelta = (rate * KCAL_PER_KG) / 7;

  let calories = tdee;
  if (input.goal === 'lose') calories -= dailyDelta;
  if (input.goal === 'gain') calories += dailyDelta;
  calories = Math.max(calories, input.sex === 'male' ? 1500 : 1200);

  const proteinG = Math.round(input.weightKg * (input.goal === 'lose' ? 2.2 : 1.8));
  const fatG = Math.round((calories * 0.25) / 9);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));

  return { calories: Math.round(calories), proteinG, carbsG, fatG };
}

export const kgToLb = (kg: number) => kg * 2.2046226218;
export const lbToKg = (lb: number) => lb / 2.2046226218;
export const cmToIn = (cm: number) => cm / 2.54;
export const inToCm = (inch: number) => inch * 2.54;
