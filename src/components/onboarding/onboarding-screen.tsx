import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  progress?: number; // 0..1, hidden when undefined
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  onNext: () => void;
  hideBack?: boolean;
  headerRight?: ReactNode;
  children: ReactNode;
};

export function OnboardingScreen({
  progress,
  title,
  subtitle,
  buttonLabel = 'Next',
  buttonDisabled,
  onNext,
  hideBack,
  headerRight,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const s = width / 402;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingHorizontal: 24 * s }}>
      <View className="flex-row items-center" style={{ height: 36 * s }}>
        {hideBack ? (
          <View style={{ width: 28 * s }} />
        ) : (
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 28 * s }}>
            <Ionicons name="arrow-back" size={24 * s} color="#000" />
          </Pressable>
        )}
        {progress !== undefined && (
          <View className="flex-row" style={{ marginLeft: 50 * s, gap: 7 * s }}>
            {[0, 1, 2, 3].map((i) => {
              const fill = Math.min(1, Math.max(0, progress * 4 - i));
              return (
                <View
                  key={i}
                  className="overflow-hidden rounded-full bg-neutral-200"
                  style={{ width: 41 * s, height: 3 * s }}>
                  <View className="h-full bg-black" style={{ width: `${fill * 100}%` }} />
                </View>
              );
            })}
          </View>
        )}
        {headerRight ? <View className="absolute right-0">{headerRight}</View> : null}
      </View>

      <Text
        className="font-bold text-black"
        style={{ fontSize: 32 * s, lineHeight: 38 * s, marginTop: 24 * s, letterSpacing: -0.5 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="text-neutral-700"
          style={{ fontSize: 16.5 * s, lineHeight: 24 * s, marginTop: 6 * s }}>
          {subtitle}
        </Text>
      ) : null}

      <View className="flex-1">{children}</View>

      <Pressable
        onPress={onNext}
        disabled={buttonDisabled}
        className="items-center justify-center bg-black active:opacity-80"
        style={{
          height: 50 * s,
          borderRadius: 14 * s,
          marginBottom: insets.bottom + 50 * s,
          opacity: buttonDisabled ? 0.3 : 1,
        }}>
        <Text className="font-semibold text-white" style={{ fontSize: 17 * s }}>
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}
