import { router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { OptionCard } from '@/components/onboarding/option-card';
import { kgToLb } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

const OPTIONS = [
  { kg: 0.25, icon: 'walk-outline', title: 'Relaxed' },
  { kg: 0.5, icon: 'bicycle-outline', title: 'Steady (recommended)' },
  { kg: 0.75, icon: 'speedometer-outline', title: 'Faster' },
  { kg: 1, icon: 'flash-outline', title: 'Aggressive' },
] as const;

export default function PaceScreen() {
  const s = useWindowDimensions().width / 402;
  const { weeklyRateKg, unitSystem, goal, set } = useOnboarding();
  const imperial = unitSystem === 'imperial';

  return (
    <OnboardingScreen
      progress={8 / 9}
      title={'How fast do you\nwant to get there?'}
      subtitle={`Weekly pace to ${goal === 'lose' ? 'lose' : 'gain'} weight.`}
      buttonDisabled={!weeklyRateKg}
      onNext={() => router.push('/(onboarding)/building')}>
      <View style={{ marginTop: 28 * s, gap: 10 * s }}>
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.kg}
            icon={o.icon}
            title={o.title}
            description={imperial ? `${(Math.round(kgToLb(o.kg) * 2) / 2).toFixed(1)} lb per week` : `${o.kg} kg per week`}
            selected={weeklyRateKg === o.kg}
            height={66}
            onPress={() => set({ weeklyRateKg: o.kg })}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
