import { router } from 'expo-router';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Ruler } from '@/components/onboarding/ruler';
import { ValueDisplay } from '@/components/onboarding/value-display';
import { kgToLb, lbToKg } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

export default function TargetWeightScreen() {
  const { targetWeightKg, unitSystem, goal, weightKg, set } = useOnboarding();
  const imperial = unitSystem === 'imperial';
  const display = imperial ? Math.round(kgToLb(targetWeightKg) * 2) / 2 : Math.round(targetWeightKg * 10) / 10;
  // Keep the target on the correct side of the current weight for the chosen goal.
  const valid = goal === 'lose' ? targetWeightKg < weightKg : targetWeightKg > weightKg;

  return (
    <OnboardingScreen
      progress={7 / 9}
      title={'What’s your\ngoal weight?'}
      subtitle="Where do you want to be?"
      buttonDisabled={!valid}
      onNext={() => router.push('/(onboarding)/pace')}>
      <ValueDisplay value={display.toFixed(1)} unit={imperial ? 'lb' : 'kg'} />
      {imperial ? (
        <Ruler key="lb" min={66} max={440} step={0.5} value={display} gap={7.8} labelEvery={10} majorEvery={10}
          onChange={(v) => set({ targetWeightKg: lbToKg(v) })} />
      ) : (
        <Ruler key="kg" min={30} max={200} step={0.1} value={display} gap={3.9} labelEvery={20} majorEvery={10}
          onChange={(v) => set({ targetWeightKg: v })} />
      )}
    </OnboardingScreen>
  );
}
