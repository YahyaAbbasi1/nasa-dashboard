// components/SearchBy/SearchBy.tsx
import { Input, Select } from "antd";
import React, { Fragment, useReducer } from "react";

const { Option } = Select;

interface ISearchByProps {
  searchBy: string[];
  onSearch: (searchBy: string, searchTerm: string) => void;
  onReset?: () => void;
  placeholder?: string;
  loading?: boolean;
}

type SearchAction =
  | { type: "SET_SEARCH_BY"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string };

interface SearchState {
  searchBy: string;
  searchTerm: string;
}

const searchReducer = (
  state: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case "SET_SEARCH_BY":
      return { ...state, searchBy: action.payload, searchTerm: "" };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

const SearchBy: React.FC<ISearchByProps> = (props: ISearchByProps) => {
  const { searchBy, onSearch, onReset, placeholder = "Search...", loading = false } = props;

  const [state, dispatch] = useReducer(searchReducer, {
    searchBy: searchBy[0],
    searchTerm: "",
  });

  const handleSearch = (value: string) => {
    if (value.trim()) {
      onSearch(state.searchBy, value.trim());
    } else if (onReset) {
      // If search is empty, trigger reset
      onReset();
    }
  };

  const handleSearchByChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_BY", payload: value });
    if (onReset) {
      onReset(); // Reset when changing search field
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ type: "SET_SEARCH_TERM", payload: value });
    
    // Auto-reset when input is cleared
    if (value === "" && onReset) {
      onReset();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(state.searchTerm);
    }
  };

  return (
    <Fragment>
      <Select
        value={state.searchBy}
        style={{ width: 120 }}
        onChange={handleSearchByChange}
        disabled={loading}
      >
        {searchBy.map((searchOption, index) => (
          <Option key={index} value={searchOption}>
            {searchOption}
          </Option>
        ))}
      </Select>

      <Input.Search
        style={{ width: 250 }}
        placeholder={placeholder}
        enterButton
        value={state.searchTerm}
        onChange={handleSearchTermChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        loading={loading}
        disabled={loading}
        allowClear // This adds a clear icon inside the search input
        onClear={() => {
          dispatch({ type: "SET_SEARCH_TERM", payload: "" });
          if (onReset) onReset();
        }}
      />
    </Fragment>
  );
};

export default SearchBy;