import { useState } from 'react';

import searchPlace from '../apis/searchPlace';
import { PlaceLocationType, PlaceSearchType } from '../types/place.types';

const useSearchPlace = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchType[]>([]);
  const [placeLocation, setPlaceLocation] = useState<PlaceLocationType>();

  const handleSearch = async () => {
    if (!keyword) return setSearchResults([]);

    try {
      const searchedPlaces = await searchPlace(keyword);
      setSearchResults(searchedPlaces);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchPlaceMap = (placeLocation: PlaceLocationType) => {
    setPlaceLocation(placeLocation);
  };

  const handleChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleReset = () => {
    setKeyword('');
    setSearchResults([]);
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return {
    keyword,
    handleChangeKeyword,
    handleEnterSearch,
    searchResults,
    setSearchResults,
    handleSearch,
    handleReset,
    placeLocation,
    handleSearchPlaceMap,
  };
};

export default useSearchPlace;
