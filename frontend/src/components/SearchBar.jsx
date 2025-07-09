import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { debounce } from "../utils/helpers.js";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

const SearchBar = ({
  onSearch,
  placeholder = "Search...",
  debounceMs = 300,
  className = "",
  showClearButton = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Create debounced search function
  const debouncedSearch = debounce((term) => {
    onSearch(term);
  }, debounceMs);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
