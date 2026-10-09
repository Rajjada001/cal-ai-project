import { Text, View, useWindowDimensions } from 'react-native';

export function ValueDisplay({ value, unit }: { value: string; unit: string }) {
  const s = useWindowDimensions().width / 402;
  return (
    <View className="flex-row items-baseline justify-center" style={{ marginTop: 31 * s, marginBottom: 19 * s }}>
      <Text className="font-bold text-black" style={{ fontSize: 48 * s, letterSpacing: -1 }}>
        {value}
      </Text>
      <Text className="text-neutral-700" style={{ fontSize: 16 * s, marginLeft: 8 * s }}>
        {unit}
      </Text>
    </View>
  );
}
