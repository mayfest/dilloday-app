import React, { useEffect, useState } from 'react';

import DrawerScreen from '@/components/drawer-screen';
import LineupComingSoonModal from '@/components/schedule/lineup-coming-soon';
import ScheduleCarousel from '@/components/schedule/schedule-carousel';
import { useConfig } from '@/lib/config';

export default function ScheduleScreen() {
  const { config } = useConfig();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (config?.schedule) {
      const stages = Object.values(config.schedule);

      if (stages.length > 0) {
        // Check if all artists across all stages are unavailable
        const allUnavailable = stages.every((stage) => {
          if (stage.artists.length === 0) return true;

          return stage.artists.every((artistId) => {
            const artist = config.artists[artistId];
            return !artist || !artist.available;
          });
        });

        // Show modal if all artists are unavailable
        setModalVisible(allUnavailable);
      }
    }
  }, [config]);

  const handlePageChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <DrawerScreen>
      <ScheduleCarousel
        onPageChange={handlePageChange}
        currentIndex={currentIndex}
      />

      <LineupComingSoonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </DrawerScreen>
  );
}
