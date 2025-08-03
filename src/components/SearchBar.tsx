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
  displayName: string;
  type: FilterType;
  options: string[];
}

const filterData: FilterItem[] = [
  {
    label: "Location",
    displayName: "Location",
    type: "search",
    options: [
      "Sydney, Australia",
      "New York, USA",
      "Paris, France",
      "Tokyo, Japan",
      "London, UK",
      "Rome, Italy",
    ],
  },
  {
    label: "Price",
    displayName: "Price",
    type: "checkbox",
    options: ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"],
  },
  {
    label: "activities",
    displayName: "Activity",
    type: "checkbox",
    options: ["Hiking", "Swimming", "Sightseeing", "Photography", "Cooking Classes", "Wine Tasting", "Yoga & Wellness", "Water Sports", "Cultural Tours", "Adventure Sports", "Wildlife Safari", "Spa & Relaxation"],
  },
  {
    label: "recipients",
    displayName: "Recipient",
    type: "checkbox",
    options: [
      "Families",
      "Couples",
      "Solo Travelers",
      "Friends",
      "Business Groups",
      "Students",
      "Seniors",
      "Adventure Seekers",
      "Luxury Travelers",
    ],
  },
  {
    label: "occassions",
    displayName: "Occasion",
    type: "checkbox",
    options: ["Weddings", "Engagements", "Graduations", "Anniversaries", "Birthdays", "Mother's Day", "Father's Day", "Valentine's Day", "Children's Day", "Grandparents' Day", "Christmas", "Eid", "Diwali", "Holi", "Thanksgiving", "New Year", "Corporate Events", "Team Building", "Holiday Celebrations", "Cultural Festivals"],
  },
];

interface FilterDropdownProps extends FilterItem {
  onFilterChange: (filter: string, selectedOptions: string[]) => void;
}

function FilterDropdown({
  label,
  displayName,
  type,
  options,
  onFilterChange,
}: FilterDropdownProps) {
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);

  const handleCheckedChange = (option: string, checked: boolean) => {
    const newCheckedItems = checked
      ? [...checkedItems, option]
      : checkedItems.filter((item) => item !== option);
    setCheckedItems(newCheckedItems);
    onFilterChange(label, newCheckedItems);
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
          {displayName}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2">
        <DropdownMenuLabel className="text-sm font-semibold">
          {displayName}
        </DropdownMenuLabel>

        {/* For better separation */}
        <DropdownMenuSeparator />

        {/* If this filter type is "search," show an input at the top */}
        {type === "search" && (
          <Input
            placeholder={`Search ${displayName}`}
            className="mb-2"
            onChange={(e) => onFilterChange(label, [e.target.value])}
          />
        )}

        {/* Render the filtered list of options as checkboxes */}
        {options.map((option) => {
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

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string, selectedOptions: string[]) => void;
}

export function SearchBar({ onSearchChange, onFilterChange }: SearchBarProps) {
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
            onChange={(e) => onSearchChange(e.target.value)}
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
            displayName={filter.displayName}
            type={filter.type}
            options={filter.options}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
