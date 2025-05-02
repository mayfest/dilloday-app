import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { FOOD_TRUCKS } from '@/constants/food-trucks';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function FoodTrucksScreen() {
  const router = useRouter();

  return (
    <StackScreen>
      <FlatList
        data={FOOD_TRUCKS}
        keyExtractor={(t) => t.id}
        numColumns={2}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/food-trucks/${item.id}`)}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={item.logo}
                style={styles.logo}
                resizeMode='contain'
              />
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: CARD_MARGIN,
    paddingBottom: CARD_MARGIN * 2,
  },
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logoWrapper: {
    width: CARD_WIDTH * 0.8,
    height: CARD_WIDTH * 0.5,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logo: { width: '90%', height: '90%' },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
});
