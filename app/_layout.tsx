import { useEffect } from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          screenOptions={{
            headerShown: false,
            drawerType: 'front',
            drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            drawerInactiveTintColor:
              Colors[colorScheme ?? 'light'].tabIconDefault,
            drawerItemStyle: { paddingLeft: 16 },
            drawerStyle: {
              paddingTop: 40,
              width: '70%',
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            },
          }}
        >
          <Drawer.Screen
            name='(tabs)'
            options={{
              drawerLabel: 'Home',
              title: 'Home',
              drawerIcon: ({ color }) => (
                <FontAwesome6 name='house-chimney' size={20} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name='faq'
            options={{
              drawerLabel: 'FAQ',
              title: 'FAQ',
              drawerIcon: ({ color }) => (
                <FontAwesome6 name='question-circle' size={20} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name='(drawer)'
            options={{
              drawerLabel: 'Shop',
              title: 'Shop',
              drawerIcon: ({ color }) => (
                <FontAwesome6 name='shopping-bag' size={20} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name='settings'
            options={{
              drawerLabel: 'Settings',
              title: 'Settings',
              drawerIcon: ({ color }) => (
                <FontAwesome6 name='gear' size={20} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name='+not-found'
            options={{
              drawerItemStyle: { display: 'none' },
              title: '404',
            }}
          />
        </Drawer>
        <StatusBar style='auto' />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
