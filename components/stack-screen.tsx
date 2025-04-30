import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ScreenBackground from './screen-background';

interface ScreenProps {
  children?: React.ReactNode;
}

export default function StackScreen({ children }: ScreenProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.screen}>
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => router.back()}
          >
            <FontAwesome6
              name='chevron-left'
              size={16}
              color={Colors.light.background}
            />
            <Text style={styles.navigationButtonText}>BACK</Text>
          </TouchableOpacity>
        </View>
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
  screen: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});
