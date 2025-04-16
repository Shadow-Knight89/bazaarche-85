
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { ArrowUpDown, Filter, Search, X } from 'lucide-react';

export type FilterValues = {
  search?: string;
  category?: string;
  sort?: string;
};

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories = [],
  onFilterChange,
  onReset
}) => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (value: string) => {
    const newFilters = { ...filters, category: value === "all" ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sort: value === "default" ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onReset();
  };

  return (
    <div className="mb-6 bg-background rounded-lg border shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Filter className="ml-2 h-4 w-4" />
            فیلترها و مرتب‌سازی
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? 'بستن' : 'نمایش فیلترها'}
          </Button>
        </div>

        <div className={`${isExpanded ? 'block' : 'hidden'} md:block space-y-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search field */}
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در محصولات..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="pr-9"
              />
            </div>

            {/* Category filter */}
            <Select
              value={filters.category || 'all'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                {safeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort options */}
            <Select 
              value={filters.sort || 'default'}
              onValueChange={handleSortChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="مرتب‌سازی بر اساس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">پیش‌فرض</SelectItem>
                <SelectItem value="name_asc">نام (الف تا ی)</SelectItem>
                <SelectItem value="name_desc">نام (ی تا الف)</SelectItem>
                <SelectItem value="price_asc">قیمت (کم به زیاد)</SelectItem>
                <SelectItem value="price_desc">قیمت (زیاد به کم)</SelectItem>
                <SelectItem value="newest">جدیدترین</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset button */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="flex items-center"
            >
              <X className="ml-2 h-4 w-4" />
              پاک کردن فیلترها
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
