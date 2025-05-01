// components/tab-screen.tsx
import React from 'react';

import GlobalNavWrapper from '@/components/navigation-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenBackground from './screen-background';

interface ScreenProps {
  children?: React.ReactNode;
  hideNavBar?: boolean;
}

export default function TabScreen({
  children,
  hideNavBar = false,
}: ScreenProps) {
  return (
    <GlobalNavWrapper hideNavBar={hideNavBar}>
      <View style={styles.container}>
        <ScreenBackground />
        <SafeAreaView style={styles.content}>{children}</SafeAreaView>
      </View>
    </GlobalNavWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faefde',
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Add padding to account for the floating tab bar
  },
});
