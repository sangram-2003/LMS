import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function FilterDropdown({
  data = [],           // full category data
  options = [],        // category ids
  selected = "All",    // current selected id
  onSelect = () => {}, 
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);   // notify parent
    setIsOpen(false);   // close dropdown
  };

  // Map for fast lookup: id -> name
  const categoryMap = Object.fromEntries(
    data.map((item) => [String(item.category_id), item.category_name])
  );

  // Always ensure "All" is the first option
  const fullOptions = ["All", ...(options || [])];

  // Determine name to show on button
  const selectedName =
    selected === "All" || !selected
      ? "All"
      : categoryMap[String(selected)] || selected;

  return (
    <div className={`relative ${className}`}>
      {/* Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-5 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold flex items-center gap-2 hover:bg-gray-50"
      >
        {selectedName}
        <span className="text-xs"><IoIosArrowDown /></span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10">
          {fullOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                selected === option ? "bg-emerald-50 text-emerald-600" : ""
              }`}
            >
              {option === "All"
                ? "ALL"
                : categoryMap[String(option)] || option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;