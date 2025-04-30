// AccordionItem.tsx
import React, { useRef, useState } from 'react';

import { Colors } from '@/constants/Colors';
import { highlightMatches } from '@/lib/faq-utils';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  content: string[];
  highlightText?: string;
}

export default function AccordionItem({
  title,
  content,
  highlightText = '',
}: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // One animated value for chevron rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;
  // One animated value for dropdown height
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const configureAnimation = () =>
    LayoutAnimation.create(
      300,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity
    );

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(configureAnimation());

    // Animate chevron rotate from 0 → 1 or 1 → 0
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (!isExpanded) {
      // Expand: animate height from 0 → contentHeight
      heightAnim.setValue(0);
      setIsExpanded(true);
      Animated.timing(heightAnim, {
        toValue: contentHeight,
        duration: 300,
        useNativeDriver: false, // height can't use native driver
      }).start();
    } else {
      // Collapse: animate height from contentHeight → 0
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(false);
      });
    }
  };

  // Interpolate rotateAnim for the chevron-right arrow (90° on expand)
  const spinRight = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.accordionContainer}>
      {/* Header */}
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.7}
        onPress={toggleAccordion}
      >
        <Text style={styles.accordionTitle}>
          {highlightText ? highlightMatches(title, highlightText) : title}
        </Text>
        <Animated.View
          style={[styles.chevron, { transform: [{ rotate: spinRight }] }]}
        >
          <FontAwesome6 name='chevron-right' size={16} color='#FFFFFF' />
        </Animated.View>
      </TouchableOpacity>

      {/* Hidden measurement view */}
      <View
        style={styles._measureContainer}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && h !== contentHeight) {
            setContentHeight(h);
          }
        }}
      >
        <View style={styles.accordionContent}>
          {content.map((para, idx) => (
            <Text key={idx} style={styles.paragraph}>
              {highlightText ? highlightMatches(para, highlightText) : para}
            </Text>
          ))}
        </View>
      </View>

      {/* Animated dropdown: height only */}
      {isExpanded && (
        <Animated.View
          style={[styles.accordionContentContainer, { height: heightAnim }]}
        >
          <View style={styles.accordionContent}>
            {content.map((para, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {highlightText ? highlightMatches(para, highlightText) : para}
              </Text>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  accordionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionContentContainer: {
    overflow: 'hidden',
  },
  accordionContent: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  paragraph: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 22,
  },
  _measureContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
});
