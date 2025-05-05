import NineOneOneButton from '@/components/information/911-button';
import ContactMayfestIcon from '@/components/information/contact-mayfest';
import NUPDIcon from '@/components/information/nupud';
import SmartDilloIcon from '@/components/information/smart-dillo-icon';
import ScreenBackground from '@/components/screen-background';
import TabScreen from '@/components/tab-screen';
import { VERSION } from '@/lib/app';
import { call, link } from '@/lib/link';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BUTTON_SIZE = 175;

export default function InfoScreenTwo() {
  const router = useRouter();

  return (
    <TabScreen>
      <ScreenBackground />
      <View style={styles.container}>
        <View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => call('911')}>
              <NineOneOneButton style={styles.svg} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                link(
                  'https://www.northwestern.edu/wellness/hpaw/campaigns/smart-dillo/'
                )
              }
            >
              <SmartDilloIcon
                width={BUTTON_SIZE}
                height={BUTTON_SIZE}
                style={styles.svg}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => router.push('/information/contact')}
            >
              <ContactMayfestIcon
                width={BUTTON_SIZE}
                height={BUTTON_SIZE}
                style={styles.svg}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => call('18474913456')}>
              <NUPDIcon
                width={BUTTON_SIZE}
                height={BUTTON_SIZE}
                style={styles.svg}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v{VERSION}</Text>
        </View>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 16,
    gap: 36,
  },
  svg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
  },
  text: {
    textAlign: 'center',
    // color: theme.dark,
    // fontFamily: theme.bodyRegular,
    marginBottom: 12,
    opacity: 0.75,
  },
  version: {
    textAlign: 'center',
    // color: theme.dark,
    // fontFamily: theme.bodyBold,
    marginTop: 8,
    marginBottom: 20,
    opacity: 0.5,
  },
});
