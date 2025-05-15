import DilloSonaStackScreen from '@/components/dillo-sona-screen';
import { useDilloSona } from '@/contexts/dillo-sona-context';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BallSvg from '@/assets/dillo-sonas/ball.svg';
import LinesSvg from '@/assets/dillo-sonas/lines-background.svg';
import SmokeSvg from '@/assets/dillo-sonas/smoke.svg';

import TheChariot from '@/components/dillosonas/cards/the-chariot';
import TheFool from '@/components/dillosonas/cards/the-fool';
import TheLovers from '@/components/dillosonas/cards/the-lovers';
import TheMoon from '@/components/dillosonas/cards/the-moon';
import TheSun from '@/components/dillosonas/cards/the-sun';

export default function ResultScreen() {
  const { tally, skipLoading, setSkipLoading } = useDilloSona();
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  // pick winner
  const winner = (Object.keys(tally) as Array<keyof typeof tally>).reduce(
    (a, b) => (tally[a] >= tally[b] ? a : b)
  );
  const CardComponent = {
    moon: TheMoon,
    sun: TheSun,
    chariot: TheChariot,
    lovers: TheLovers,
    fool: TheFool,
  }[winner];

  // animations
  const [loading, setLoading] = useState(!skipLoading);
  const loadOpacity = useRef(new Animated.Value(skipLoading ? 0 : 0)).current;
  const resultOpacity = useRef(new Animated.Value(skipLoading ? 1 : 0)).current;

  useEffect(() => {
    if (skipLoading) {
      loadOpacity.setValue(0);
      resultOpacity.setValue(1);
      setLoading(false);
      return;
    }

    // 1️⃣ wait 500ms, then fade in loader
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(loadOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // 2️⃣ after 3s (you can adjust this) plus the 500ms above, cross-fade...
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(loadOpacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(resultOpacity, {
          toValue: 1,
          duration: 600,
          delay:   200,
          easing:  Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setLoading(false);
        setSkipLoading(true);
      });
    }, 3000 + 500);

    return () => clearTimeout(timer);
  }, [skipLoading]);


  const onMeaningPress = () => {
    router.push('/modal/meaning');
  };

  return (
    <DilloSonaStackScreen>
      <View style={styles.wrapper}>
        {/* Loading */}
        <Animated.View
          pointerEvents={loading ? 'auto' : 'none'}
          style={[styles.loadingContainer, { opacity: loadOpacity }]}
        >
          <LinesSvg
            width={width}
            height={height}
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="xMidYMid slice"
          />
          <View style={styles.loadingContent}>
            <BallSvg width={300} height={300} />
            <Text style={styles.loadingText}>
              unlocking your{'\n'}dilloFUTURE
            </Text>
          </View>
        </Animated.View>

        {/* Result */}
        <Animated.View
          pointerEvents={loading ? 'none' : 'auto'}
          style={[styles.resultContainer, { opacity: resultOpacity }]}
        >
          <SmokeSvg
            width={width}
            height={height}
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="xMidYMid slice"
          />

          <View style={styles.content}>
            <View style={styles.cardGraphic}>
              <CardComponent />
            </View>

            <TouchableOpacity
              style={styles.meaningButton}
              activeOpacity={0.8}
              onPress={onMeaningPress}
            >
              <Text style={styles.meaningButtonText}>
                what does this mean?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </DilloSonaStackScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, position: 'relative', backgroundColor: '#5B004F' },

  // Loader styles
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 24,
    color: '#DDD',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    fontFamily: 'SofiaSansCondensed_700Bold',
    letterSpacing: 2,
  },

  resultContainer: { ...StyleSheet.absoluteFillObject },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGraphic: { marginBottom: 16 },
  meaningButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#3B0434',
    borderRadius: 8,
  },
  meaningButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 3,
  },
});
