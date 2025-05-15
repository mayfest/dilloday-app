import React from 'react';

import DilloSonaStackScreen from '@/components/dillo-sona-screen';
import TheChariot from '@/components/dillosonas/cards/the-chariot';
import TheFool from '@/components/dillosonas/cards/the-fool';
import TheLovers from '@/components/dillosonas/cards/the-lovers';
import TheMoon from '@/components/dillosonas/cards/the-moon';
import TheSun from '@/components/dillosonas/cards/the-sun';
import { useDilloSona } from '@/contexts/dillo-sona-context';
import { StyleSheet, View } from 'react-native';

export default function ResultScreen() {
  const { tally } = useDilloSona();

  const winner = (Object.keys(tally) as Array<keyof typeof tally>).reduce(
    (a, b) => (tally[a] >= tally[b] ? a : b)
  );

  const CardComponent = {
    moon: TheMoon,
    sun: TheSun,
    chariot: TheChariot,
    lovers: TheLovers,
    fool: TheFool,
  }[winner];

  return (
    <DilloSonaStackScreen>
      <View style={styles.container}>
        <CardComponent />
      </View>
    </DilloSonaStackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#5B004F',
  },
  title: {
    color: '#DDD',
    fontSize: 24,
    marginBottom: 16,
  },
  cardGraphic: {
    marginBottom: 24,
  },
  cardName: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
  },
});
