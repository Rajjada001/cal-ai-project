import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Text, View, useWindowDimensions } from 'react-native';

const STEPS = ['Analyzing your profile', 'Calculating your calorie needs', 'Balancing your macros'];

export default function BuildingScreen() {
  const s = useWindowDimensions().width / 402;
  const [pulse] = useState(() => new Animated.Value(0));
  const [step, setStep] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    const timers = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => router.replace('/(onboarding)/plan'), 2800),
    ];
    return () => {
      loop.stop();
      timers.forEach(clearTimeout);
    };
  }, [pulse]);

  return (
    <View className="flex-1 items-center justify-center bg-white" style={{ paddingHorizontal: 24 * s }}>
      <Animated.View
        className="rounded-full bg-neutral-100"
        style={{
          width: 120 * s,
          height: 120 * s,
          transform: [{ scale: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.85, 1.1, 0.85] }) }],
        }}
      />
      <Text className="text-center font-bold text-black" style={{ fontSize: 28 * s, marginTop: 40 * s, letterSpacing: -0.5 }}>
        Building your plan…
      </Text>
      <Text className="text-center text-neutral-600" style={{ fontSize: 15 * s, marginTop: 12 * s }}>
        {STEPS[step]}
      </Text>
    </View>
  );
}
