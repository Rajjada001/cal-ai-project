import { router } from 'expo-router';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Ruler } from '@/components/onboarding/ruler';
import { ValueDisplay } from '@/components/onboarding/value-display';
import { kgToLb, lbToKg } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

export default function WeightScreen() {
  const { weightKg, unitSystem, set } = useOnboarding();
  const imperial = unitSystem === 'imperial';
  const display = imperial ? Math.round(kgToLb(weightKg) * 2) / 2 : Math.round(weightKg * 10) / 10;

  return (
    <OnboardingScreen
      progress={4 / 9}
      title={'What’s your\ncurrent weight?'}
      subtitle={'This helps us understand your\nstarting point.'}
      onNext={() => router.push('/(onboarding)/activity')}>
      <ValueDisplay value={display.toFixed(1)} unit={imperial ? 'lb' : 'kg'} />
      {imperial ? (
        <Ruler key="lb" min={66} max={440} step={0.5} value={display} gap={7.8} labelEvery={10} majorEvery={10}
          onChange={(v) => set({ weightKg: lbToKg(v) })} />
      ) : (
        <Ruler key="kg" min={30} max={200} step={0.1} value={display} gap={3.9} labelEvery={20} majorEvery={10}
          onChange={(v) => set({ weightKg: v })} />
      )}
    </OnboardingScreen>
  );
}
