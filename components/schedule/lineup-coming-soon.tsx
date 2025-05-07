import React, { useEffect, useState } from 'react';

import MyDynamicSvg from '@/components/schedule/fmo-stage-ticket';
import MainStageTicket from '@/components/schedule/main-stage-ticket';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LineupComingSoonModal({ visible, onClose }) {
  // Get screen dimensions and track changes
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    // Update dimensions on screen rotation or size change
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isLargeDevice = width >= 428; // iPhone Pro Max width threshold

  // Calculate responsive ticket positions based on screen size
  // Now positioning from the bottom of the container
  const ticketPositions = [
    {
      x: isLargeDevice ? width * 0.1 : width * 0.05,
      bottom: isLargeDevice ? height * 0.2 : height * 0.15, // Distance from bottom
      angle: -30,
      isMainStage: true,
    },
    {
      x: isLargeDevice ? width * 0.2 : width * 0.1,
      bottom: isLargeDevice ? height * 0.3 : height * 0.25, // Distance from bottom
      angle: -15,
      isMainStage: false,
    },
  ];

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.navigationBar}>
            <TouchableOpacity style={styles.navigationButton} onPress={onClose}>
              <Text style={styles.navigationButtonText}>CLOSE</Text>
              <FontAwesome6 name='xmark' size={16} color='#FFFFFF' />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.textContentContainer}>
              <Text style={styles.heading}>DILLO DAY LINEUP COMING SOON</Text>
              <Text style={styles.comingSoonText}>
                The Dillo Day lineup hasn't been fully announced yet and we're
                working hard to finalize our schedule. For now, please make sure
                to follow us on Instagram at @dillo_day for the latest
                information and updates!
              </Text>
            </View>

            <View style={styles.ticketsContainer}>
              {ticketPositions.map((position, index) => (
                <View
                  key={index}
                  style={[
                    styles.ticket,
                    {
                      left: position.x,
                      bottom: position.bottom,
                      transform: [{ rotate: `${position.angle}deg` }],
                      width: isLargeDevice ? 150 : 120,
                      height: isLargeDevice ? 100 : 80,
                    },
                  ]}
                >
                  {position.isMainStage ? (
                    <MyDynamicSvg artistName='Coming Soon' time='TBA' />
                  ) : (
                    <MainStageTicket artistName='Coming Soon' time='TBA' />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '90%',
    backgroundColor: '#173885',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
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
  contentContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-start',
  },
  textContentContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  ticketsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  ticket: {
    position: 'absolute',
    opacity: 1,
  },
});
