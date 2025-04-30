import { Colors } from '@/constants/Colors';
import { toastConfig } from '@/lib/toast';
import { FontAwesome6 } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface ScreenProps {
  children?: React.ReactNode;
  closeRoute?: Href;
}

export default function ModalScreen({ children, closeRoute }: ScreenProps) {
  const router = useRouter();

  const handleClose = () => {
    if (closeRoute) {
      router.push(closeRoute);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navigationButton} onPress={handleClose}>
          <Text style={styles.navigationButtonText}>CLOSE</Text>
          <FontAwesome6 name='xmark' size={16} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      {children}
      <Toast topOffset={32} config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.light.text,
  },
  navigationBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    fontWeight: '400',
  },
});
