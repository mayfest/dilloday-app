import { CircularReel } from '@/components/swsh-integration/circle-reel';
import { CurvedHeader } from '@/components/swsh-integration/curved-text-view';
import { SwshRedirectButton } from '@/components/swsh-integration/swsh-redirect-button';
import TabScreen from '@/components/tab-screen';
import { REEL_SIZE } from '@/constants/circle-reel';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const images = Array.from(
  { length: 10 },
  (_, i) => `https://picsum.photos/200?${i + 1}`
);

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <TabScreen>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <CurvedHeader text='DILLO DAY x SWSH' size={REEL_SIZE} />
        <CircularReel images={images} size={REEL_SIZE} />
        <SwshRedirectButton
          text='Add your Dillo Day pics to Swsh!'
          url='https://www.joinswsh.com/album/pg5rftklzxfb'
        />
        <StatusBar style='dark' />
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faefde',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
