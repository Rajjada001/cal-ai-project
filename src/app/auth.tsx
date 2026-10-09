import { useSSO } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Provider = 'oauth_apple' | 'oauth_google';

export default function AuthScreen() {
  const s = useWindowDimensions().width / 402;
  const insets = useSafeAreaInsets();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (strategy: Provider) => {
    setError(null);
    setLoading(strategy);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      // No session means the user closed the browser sheet; that is not an error.
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/home');
      }
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingHorizontal: 24 * s }}>
      <View className="justify-center" style={{ height: 36 * s }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 28 * s }}>
          <Ionicons name="arrow-back" size={24 * s} color="#000" />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center">
        <Image
          source={require('@/assets/images/logo-dark.png')}
          style={{ width: 120 * s, height: 120 * s }}
          contentFit="contain"
        />
        <Text
          className="text-center font-bold text-black"
          style={{ fontSize: 32 * s, lineHeight: 38 * s, marginTop: 24 * s, letterSpacing: -0.5 }}>
          {'Save your plan'}
        </Text>
        <Text
          className="text-center text-neutral-700"
          style={{ fontSize: 16.5 * s, lineHeight: 24 * s, marginTop: 10 * s }}>
          {'Create an account to keep your plan\nand start tracking your meals.'}
        </Text>
      </View>

      <View style={{ gap: 12 * s, marginBottom: insets.bottom + 20 * s }}>
        {error ? (
          <Text className="text-center text-red-600" style={{ fontSize: 14 * s }}>
            {error}
          </Text>
        ) : null}

        <Pressable
          onPress={() => signIn('oauth_apple')}
          disabled={loading !== null}
          className="flex-row items-center justify-center bg-black active:opacity-80"
          style={{ height: 52 * s, borderRadius: 14 * s, opacity: loading && loading !== 'oauth_apple' ? 0.5 : 1 }}>
          {loading === 'oauth_apple' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-apple" size={22 * s} color="#fff" style={{ marginRight: 10 * s }} />
              <Text className="font-semibold text-white" style={{ fontSize: 17 * s }}>
                Continue with Apple
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={() => signIn('oauth_google')}
          disabled={loading !== null}
          className="flex-row items-center justify-center border border-neutral-300 bg-white active:opacity-80"
          style={{ height: 52 * s, borderRadius: 14 * s, opacity: loading && loading !== 'oauth_google' ? 0.5 : 1 }}>
          {loading === 'oauth_google' ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Image
                source={require('@/assets/images/google-g.svg')}
                style={{ width: 20 * s, height: 20 * s, marginRight: 10 * s }}
                contentFit="contain"
              />
              <Text className="font-semibold text-black" style={{ fontSize: 17 * s }}>
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>

        <Text className="text-center text-neutral-500" style={{ fontSize: 12.5 * s, lineHeight: 18 * s, marginTop: 6 * s }}>
          {'By continuing you agree to our Terms of Service\nand Privacy Policy.'}
        </Text>
      </View>
    </View>
  );
}
