import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  height?: number;
};

export function OptionCard({ icon, title, description, selected, onPress, height = 72 }: Props) {
  const s = useWindowDimensions().width / 402;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white"
      style={{
        minHeight: height * s,
        paddingVertical: 10 * s,
        borderRadius: 14 * s,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? '#000' : '#E5E5E5',
        paddingHorizontal: 28 * s,
        shadowColor: '#000',
        shadowOpacity: selected ? 0.12 : 0.03,
        shadowRadius: selected ? 8 : 4,
        shadowOffset: { width: 0, height: 2 },
      }}>
      <Ionicons name={icon} size={30 * s} color="#111" style={{ width: 68 * s }} />
      <View className="flex-1" style={{ marginLeft: 6 * s }}>
        <Text className="font-semibold text-black" style={{ fontSize: 17 * s }}>
          {title}
        </Text>
        {description ? (
          <Text className="text-neutral-500" style={{ fontSize: 13 * s, marginTop: 3 * s }}>
            {description}
          </Text>
        ) : null}
      </View>
      {selected && (
        <View
          className="items-center justify-center rounded-full bg-black"
          style={{ width: 30 * s, height: 30 * s }}>
          <Ionicons name="checkmark" size={19 * s} color="#fff" />
        </View>
      )}
    </Pressable>
  );
}
