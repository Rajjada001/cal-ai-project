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
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** a label is drawn next to every tick whose index is a multiple of this */
  gap?: number;
  labelEvery: number;
  /** a longer tick is drawn every this many ticks */
  majorEvery: number;
  formatLabel?: (value: number) => string;
};

const HEIGHT = 250;

// Vertical ruler: larger values at the top, the centre dot marks the selected value.
export function Ruler({ min, max, step, value, onChange, gap: gapProp = 12, labelEvery, majorEvery, formatLabel }: Props) {
  const s = useWindowDimensions().width / 402;
  const gap = gapProp * s;
  const height = HEIGHT * s;
  const count = Math.round((max - min) / step);
  const lastIndex = useRef(-1);
  const initialOffset = ((max - value) / step) * gap;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.min(count, Math.max(0, Math.round(e.nativeEvent.contentOffset.y / gap)));
    if (index === lastIndex.current) return;
    lastIndex.current = index;
    onChange(Math.round((max - index * step) / step) * step);
  };

  return (
    <View style={{ height, alignSelf: 'stretch', alignItems: 'center' }}>
      <ScrollView
        style={{ height, width: 260 * s }}
        showsVerticalScrollIndicator={false}
        snapToInterval={gap}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: initialOffset }}
        onScroll={onScroll}
        contentContainerStyle={{ paddingVertical: height / 2 - gap / 2 }}>
        {Array.from({ length: count + 1 }, (_, i) => {
          const v = max - i * step;
          const major = i % majorEvery === 0;
          return (
            <View key={i} style={{ height: gap, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 260 * s, alignItems: 'center' }}>
                <View
                  style={{
                    height: 1.5,
                    width: (major ? 16 : 9) * s,
                    backgroundColor: major ? '#BDBDBD' : '#DADADA',
                  }}
                />
              </View>
              {i % labelEvery === 0 && (
                <Text
                  className="text-neutral-700"
                  style={{ fontSize: 15 * s, position: 'absolute', left: 229 * s }}>
                  {formatLabel ? formatLabel(v) : String(Math.round(v * 10) / 10)}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: height / 2 - 8 * s, width: 164 * s, left: '50%', marginLeft: -82 * s }}>
        <View style={{ height: 2, backgroundColor: '#000', top: 8 * s }} />
        <View
          style={{
            position: 'absolute',
            left: 74 * s,
            width: 16 * s,
            height: 16 * s,
            borderRadius: 8 * s,
            backgroundColor: '#000',
          }}
        />
      </View>
    </View>
  );
}
