import { useEffect } from 'react';

import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import {
  CENTER,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  RADIUS,
} from '@/constants/circle-reel';
import { Image, StyleSheet, View } from 'react-native';
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

interface CircularReelProps {
  images: string[];
  size: number;
}

interface CenterLogoProps {
  size: number;
}

export function CircularReel({ images, size }: CircularReelProps) {
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
  }, [autoRotation]); // Added autoRotation to dependencies

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value + autoRotation.value}rad` }],
  }));

  return (
    <View style={[styles.reelContainer, { width: size, height: size }]}>
      <View
        style={[
          styles.backgroundCircle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            styles.rotatingContainer,
            { width: size, height: size },
            rotatingStyle,
          ]}
        >
          {images.map((uri: string, index: number) => {
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
      <CenterLogo size={size} />
    </View>
  );
}

function CenterLogo({ size }: CenterLogoProps) {
  const outerSize = size * 0.45;
  const innerSize = size * 0.4167;
  const logoSize = size * 0.35;

  return (
    <View
      style={[
        styles.centerLogoOuter,
        { width: outerSize, height: outerSize, borderRadius: outerSize / 2 },
      ]}
    >
      <View
        style={[
          styles.centerLogoInner,
          { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
        ]}
      >
        <BalloonLogo width={logoSize} height={logoSize} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    backgroundColor: '#991B1B',
    zIndex: 0,
  },
  rotatingContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  image: {
    position: 'absolute',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 16,
  },
  centerLogoOuter: {
    position: 'absolute',
    backgroundColor: '#7f1d1d',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerLogoInner: {
    backgroundColor: '#faefde',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
