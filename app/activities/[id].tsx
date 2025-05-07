import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { useLocalSearchParams } from 'expo-router';
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

const { width } = Dimensions.get('window');

export default function SponsorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sponsor = SPONSOR_BOOTHS.find(
    (s) => s.name.replace(/\s+/g, '-').toLowerCase() === id
  );

  if (!sponsor) return null;

  const handleVisitWebsite = () => {
    if (sponsor.url) {
      Linking.openURL(sponsor.url);
    }
  };

  return (
    <StackScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={sponsor.logo} style={styles.hero} resizeMode='contain' />
        <Text style={styles.title}>{sponsor.name}</Text>

        <View style={styles.divider} />

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>{sponsor.activity.name}</Text>
          <Text style={styles.description}>{sponsor.activity.description}</Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Location:</Text>
            <Text style={styles.locationValue}>
              {sponsor.activity.location}
            </Text>
          </View>

          {sponsor.url && (
            <TouchableOpacity
              style={styles.websiteButton}
              onPress={handleVisitWebsite}
            >
              <Text style={styles.websiteButtonText}>Visit Website</Text>
            </TouchableOpacity>
          )}

          <View style={styles.imageContainer}>
            <Image
              source={sponsor.activity.image}
              style={styles.activityImage}
              resizeMode='cover'
            />
          </View>
        </View>
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  hero: {
    width: width - 48,
    height: (width - 48) * 0.5,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.text,
    marginVertical: 16,
  },
  activityContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
    marginBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 8,
  },
  locationValue: {
    fontSize: 16,
    color: Colors.light.text,
  },
  websiteButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
});
