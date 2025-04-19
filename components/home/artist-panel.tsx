import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface DotPosition {
  x: number;
  y: number;
}

type PatternFunction = (dots: DotPosition[]) => number;

export default function ArtistPanel(): React.ReactElement {
  const [layout, setLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [dots, setDots] = useState<DotPosition[]>([]);
  const [brightDots, setBrightDots] = useState<Set<number>>(new Set());
  const patternIndex = useRef<number>(0);
  const intervalId = useRef<number | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const DOT_SIZE = 20;
  const SPACING = DOT_SIZE + 10;
  const PATTERN_DURATION = 5000;

  useEffect(() => {
    if (!layout.width || !layout.height) return;
    const w = layout.width;
    const h = layout.height;
    const countTop = Math.floor((w - DOT_SIZE) / SPACING) + 1;
    const countSide = Math.floor((h - DOT_SIZE) / SPACING) + 1;
    const stepX = (w - DOT_SIZE) / (countTop - 1);
    const stepY = (h - DOT_SIZE) / (countSide - 1);

    const newDots: DotPosition[] = [];
    for (let i = 0; i < countTop; i++) {
      newDots.push({ x: i * stepX, y: 0 });
    }
    for (let i = 0; i < countSide; i++) {
      newDots.push({ x: w - DOT_SIZE, y: i * stepY });
    }
    for (let i = 0; i < countTop; i++) {
      newDots.push({ x: i * stepX, y: h - DOT_SIZE });
    }
    for (let i = 0; i < countSide; i++) {
      newDots.push({ x: 0, y: i * stepY });
    }

    setDots(newDots);
  }, [layout, SPACING, DOT_SIZE]);

  const patterns = React.useMemo<PatternFunction[]>(() => [
    (all: DotPosition[]): number => {
      let idx = 0;
      return setInterval(() => {
        setBrightDots(new Set([idx]));
        idx = (idx + 1) % all.length;
      }, 100) as unknown as number;
    },
    (all: DotPosition[]): number => {
      let idx = 0, trail = 5;
      return setInterval(() => {
        const s = new Set<number>();
        for (let i = 0; i < trail; i++) s.add((idx + i) % all.length);
        setBrightDots(s);
        idx = (idx + 1) % all.length;
      }, 100) as unknown as number;
    },
    (all: DotPosition[]): number => setInterval(() => {
      const s = new Set<number>();
      for (let i = 0; i < all.length / 3; i++) {
        s.add(Math.floor(Math.random() * all.length));
      }
      setBrightDots(s);
    }, 300) as unknown as number,
    (all: DotPosition[]): number => {
      let on = false;
      return setInterval(() => {
        setBrightDots(on
          ? new Set<number>()
          : new Set<number>(all.map((_, i) => i))
        );
        on = !on;
      }, 500) as unknown as number;
    },
  ], []);

  useEffect(() => {
    if (dots.length === 0) return;
    if (intervalId.current) clearInterval(intervalId.current);
    if (timeoutId.current) clearTimeout(timeoutId.current);

    function startPattern(): void {
      intervalId.current = patterns[patternIndex.current](dots);
      timeoutId.current = setTimeout(() => {
        if (intervalId.current !== null) {
          clearInterval(intervalId.current);
        }
        patternIndex.current = (patternIndex.current + 1) % patterns.length;
        startPattern();
      }, PATTERN_DURATION);
    }
    startPattern();

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [dots, patterns, PATTERN_DURATION]);

  const handleLayout = (event: LayoutChangeEvent): void => {
    setLayout(event.nativeEvent.layout);
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.marquee}
        onLayout={handleLayout}
      >
        {dots.map((pos, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { left: pos.x, top: pos.y },
              brightDots.has(i) && styles.dotBright,
            ]}
          />
        ))}
        <View style={styles.content}>
          <Text style={styles.title}>
            Interested in the entertainment industry?
          </Text>
          <Text style={styles.date}>APRIL 10TH</Text>
          <Text style={styles.time}>7-9PM</Text>
          <Text style={styles.location}>Zoom link in bio</Text>
        </View>
      </View>
    </View>
  );
}

interface StylesType {
  container: ViewStyle;
  marquee: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  date: TextStyle;
  time: TextStyle;
  location: TextStyle;
  dot: ViewStyle;
  dotBright: ViewStyle;
}

const styles = StyleSheet.create<StylesType>({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marquee: {
    width: 400,
    height: 300,
    backgroundColor: '#C73A25',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    color: '#2E4172',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    color: '#2E4172',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  time: {
    color: '#2E4172',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  location: {
    color: '#2E4172',
    fontSize: 24,
    marginVertical: 10,
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F9E79F',
    zIndex: 1,
    shadowColor: '#F9E79F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  dotBright: {
    backgroundColor: '#fff',
    shadowColor: '#FFEB3B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
});
