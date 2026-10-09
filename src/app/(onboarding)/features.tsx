import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, useWindowDimensions } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { useOnboarding } from '@/store/onboarding';

const FEATURES = [
  { icon: 'locate-outline', title: 'Calorie Tracking', description: 'Track effortlessly and stay on target' },
  { icon: 'scan-outline', title: 'AI Food Scanner', description: 'Scan meals and get instant nutrition' },
  { icon: 'restaurant-outline', title: 'High Calorie Recipes', description: 'Easy, delicious meals to fuel gains' },
  { icon: 'stats-chart-outline', title: 'Progress Tracking', description: 'Monitor your progress and stay motivated' },
  { icon: 'notifications-outline', title: 'Smart Reminders', description: 'Daily reminders to keep you consistent' },
] as const;

export default function FeaturesScreen() {
  const s = useWindowDimensions().width / 402;
  const { targetWeightKg, unitSystem, goal } = useOnboarding();
  const target = unitSystem === 'imperial' ? `${(targetWeightKg * 2.2046).toFixed(1)} lb` : `${targetWeightKg.toFixed(1)} kg`;
  const subtitle = goal === 'maintain' ? 'Your personalized plan to help you\nstay on track.' : `Your personalized plan to help you\nreach ${target}.`;

  return (
    <OnboardingScreen
      progress={1}
      title={'Here’s what your\nplan includes'}
      subtitle={subtitle}
      buttonLabel="Continue"
      onNext={() => router.push('/auth')}>
      <View style={{ marginTop: 28 * s, gap: 12 * s }}>
        {FEATURES.map((f) => (
          <View key={f.title} className="flex-row items-center rounded-2xl border border-neutral-200 bg-white" style={{ height: 70 * s, paddingHorizontal: 18 * s }}>
            <Ionicons name={f.icon} size={26 * s} color="#111" style={{ width: 44 * s }} />
            <View className="flex-1">
              <Text className="font-semibold text-black" style={{ fontSize: 15 * s }}>{f.title}</Text>
              <Text className="text-neutral-500" style={{ fontSize: 12.5 * s, marginTop: 3 * s }}>{f.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </OnboardingScreen>
  );
}
