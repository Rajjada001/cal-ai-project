import { router } from 'expo-router';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Ruler } from '@/components/onboarding/ruler';
import { UnitToggle } from '@/components/onboarding/unit-toggle';
import { ValueDisplay } from '@/components/onboarding/value-display';
import { cmToIn, inToCm } from '@/lib/nutrition';
import { useOnboarding } from '@/store/onboarding';

const feetInches = (inches: number) => `${Math.floor(inches / 12)}'${inches % 12}"`;

export default function HeightScreen() {
  const { heightCm, unitSystem, set } = useOnboarding();
  const imperial = unitSystem === 'imperial';
  const inches = Math.round(cmToIn(heightCm));

  return (
    <OnboardingScreen
      progress={3 / 9}
      title={'What’s your\nheight?'}
      subtitle={'We’ll use this to calculate your\ncalorie needs.'}
      headerRight={<UnitToggle value={unitSystem} onChange={(u) => set({ unitSystem: u })} />}
      onNext={() => router.push('/(onboarding)/weight')}>
      <ValueDisplay
        value={imperial ? feetInches(inches) : String(Math.round(heightCm))}
        unit={imperial ? 'ft' : 'cm'}
      />
      {imperial ? (
        <Ruler
          key="in"
          min={48}
          max={87}
          step={1}
          value={inches}
          gap={15.6}
          labelEvery={2}
          majorEvery={6}
          formatLabel={feetInches}
          onChange={(v) => set({ heightCm: inToCm(v) })}
        />
      ) : (
        <Ruler
          key="cm"
          min={120}
          max={220}
          step={1}
          value={Math.round(heightCm)}
          gap={15.6}
          labelEvery={5}
          majorEvery={5}
          onChange={(v) => set({ heightCm: v })}
        />
      )}
    </OnboardingScreen>
  );
}
