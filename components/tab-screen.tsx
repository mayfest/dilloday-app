import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenBackground from './screen-background';

interface ScreenProps {
  children?: React.ReactNode;
}

export default function TabScreen({ children }: ScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={[styles.content, { marginBottom: tabBarHeight }]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faefde',
  },
  content: {
    flex: 1,
  },
});
