import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { SearchBarWithFilterProps } from "../Types/SearchBarTypes";

function SearchBar<T>({
  value,
  onChange,
  items = [],
  onFiltered,
}: SearchBarWithFilterProps<T>) {
  useEffect(() => {
    const searchWords = value.toLowerCase().split(/\s+/).filter(Boolean);

    const filtered = items.filter((item: any) => {
      if (!item.title) return false;
      const titleLower = item.title.toLowerCase();

      return searchWords.every((word) => titleLower.includes(word));
    });

    if (onFiltered) onFiltered(filtered as T[]);
  }, [items, value]);

  return (
    <div className="relative w-full max-w-md mb-5">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Search..."
        className="w-[60%] pl-10 pr-4 py-2 rounded-lg bg-surface border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
      />
    </div>
  );
}

export default SearchBar;
