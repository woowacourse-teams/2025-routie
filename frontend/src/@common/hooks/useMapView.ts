import { useState } from 'react';

const useMapView = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const handleViewModeChange = () => {
    if (viewMode === 'map') {
      setViewMode('list');
    } else {
      setViewMode('map');
    }
  };

  return { viewMode, handleViewModeChange };
};

export default useMapView;
