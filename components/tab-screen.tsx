import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children?: React.ReactNode;
}

export default function TabScreen({ children }: ScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Image
          source={require('../assets/images/off-white.png')}
          style={styles.image}
          resizeMode='cover'
        />
      </View>
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
});
