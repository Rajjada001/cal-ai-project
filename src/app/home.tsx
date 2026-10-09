import { useAuth, useUser } from '@clerk/expo';
import { Redirect, router } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlanNumbers } from '@/components/onboarding/plan-numbers';

// Landing screen after sign-in, until the real Home is built.
export default function HomeScreen() {
  const s = useWindowDimensions().width / 402;
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <View className="flex-1 bg-white" />;
  if (!isSignedIn) return <Redirect href="/" />;

  const name = user?.firstName;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingHorizontal: 24 * s }}>
      <Text
        className="font-bold text-black"
        style={{ fontSize: 32 * s, lineHeight: 38 * s, marginTop: 40 * s, letterSpacing: -0.5 }}>
        {name ? `You’re all set,\n${name}` : 'You’re all set'}
      </Text>
      <Text className="text-neutral-700" style={{ fontSize: 16.5 * s, lineHeight: 24 * s, marginTop: 8 * s }}>
        Here’s your summary plan:
      </Text>

      <View style={{ marginTop: 56 * s }}>
        <PlanNumbers />
      </View>

      <View className="flex-1" />

      <Pressable
        onPress={async () => {
          await signOut();
          router.replace('/');
        }}
        className="items-center justify-center border border-neutral-300 active:opacity-80"
        style={{ height: 50 * s, borderRadius: 14 * s, marginBottom: insets.bottom + 20 * s }}>
        <Text className="font-semibold text-black" style={{ fontSize: 17 * s }}>
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}
