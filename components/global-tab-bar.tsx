import React from 'react';

import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import { FontAwesome6 } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type TabRoute = {
  key: string;
  name: string;
  icon: string;
  path: string | null;
};

export default function GlobalTabBar() {
  const router = useRouter();
  const navigation = useNavigation();
  const pathname = usePathname();

  const tabRoutes: TabRoute[] = [
    { key: 'more', name: 'more', icon: 'ellipsis', path: null },
    { key: 'schedule', name: 'schedule', icon: 'calendar', path: '/schedule' },
    { key: 'index', name: 'index', icon: 'house-chimney', path: '/' },
    { key: 'map', name: 'map', icon: 'map', path: '/map' },
    {
      key: 'information',
      name: 'information',
      icon: 'circle-info',
      path: '/information',
    },
  ];

  const getIsActive = (path: string | null): boolean => {
    if (!path) return false;
    return pathname === path;
  };

  const handlePress = (route: TabRoute): void => {
    if (route.name === 'more') {
      // Try different approaches to open the drawer
      const parent = navigation.getParent();
      if (parent?.dispatch) {
        parent.dispatch(DrawerActions.openDrawer());
        return;
      }

      // Use DrawerActions instead of directly accessing openDrawer
      try {
        navigation.dispatch(DrawerActions.openDrawer());
        return;
      } catch (e) {
        console.log('Failed to open drawer with dispatch', e);
      }

      let current = navigation;
      while (current?.getParent) {
        current = current.getParent();
        if (current?.dispatch) {
          current.dispatch(DrawerActions.openDrawer());
          return;
        }
      }

      // If all else fails, navigate to a drawer screen if you have one
      // Replace '/drawer' with a valid route in your application
      // Or implement another fallback strategy
      router.push('/menu' as any); // Use a valid route in your app, casting as any for now
    } else if (route.path) {
      router.push(route.path);
    }
  };

  return (
    <View style={styles.container}>
      {tabRoutes.map((route) => (
        <TouchableOpacity
          key={route.key}
          style={styles.tabButton}
          onPress={() => handlePress(route)}
        >
          <View
            style={[
              styles.iconContainer,
              getIsActive(route.path) && styles.activeIconContainer,
            ]}
          >
            {route.name === 'index' ? (
              <BalloonLogo width={32} height={32} />
            ) : (
              <FontAwesome6
                name={route.icon}
                size={18}
                color={getIsActive(route.path) ? '#173885' : '#F6F2A3'}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#173885',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: '#F6F2A3',
    borderRadius: 20,
  },
});
