import { useEffect } from 'react';

import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import CurvedText from '@/components/swsh-integration/curved-text';
import TabScreen from '@/components/tab-screen';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const REEL_SIZE = width * 0.9;
const CENTER = REEL_SIZE / 2;
const IMAGE_WIDTH = REEL_SIZE * 0.15625;
const IMAGE_HEIGHT = REEL_SIZE * 0.20833;
const RADIUS = CENTER - REEL_SIZE * 0.1375;

const images = Array.from(
  { length: 10 },
  (_, i) => `https://picsum.photos/200?${i + 1}`
);

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);
  const autoRotation = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      rotation.value -= event.translationX / 800;
    },
    onEnd: (event) => {
      rotation.value = withDecay({
        velocity: -event.velocityX / 1000,
        deceleration: 0.9999,
      });
    },
  });

  useEffect(() => {
    autoRotation.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: 30000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value + autoRotation.value}rad` }],
  }));

  return (
    <TabScreen>
      <View
        style={{
          flex: 1,
          backgroundColor: '#faefde',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <View
          style={{
            width: REEL_SIZE,
            alignItems: 'center',
            marginBottom: -140,
            zIndex: 5,
          }}
        >
          <CurvedText
            text='DILLO DAY x SWSH'
            fontSize={REEL_SIZE * 0.10417}
            radius={CENTER - REEL_SIZE * 0.01}
            textColor='#000000'
            position='top'
          />
        </View>
        <View
          style={{
            width: REEL_SIZE,
            height: REEL_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: REEL_SIZE,
              height: REEL_SIZE,
              borderRadius: CENTER,
              backgroundColor: '#991B1B',
              zIndex: 0,
            }}
          />
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: REEL_SIZE,
                  height: REEL_SIZE,
                  zIndex: 1,
                },
                rotatingStyle,
              ]}
            >
              {images.map((uri, index) => {
                const angle = (index / images.length) * 2 * Math.PI;
                const x = CENTER + RADIUS * Math.cos(angle) - IMAGE_WIDTH / 2;
                const y = CENTER + RADIUS * Math.sin(angle) - IMAGE_HEIGHT / 2;
                const staticRotation = (angle * 180) / Math.PI - 90;
                return (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={[
                      styles.image,
                      {
                        left: x,
                        top: y,
                        transform: [{ rotate: `${staticRotation}deg` }],
                      },
                    ]}
                  />
                );
              })}
            </Animated.View>
          </PanGestureHandler>
          <View
            style={{
              position: 'absolute',
              width: REEL_SIZE * 0.45,
              height: REEL_SIZE * 0.45,
              borderRadius: (REEL_SIZE * 0.45) / 2,
              backgroundColor: '#7f1d1d',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <View
              style={{
                width: REEL_SIZE * 0.4167,
                height: REEL_SIZE * 0.4167,
                borderRadius: (REEL_SIZE * 0.4167) / 2,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BalloonLogo width={REEL_SIZE * 0.35} height={REEL_SIZE * 0.35} />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: '#FCD34D',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
          onPress={() =>
            Linking.openURL('https://www.joinswsh.com/album/pg5rftklzxfb')
          }
        >
          <Text style={{ color: '#000', fontWeight: 'bold' }}>
            Add your Dillo Day pics to Swsh!
          </Text>
        </TouchableOpacity>

        <StatusBar style='dark' />
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 16,
  },
});
