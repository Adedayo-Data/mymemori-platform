import { ChevronDown, Grid3x3, List } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ViewMode = "grid" | "list";

interface GalleryFiltersProps {
  sortBy: string;
  selectedFilter: string;
  viewMode: ViewMode;
  onSortChange: (sort: string) => void;
  onFilterChange: (filter: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  categories?: string[];
}

const GalleryFilters = ({
  sortBy,
  selectedFilter,
  viewMode,
  onSortChange,
  onFilterChange,
  onViewModeChange,
  categories = ["all", "uploaded"],
}: GalleryFiltersProps) => {
  const [openDropdown, setOpenDropdown] = useState<'sort' | 'filter' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown: 'sort' | 'filter') => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  return (
    <div className="flex items-center gap-2 flex-wrap pb-1" ref={dropdownRef}>
      {/* Sort Dropdown */}
      <div className="relative flex-shrink-0">
        <button 
          onClick={() => toggleDropdown('sort')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          <span className="font-medium text-gray-700">
            {sortBy === "recent" ? "Recent" : "Oldest"}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
        </button>
        <div 
          className={`absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all z-50 ${
            openDropdown === 'sort' ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <button
              onClick={(e) => {
                e.stopPropagation();
                onSortChange("recent");
                setOpenDropdown(null);
              }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-100"
          >
            Most Recent
          </button>
          <button
              onClick={(e) => {
                e.stopPropagation();
                onSortChange("oldest");
                setOpenDropdown(null);
              }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700"
          >
            Oldest First
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative flex-shrink-0">
        <button 
          onClick={() => toggleDropdown('filter')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          <span className="font-medium text-gray-700">
            {selectedFilter === "all" ? "All" : selectedFilter}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${openDropdown === 'filter' ? 'rotate-180' : ''}`} />
        </button>
        <div 
          className={`absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all z-50 max-h-60 overflow-y-auto ${
            openDropdown === 'filter' ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange(filter);
                setOpenDropdown(null);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
                selectedFilter === filter
                  ? "bg-pink-50 text-pink-600"
                  : "text-gray-700"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-1.5 rounded-lg transition-colors ${
            viewMode === "grid"
              ? "bg-pink-100 text-pink-600"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Grid3x3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-1.5 rounded-lg transition-colors ${
            viewMode === "list"
              ? "bg-pink-100 text-pink-600"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GalleryFilters;
