import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import type { UnitSystem } from '@/lib/nutrition';

export function UnitToggle({ value, onChange }: { value: UnitSystem; onChange: (u: UnitSystem) => void }) {
  const s = useWindowDimensions().width / 402;
  return (
    <View
      className="flex-row rounded-full bg-neutral-100"
      style={{ padding: 2 * s }}>
      {(['metric', 'imperial'] as const).map((u) => (
        <Pressable
          key={u}
          onPress={() => onChange(u)}
          className={value === u ? 'rounded-full bg-black' : 'rounded-full'}
          style={{ paddingHorizontal: 14 * s, paddingVertical: 5 * s }}>
          <Text
            className={value === u ? 'font-semibold text-white' : 'font-semibold text-neutral-600'}
            style={{ fontSize: 11 * s }}>
            {u === 'metric' ? 'kg' : 'lb'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
