import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { PlanNumbers } from '@/components/onboarding/plan-numbers';

const CONFETTI = [
  ['#7C83FF', 18, 20], ['#FFB74D', 48, 90], ['#FF7043', 20, 150], ['#81C784', 90, 40],
  ['#4DD0E1', 250, 30], ['#F48FB1', 275, 100], ['#FFD54F', 235, 150], ['#FF7043', 262, 60],
] as const;

export default function PlanScreen() {
  const s = useWindowDimensions().width / 402;
  const insets = useSafeAreaInsets();
  return (
    <OnboardingScreen hideBack title="" buttonLabel="Continue" onNext={() => router.push('/(onboarding)/features')}>
      <View className="items-center" style={{ marginTop: -36 * s }}>
        <View style={{ width: 300 * s, height: 170 * s, alignItems: 'center' }}>
          {CONFETTI.map(([color, left, top], i) => (
            <View key={i} style={{ position: 'absolute', left: left * s, top: top * s, width: 8 * s, height: 8 * s, borderRadius: 2 * s, backgroundColor: color, transform: [{ rotate: `${i * 37}deg` }] }} />
          ))}
          <View className="items-center justify-center rounded-full bg-white" style={{ width: 130 * s, height: 130 * s, marginTop: 10 * s, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 }}>
            <Image source={require('@/assets/images/logo-dark.png')} style={{ width: 100 * s, height: 100 * s }} contentFit="contain" />
          </View>
        </View>

        <Text className="font-bold text-black" style={{ fontSize: 24 * s, marginTop: 4 * s }}>
          Your daily calorie target
        </Text>
        <Text className="text-center text-neutral-600" style={{ fontSize: 13 * s, lineHeight: 20 * s, marginTop: 10 * s }}>
          {'Based on your info, here’s your personalized\ntarget to reach your goal.'}
        </Text>
        <View style={{ marginTop: 12 * s, alignSelf: 'stretch' }}>
          <PlanNumbers />
        </View>

        <View className="flex-row self-stretch rounded-2xl" style={{ marginTop: 14 * s, padding: 14 * s, backgroundColor: '#ECE9FB', marginBottom: insets.bottom > 0 ? 0 : 0 }}>
          <Ionicons name="star" size={16 * s} color="#6B63D6" style={{ marginRight: 10 * s, marginTop: 2 * s }} />
          <View className="flex-1">
            <Text className="font-bold text-black" style={{ fontSize: 14 * s }}>This is just the beginning!</Text>
            <Text className="text-neutral-600" style={{ fontSize: 12.5 * s, lineHeight: 19 * s, marginTop: 4 * s }}>
              Unlock your personalized plan, AI insights and advanced tracking.
            </Text>
          </View>
        </View>
      </View>
    </OnboardingScreen>
  );
}
