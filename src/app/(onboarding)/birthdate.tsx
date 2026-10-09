import { router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Wheel } from '@/components/onboarding/wheel';
import { useOnboarding } from '@/store/onboarding';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 87 }, (_, i) => String(THIS_YEAR - 13 - i));

const pad = (n: number) => String(n).padStart(2, '0');

export default function BirthdateScreen() {
  const s = useWindowDimensions().width / 402;
  const birthdate = useOnboarding((st) => st.birthdate);
  const set = useOnboarding((st) => st.set);

  const [y, m, d] = birthdate.split('-').map(Number);
  const yearIndex = Math.max(0, YEARS.indexOf(String(y)));
  const daysInMonth = new Date(y, m, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  const update = (year: number, month: number, day: number) => {
    const max = new Date(year, month, 0).getDate();
    set({ birthdate: `${year}-${pad(month)}-${pad(Math.min(day, max))}` });
  };

  return (
    <OnboardingScreen
      progress={2 / 9}
      title={'When were you\nborn?'}
      subtitle={'Your age helps us calculate your\ncalorie needs.'}
      onNext={() => router.push('/(onboarding)/height')}>
      <View className="flex-row justify-center" style={{ marginTop: 56 * s }}>
        <Wheel items={MONTHS} index={m - 1} width={130} onChange={(i) => update(y, i + 1, d)} />
        <Wheel items={days} index={d - 1} width={70} onChange={(i) => update(y, m, i + 1)} />
        <Wheel items={YEARS} index={yearIndex} width={90} onChange={(i) => update(Number(YEARS[i]), m, d)} />
      </View>
    </OnboardingScreen>
  );
}
