import { router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { OptionCard } from '@/components/onboarding/option-card';
import type { Goal } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

const OPTIONS: { value: Goal; icon: React.ComponentProps<typeof OptionCard>['icon']; title: string; description: string }[] = [
  { value: 'lose', icon: 'trending-down-outline', title: 'Lose Weight', description: 'Burn fat and get leaner' },
  { value: 'maintain', icon: 'heart-outline', title: 'Maintain Weight', description: 'Stay fit and healthy' },
  { value: 'gain', icon: 'trending-up-outline', title: 'Gain Weight', description: 'Build size and increase weight' },
];

export default function GoalScreen() {
  const s = useWindowDimensions().width / 402;
  const { goal, weightKg, set } = useOnboarding();

  const next = () => {
    if (goal === 'maintain') {
      set({ targetWeightKg: weightKg, weeklyRateKg: 0 });
      router.push('/(onboarding)/building');
      return;
    }
    set({ targetWeightKg: Math.round((weightKg + (goal === 'lose' ? -5 : 5)) * 10) / 10 });
    router.push('/(onboarding)/target-weight');
  };

  return (
    <OnboardingScreen
      progress={6 / 9}
      title={'What’s your\nmain goal?'}
      subtitle={'We’ll build your plan around this.'}
      buttonDisabled={!goal}
      onNext={next}>
      <View style={{ marginTop: 28 * s, gap: 10 * s }}>
        {OPTIONS.map((o) => (
          <OptionCard key={o.value} icon={o.icon} title={o.title} description={o.description}
            selected={goal === o.value} height={66} onPress={() => set({ goal: o.value })} />
        ))}
      </View>
    </OnboardingScreen>
  );
}
