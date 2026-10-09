import { router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { OptionCard } from '@/components/onboarding/option-card';
import type { ActivityLevel } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

const OPTIONS: { value: ActivityLevel; icon: React.ComponentProps<typeof OptionCard>['icon']; title: string; description: string }[] = [
  { value: 'sedentary', icon: 'tv-outline', title: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', icon: 'walk-outline', title: 'Lightly active', description: '1–3 days per week' },
  { value: 'moderate', icon: 'barbell-outline', title: 'Moderately active', description: '3–5 days per week' },
  { value: 'very', icon: 'bicycle-outline', title: 'Very active', description: '6–7 days per week' },
  { value: 'extra', icon: 'flame-outline', title: 'Extra active', description: 'Very intense daily activity or physical job' },
];

export default function ActivityScreen() {
  const s = useWindowDimensions().width / 402;
  const level = useOnboarding((st) => st.activityLevel);
  const set = useOnboarding((st) => st.set);

  return (
    <OnboardingScreen
      progress={5 / 9}
      title={'How active are you\nduring the day?'}
      subtitle={'This helps us estimate your daily\ncalorie needs.'}
      buttonDisabled={!level}
      onNext={() => router.push('/(onboarding)/goal')}>
      <View style={{ marginTop: 28 * s, gap: 10 * s }}>
        {OPTIONS.map((o) => (
          <OptionCard key={o.value} icon={o.icon} title={o.title} description={o.description}
            selected={level === o.value} height={66} onPress={() => set({ activityLevel: o.value })} />
        ))}
      </View>
    </OnboardingScreen>
  );
}
