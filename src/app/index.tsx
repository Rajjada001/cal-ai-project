import { useAuth } from '@clerk/expo';
import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Design reference width (iPhone 17 Pro, in points). Sizes below are in this space.
const DESIGN_WIDTH = 402;

// Phone bounds inside welcome-screen-ui-demo-img.png (1024x1536, transparent padding).
const PHONE_BOUNDS = { x: 215, y: 95, width: 595, height: 1185 };
const DEMO_IMAGE = { width: 1024, height: 1536 };

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = width / DESIGN_WIDTH;
  const { isLoaded, isSignedIn } = useAuth();

  const phoneWidth = 222 * s;
  const phoneHeight = (phoneWidth * PHONE_BOUNDS.height) / PHONE_BOUNDS.width;
  const imageScale = phoneWidth / PHONE_BOUNDS.width;

  if (!isLoaded) return <View className="flex-1 bg-white" />;
  if (isSignedIn) return <Redirect href="/home" />;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-center" style={{ marginTop: 18 * s }}>
        <Image
          source={require('@/assets/images/logo-dark.png')}
          style={{ width: 62 * s, height: 62 * s }}
          contentFit="contain"
        />
        <Text
          className="font-bold text-black"
          style={{ fontSize: 32 * s, marginLeft: 6 * s, letterSpacing: -0.5 }}>
          Bulky AI
        </Text>
      </View>

      <View
        className="self-center overflow-hidden"
        style={{ width: phoneWidth, height: phoneHeight, marginTop: 9 * s }}>
        <Image
          source={require('@/assets/images/welcome-screen-ui-demo-img.png')}
          style={{
            position: 'absolute',
            left: -PHONE_BOUNDS.x * imageScale,
            top: -PHONE_BOUNDS.y * imageScale,
            width: DEMO_IMAGE.width * imageScale,
            height: DEMO_IMAGE.height * imageScale,
          }}
          contentFit="fill"
        />
      </View>

      <Text
        className="text-center font-bold text-black"
        style={{ fontSize: 32.4 * s, lineHeight: 37 * s, marginTop: 30 * s, letterSpacing: -0.5 }}>
        {'Calorie tracking\nmade easy'}
      </Text>
      <Text
        className="text-center text-neutral-700"
        style={{ fontSize: 14.4 * s, lineHeight: 19.3 * s, marginTop: 4 * s }}>
        {'Scan meals, track calories and build\nhealthy habits with AI.'}
      </Text>

      <View className="flex-1" />

      <Pressable
        onPress={() => router.push('/(onboarding)/sex')}
        className="flex-row items-center justify-center self-center rounded-full bg-black active:opacity-80"
        style={{ width: 348 * s, height: 46 * s }}>
        <Text className="font-semibold text-white" style={{ fontSize: 17 * s }}>
          Get Started
        </Text>
        <Text className="absolute text-white" style={{ right: 20 * s, fontSize: 24 * s }}>
          →
        </Text>
      </Pressable>

      <Text
        onPress={() => router.push('/auth')}
        className="text-center text-neutral-800"
        style={{ fontSize: 16 * s, marginTop: 14 * s, marginBottom: insets.bottom + 7 * s }}>
        Already have an account? <Text className="font-bold text-black">Sign In</Text>
      </Text>
    </View>
  );
}
