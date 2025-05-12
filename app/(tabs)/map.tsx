// MapScreen.tsx
import React, { useEffect, useRef, useState } from 'react';

import MapImage from '@/assets/images/dillo2025_map.jpeg';
import DrawerContent from '@/components/map/drawer-content';
import IconMarker from '@/components/map/location-marker';
import TabScreen from '@/components/tab-screen';
import { Colors } from '@/constants/Colors';
import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import MapView, { Callout, Marker } from 'react-native-maps';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 42.05165;
const LONGITUDE = -87.67184;
const LATITUDE_DELTA = 0.0111;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = screen.width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const DRAWER_PREVIEW_HEIGHT = 325;

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const INITIAL_REGION = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

interface MarkerData {
  id: string;
  type:
    | 'main'
    | 'fmo'
    | 'food'
    | 'medical'
    | 'restroom'
    | 'programming-event'
    | 'sponsor'
    | 'exit'
    | 'artistMerch'
    | 'entrance'
    | 'water'
    | 'carousel'
    | 'beerGarden'
    | 'restArea';
  icon:
    | 'truck'
    | 'store'
    | 'restroom'
    | 'door-open'
    | 'record-vinyl'
    | 'tent'
    | 'briefcase-medical'
    | 'water'
    | 'door-closed'
    | 'magnifying-glass-location'
    | 'ticket-simple'
    | 'person-booth'
    | 'id-card'
    | 'users';
  label: string;
  coordinate: { latitude: number; longitude: number };
}

const markers: MarkerData[] = [
  {
    id: 'a',
    type: 'entrance',
    icon: 'door-open',
    label: 'Entrance',
    coordinate: { latitude: 42.05165, longitude: -87.67184 },
  },
  {
    id: 'b',
    type: 'artistMerch',
    icon: 'store',
    label: 'Artist Merch',
    coordinate: { latitude: 42.053865, longitude: -87.67004 },
  },
  {
    id: 'c',
    type: 'food',
    icon: 'truck',
    label: 'Food Trucks',
    coordinate: { latitude: 42.054823, longitude: -87.670859 },
  },
  {
    id: 'd',
    type: 'fmo',
    icon: 'record-vinyl',
    label: 'FMO Stage',
    coordinate: { latitude: 42.055339, longitude: -87.670925 },
  },
  {
    id: 'e',
    type: 'main',
    icon: 'record-vinyl',
    label: 'Main Stage',
    coordinate: { latitude: 42.057273, longitude: -87.670835 },
  },
  {
    id: 'f',
    type: 'restroom',
    icon: 'restroom',
    label: 'Restrooms',
    coordinate: { latitude: 42.055042, longitude: -87.670372 },
  },
  {
    id: 'g',
    type: 'medical',
    icon: 'briefcase-medical',
    label: 'Medical Tent',
    coordinate: { latitude: 42.056484, longitude: -87.670533 },
  },
  {
    id: 'h',
    type: 'water',
    icon: 'water',
    label: 'Water Station',
    coordinate: { latitude: 42.056683, longitude: -87.670807 },
  },
  {
    id: 'z',
    type: 'food',
    icon: 'water',
    label: 'Water Stations',
    coordinate: { latitude: 42.052463, longitude: -87.670366 },
  },
  {
    id: 'y',
    type: 'programming-event',
    icon: 'person-booth',
    label: 'Programming Areas',
    coordinate: { latitude: 42.052838, longitude: -87.670006 },
  },
  {
    id: 'o',
    type: 'carousel',
    icon: 'person-booth',
    label: 'Carousel',
    coordinate: { latitude: 42.052194, longitude: -87.669797 },
  },
  {
    id: 'n',
    type: 'beerGarden',
    icon: 'id-card',
    label: 'Beer Garden',
    coordinate: { latitude: 42.057127, longitude: -87.670366 },
  },
  {
    id: 'q',
    type: 'restArea',
    icon: 'person-booth',
    label: 'Rest Area',
    coordinate: { latitude: 42.05557, longitude: -87.671849 },
  },
  {
    id: 's',
    type: 'sponsor',
    icon: 'person-booth',
    label: 'Sponsor Booths',
    coordinate: { latitude: 42.055587, longitude: -87.670527 },
  },
  {
    id: 'i',
    type: 'exit',
    icon: 'door-closed',
    label: 'Exit',
    coordinate: { latitude: 42.056717, longitude: -87.672353 },
  },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<Array<Marker | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'interactive' | 'static'>(
    'interactive'
  );

  // Center map & open just the active callout
  useEffect(() => {
    if (activeTab !== 'interactive') return;

    const m = markers[activeIndex];
    markerRefs.current.forEach((r, i) => i !== activeIndex && r?.hideCallout());
    mapRef.current?.animateToRegion(
      {
        ...m.coordinate,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      200
    );
    setTimeout(() => markerRefs.current[activeIndex]?.showCallout(), 100);
  }, [activeIndex, activeTab]);

  const renderTabSelector = () => {
    if (Platform.OS === 'ios') {
      return (
        <SafeAreaView style={styles.iosTabOuterContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'interactive' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('interactive')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'interactive' && styles.activeTabText,
                ]}
              >
                Interactive
              </Text>
              {activeTab === 'interactive' && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'static' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('static')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'static' && styles.activeTabText,
                ]}
              >
                Static
              </Text>
              {activeTab === 'static' && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.androidTabOuterContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'interactive' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('interactive')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'interactive' && styles.activeTabText,
                ]}
              >
                Interactive
              </Text>
              {activeTab === 'interactive' && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'static' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('static')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'static' && styles.activeTabText,
                ]}
              >
                Static
              </Text>
              {activeTab === 'static' && (
                <View style={styles.activeTabIndicator} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const renderInteractive = () => (
    <>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {markers.map((m, i) => (
          <Marker
            key={m.id}
            coordinate={m.coordinate}
            ref={(r) => (markerRefs.current[i] = r)}
            anchor={{ x: 0.5, y: 1 }}
            calloutAnchor={{ x: 0.5, y: -0.1 }}
          >
            <IconMarker icon={m.icon} selected={i === activeIndex} />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutText}>{m.label}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.drawer}>
        <FlatList
          data={markers}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          decelerationRate='fast'
          snapToInterval={SNAP_WIDTH}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (screen.width - ITEM_WIDTH) / 2,
          }}
          onMomentumScrollEnd={(e) =>
            setActiveIndex(
              Math.round(e.nativeEvent.contentOffset.x / SNAP_WIDTH)
            )
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <DrawerContent type={item.type} />
            </View>
          )}
        />
      </View>
    </>
  );

  const renderStatic = () => {
    const images = [{ url: '', props: { source: MapImage } }];
    return (
      <View style={styles.staticContainer}>
        <ImageZoomViewer
          imageUrls={images}
          backgroundColor='#000'
          renderIndicator={() => null}
          enableSwipeDown
          onSwipeDown={() => setActiveTab('interactive')}
          minScale={0.5}
        />
      </View>
    );
  };

  return (
    <TabScreen>
      <View style={styles.container}>
        {renderTabSelector()}
        {activeTab === 'interactive' ? renderInteractive() : renderStatic()}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // iOS tab bar
  iosTabOuterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    backgroundColor: '#faf6f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Android tab bar
  androidTabOuterContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    backgroundColor: '#faf6f0',
    elevation: 4,
  },

  tabContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  tabButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  activeTabButton: {},

  tabText: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    fontWeight: '500',
    color: '#888',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },

  activeTabText: {
    color: '#000',
    fontWeight: '700',
  },

  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    width: '50%',
    height: 3,
    backgroundColor: Colors.light.text,
    borderRadius: 1.5,
  },

  staticContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  drawer: {
    position: 'absolute',
    bottom: 0,
    height: DRAWER_PREVIEW_HEIGHT,
    width: '100%',
  },

  item: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: Colors.light.text,
    borderWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  callout: {
    minWidth: 100,
    alignItems: 'center',
    padding: 6,
    backgroundColor: 'white',
  },

  calloutText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
