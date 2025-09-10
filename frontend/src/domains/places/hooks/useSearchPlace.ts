import { useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

import { searchPlace } from '../apis/place';
import { PlaceAddType } from '../types/place.types';

const useSearchPlace = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceAddType[] | null>(
    null,
  );
  const { showToast } = useToastContext();

  const handleSearch = async () => {
    if (!keyword) return setSearchResults([]);

    try {
      const searchedPlaces = await searchPlace(keyword);
      setSearchResults(searchedPlaces);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  };

  const handleChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
    setSearchResults(null);
  };

  const handleReset = () => {
    setKeyword('');
    setSearchResults(null);
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
  };
};

export { useSearchPlace };
