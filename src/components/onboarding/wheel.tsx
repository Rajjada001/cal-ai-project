import { useRef } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type Props = {
  items: string[];
  index: number;
  onChange: (index: number) => void;
  width: number;
};

const ITEM = 48;
const VISIBLE = 5;

export function Wheel({ items, index, onChange, width }: Props) {
  const s = useWindowDimensions().width / 402;
  const item = ITEM * s;
  const last = useRef(index);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.min(items.length - 1, Math.max(0, Math.round(e.nativeEvent.contentOffset.y / item)));
    if (i !== last.current) {
      last.current = i;
      onChange(i);
    }
  };

  return (
    <View style={{ height: item * VISIBLE, width: width * s }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={item}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: index * item }}
        onScroll={onScroll}
        contentContainerStyle={{ paddingVertical: item * 2 }}>
        {items.map((label, i) => (
          <View key={label} style={{ height: item, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              className={i === index ? 'font-bold text-black' : 'text-neutral-400'}
              style={{ fontSize: (i === index ? 22 : 18) * s }}>
              {label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
