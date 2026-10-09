import { Ionicons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';

import { calculateTargets } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

// Daily targets calculated on the device from the saved onboarding answers.
export function usePlanTargets() {
  const a = useOnboarding();
  return calculateTargets({
    sex: a.sex ?? 'male',
    birthdate: a.birthdate,
    heightCm: a.heightCm,
    weightKg: a.weightKg,
    activityLevel: a.activityLevel ?? 'moderate',
    goal: a.goal ?? 'maintain',
    weeklyRateKg: a.weeklyRateKg,
  });
}

// Calorie target plus the protein / carbs / fat breakdown card.
export function PlanNumbers() {
  const s = useWindowDimensions().width / 402;
  const t = usePlanTargets();

  const macros = [
    { icon: 'nutrition-outline', color: '#F25C54', value: `${t.proteinG}g`, label: 'Protein' },
    { icon: 'leaf-outline', color: '#F5A623', value: `${t.carbsG}g`, label: 'Carbs' },
    { icon: 'water-outline', color: '#F5C400', value: `${t.fatG}g`, label: 'Fat' },
  ] as const;

  return (
    <View className="items-center self-stretch">
      <Text className="font-bold text-black" style={{ fontSize: 46 * s, letterSpacing: -1 }}>
        {t.calories.toLocaleString('en-US')}
      </Text>
      <Text className="text-neutral-600" style={{ fontSize: 17 * s }}>Calories / day</Text>

      <View className="flex-row justify-around self-stretch rounded-2xl border border-neutral-200 bg-white" style={{ marginTop: 16 * s, paddingVertical: 14 * s }}>
        {macros.map((m) => (
          <View key={m.label} className="items-center" style={{ gap: 6 * s }}>
            <Ionicons name={m.icon} size={24 * s} color={m.color} />
            <Text className="font-semibold text-black" style={{ fontSize: 16 * s }}>{m.value}</Text>
            <Text className="text-neutral-500" style={{ fontSize: 13 * s }}>{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
