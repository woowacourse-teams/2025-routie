import { useEffect, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { usePlaceSearchQuery } from '@/domains/places/queries/usePlaceQuery';

const useSearchPlace = () => {
  const [keyword, setKeyword] = useState('');
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: searchResults, error } = usePlaceSearchQuery(searchedKeyword);

  const { showToast } = useToastContext();

  useEffect(() => {
    if (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  }, [error]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setSearchedKeyword(keyword);
    setIsDropdownOpen(true);
  };

  const handleChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleReset = () => {
    setKeyword('');
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return {
    keyword,
    handleChangeKeyword,
    handleEnterSearch,
    searchResults,
    handleSearch,
    handleReset,
    searchedKeyword,
    isDropdownOpen,
    handleCloseDropdown,
  };
};

export { useSearchPlace };
