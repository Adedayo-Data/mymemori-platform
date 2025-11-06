import { ChevronDown, Grid3x3, List } from "lucide-react";

interface GalleryFiltersProps {
  sortBy: string;
  selectedFilter: string;
  viewMode: string;
  onSortChange: (sort: string) => void;
  onFilterChange: (filter: string) => void;
  onViewModeChange: (mode: string) => void;
  categories?: string[];
}

const GalleryFilters = ({
  sortBy,
  selectedFilter,
  viewMode,
  onSortChange,
  onFilterChange,
  onViewModeChange,
  categories = ["all", "portrait", "detail", "venue", "couple", "group"],
}: GalleryFiltersProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {/* Sort Dropdown */}
      <div className="relative group flex-shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm whitespace-nowrap">
          <span className="font-medium text-gray-700">
            {sortBy === "recent" ? "Recent" : "Oldest"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <button
            onClick={() => onSortChange("recent")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-100"
          >
            Most Recent
          </button>
          <button
            onClick={() => onSortChange("oldest")}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700"
          >
            Oldest First
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative group flex-shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm whitespace-nowrap">
          <span className="font-medium text-gray-700">
            {selectedFilter === "all" ? "All" : selectedFilter}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-60 overflow-y-auto">
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
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
