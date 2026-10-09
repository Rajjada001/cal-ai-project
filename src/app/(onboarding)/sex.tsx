import { router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { OptionCard } from '@/components/onboarding/option-card';
import { useOnboarding } from '@/store/onboarding';

export default function SexScreen() {
  const s = useWindowDimensions().width / 402;
  const sex = useOnboarding((st) => st.sex);
  const set = useOnboarding((st) => st.set);

  return (
    <OnboardingScreen
      progress={1 / 9}
      title={'Let’s get to know\nyou better'}
      subtitle={'This helps us personalize your\nplan and recommendations.'}
      buttonDisabled={!sex}
      onNext={() => router.push('/(onboarding)/birthdate')}>
      <View style={{ marginTop: 50 * s, gap: 32 * s }}>
        <OptionCard icon="male-outline" title="Male" selected={sex === 'male'} height={100} onPress={() => set({ sex: 'male' })} />
        <OptionCard icon="female-outline" title="Female" selected={sex === 'female'} height={100} onPress={() => set({ sex: 'female' })} />
      </View>
    </OnboardingScreen>
  );
}
