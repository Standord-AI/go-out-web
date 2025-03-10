"use client";

import React from "react";
import { Search as SearchIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type FilterType = "search" | "checkbox";

interface FilterItem {
  label: string;
  type: FilterType;
  options: string[];
}

const filterData: FilterItem[] = [
  {
    label: "Location",
    type: "search",
    options: ["Sydney", "New York", "Paris", "Tokyo", "London", "Rome"],
  },
  {
    label: "Price",
    type: "checkbox",
    options: ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"],
  },
  {
    label: "Activity",
    type: "checkbox",
    options: ["Adventure", "Driving", "Wildlife", "Travel", "Food & Drink"],
  },
  {
    label: "Recipient",
    type: "checkbox",
    options: [
      "For Groups",
      "For Him",
      "Kids",
      "For Her",
      "Couples",
      "Families",
    ],
  },
  {
    label: "Occasion",
    type: "checkbox",
    options: ["Wedding", "Valentine's Day", "Graduation", "Father's Day"],
  },
];

interface FilterDropdownProps extends FilterItem {
  label: string;
  type: FilterType;
  options: string[];
}

function FilterDropdown({ label, type, options }: FilterDropdownProps) {
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filtered list for "search" type
  const filteredOptions =
    type === "search"
      ? options.filter((option) =>
          option.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

  const handleCheckedChange = (option: string, checked: boolean) => {
    setCheckedItems((prev) =>
      checked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="
            rounded-full 
            text-sm 
            font-medium
            flex items-center
          "
        >
          {label}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2">
        <DropdownMenuLabel className="text-sm font-semibold">
          {label}
        </DropdownMenuLabel>

        {/* For better separation */}
        <DropdownMenuSeparator />

        {/* If this filter type is "search," show an input at the top */}
        {type === "search" && (
          <Input
            placeholder={`Search ${label}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
        )}

        {/* Render the filtered list of options as checkboxes */}
        {filteredOptions.map((option) => {
          const isChecked = checkedItems.includes(option);
          return (
            <DropdownMenuCheckboxItem
              key={option}
              checked={isChecked}
              onCheckedChange={(checked) =>
                handleCheckedChange(option, checked as boolean)
              }
            >
              {option}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SearchBar() {
  return (
    <div className="p-4 bg-white w-full sticky top-5 z-10">
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* Main Search Input + Button */}
        <div className="flex items-center w-full max-w-xl border bg-white rounded-full pl-3 pr-2 py-2">
          {/* Search Icon */}
          <SearchIcon className="w-5 h-5 mr-2" />

          {/* Input field */}
          <Input
            type="text"
            placeholder="Search"
            className="
              border-0 
              focus-visible:ring-0 
              focus-visible:ring-offset-0 
              focus:outline-none 
              px-0 
              py-0 
              text-sm
              shadow-none
              flex-1
            "
          />

          {/* Search Button */}
          <Button
            className="
              text-white 
              text-sm 
              font-medium 
              rounded-full 
              ml-2
            "
          >
            Search
          </Button>
        </div>

        {/* Map over the filterData array to create dynamic dropdowns */}
        {filterData.map((filter) => (
          <FilterDropdown
            key={filter.label}
            label={filter.label}
            type={filter.type}
            options={filter.options}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
