import { useState } from 'react';

import searchPlace from '../apis/searchPlace';
import { PlaceLocationType, PlaceSearchType } from '../types/place.types';

const useSearchPlace = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchType[]>([]);
  const [searchInfo, setSearchInfo] = useState<PlaceLocationType>();

  const handleSearch = async () => {
    if (!keyword) return setSearchResults([]);

    try {
      const searchPlaces = await searchPlace(keyword);
      setSearchResults(searchPlaces);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchPlaceMap = (placeLocation: PlaceLocationType) => {
    setSearchInfo(placeLocation);
  };

  const handleChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleReset = () => {
    setKeyword('');
    setSearchResults([]);
  };

  return {
    keyword,
    handleChangeKeyword,
    searchResults,
    setSearchResults,
    handleSearch,
    handleReset,
    searchInfo,
    handleSearchPlaceMap,
  };
};

export default useSearchPlace;
