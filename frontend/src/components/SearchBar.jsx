import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { debounce } from "../utils/helpers.js";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder = "Search...",
  debounceMs = 300,
  className = "",
  showClearButton = true,
}) => {
  // Create debounced search function
  const debouncedSearch = useRef(
    debounce((term) => {
      onSearch(term);
    }, debounceMs)
  ).current;

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleClear = () => {
    onSearchChange("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        leftIcon={<Search size={20} />}
        rightIcon={
          showClearButton &&
          searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="p-1 h-auto"
            >
              <X size={16} />
            </Button>
          )
        }
        className="pr-10"
      />
    </div>
  );
};

export default SearchBar;
