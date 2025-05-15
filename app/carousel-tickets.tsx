// CarouselPartnerPage.tsx
import React from 'react';

// Asset imports
import BalloonLogoPink from '@/assets/images/balloonlogopink.svg';
import LineLeapLogo from '@/assets/images/company-logos/line-leap-logo.png';
import CarouselTicketsBanner from '@/components/banners/carousel-tickets-banner';
import CarouselIcon from '@/components/carousel-tickets/carousel-icon';
import SparkleRed from '@/components/carousel-tickets/sparkle-red';
import DrawerScreen from '@/components/drawer-screen';
import AccordionItem from '@/components/faq/accordion-item';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IOS_URL = 'https://apps.apple.com/us/app/lineleap/id960804043';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=io.Lineleap';

// FAQ-style steps
const STEPS = [
  {
    title: 'Install & Open LineLeap',
    content: [
      'Download and install the LineLeap app from the App Store or Google Play.',
      'Open the app to get started.',
    ],
  },
  {
    title: 'Create Your Free Account',
    content: [
      "Tap 'Sign Up' and enter your email and a secure password.",
      'Verify your email address if prompted.',
    ],
  },
  {
    title: 'Find Dillo Day 2025',
    content: [
      'Use the search bar at the top of the LineLeap app.',
      "Type 'Dillo Day 2025' and select our event from the list.",
    ],
  },
  {
    title: 'Claim Your Carousel Pass',
    content: [
      'Browse available time slots and pick one you like.',
      "Tap 'Get Pass' to reserve your free carousel time-slot.",
    ],
  },
];

export default function CarouselPartnerPage() {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const iconSize = width * 0.6;

  const openLink = (url: string) =>
    Linking.openURL(url).catch(() => console.warn('Could not open URL:', url));

  return (
    <DrawerScreen banner={<CarouselTicketsBanner />}>
      <StatusBar style='dark' />
      <ScrollView
        contentContainerStyle={[styles.wrapper, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backgroundContainer}>
          {/* Sparkles */}
          {[
            styles.sparkleTL,
            styles.sparkleTR,
            styles.sparkleBL,
            styles.sparkleBR,
            styles.sparkleM1,
            styles.sparkleM2,
          ].map((pos, i) => (
            <View key={i} style={[styles.sparkleWrapper, pos]}>
              <SparkleRed />
            </View>
          ))}

          {/* Carousel Icon */}
          <View style={{ marginTop: -iconSize * 0.4 }}>
            <CarouselIcon width={iconSize} height={iconSize} />
          </View>

          {/* Logos */}
          <View style={styles.partnerHeader}>
            <BalloonLogoPink width={90} height={90} />
            <Text style={styles.partnerX}>×</Text>
            <Image
              source={LineLeapLogo}
              style={styles.lineLeapLogo}
              resizeMode='contain'
            />
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            {STEPS.map((step, idx) => (
              <AccordionItem
                key={idx}
                title={step.title}
                content={step.content}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.iosButton]}
              onPress={() => openLink(IOS_URL)}
            >
              <Text style={styles.buttonText}>Download on the App Store</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.androidButton]}
              onPress={() => openLink(ANDROID_URL)}
            >
              <Text style={styles.buttonText}>Get it on Google Play</Text>
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            📢 Paid partnership with LineLeap. You will now leave Dillo Day to
            reserve your carousel pass. Please follow FTC guidelines.
          </Text>
        </View>
      </ScrollView>
    </DrawerScreen>
  );
}

const SPARKLE_SCALE = 1.0;
const styles = StyleSheet.create({
  wrapper: { flexGrow: 1 },
  backgroundContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sparkleWrapper: {
    position: 'absolute',
    transform: [{ scale: SPARKLE_SCALE }],
    opacity: 0.3,
  },
  sparkleTL: { top: 10, left: 15 },
  sparkleTR: { top: 40, right: 15 },
  sparkleBL: { bottom: 60, left: 25 },
  sparkleBR: { bottom: 20, right: 35 },
  sparkleM1: { top: 150, left: 60 },
  sparkleM2: { bottom: 120, right: 70 },

  partnerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    // ensure uniform container height for perfect centering
    height: 100,
  },
  partnerX: {
    fontSize: 36,
    fontWeight: '700',
    marginHorizontal: 6,
    color: Colors.light.text,
  },
  lineLeapLogo: {
    width: 70,
    height: 70,
  },

  stepsContainer: { width: '100%', marginTop: 8 },

  buttonsContainer: { width: '100%', marginTop: 24 },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  iosButton: { backgroundColor: '#0070c9' },
  androidButton: { backgroundColor: '#3bcc5a' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  disclaimer: {
    fontSize: 14,
    color: Colors.dark.muted,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 20,
  },
});
