import { useEffect, useState } from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Asset } from 'expo-asset';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children?: React.ReactNode;
}

export default function TabScreen({ children }: ScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const preloadImage = async () => {
      try {
        await Asset.fromModule(
          require('../assets/images/off-white.png')
        ).downloadAsync();
        setIsImageLoaded(true);
      } catch (error) {
        console.error('Error preloading image:', error);
        setIsImageLoaded(true);
      }
    };

    preloadImage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Image
          source={require('../assets/images/off-white.png')}
          style={styles.image}
          resizeMode='cover'
          defaultSource={require('../assets/images/off-white.png')}
          onLoad={() => setIsImageLoaded(true)}
        />
      </View>
      <SafeAreaView
        style={[
          styles.content,
          { marginBottom: tabBarHeight },
          !isImageLoaded && styles.contentHidden,
        ]}
      >
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
    backgroundColor: '#faefde',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  contentHidden: {
    opacity: 0,
  },
});
