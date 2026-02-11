import React from "react";
import type { Dayjs } from "dayjs";
import { Button, Tooltip } from "antd";
import { FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import SearchBy from "Common/SearchBy";


interface FilterBarProps {
  searchBy: any;
  onSearch: (searchBy: string, searchTerm: string) => void;
  onReset: () => void;
  placeholder?: string;
  loading?: boolean;
  searchLoading?: boolean;
  dateRange?: [Dayjs, Dayjs] | null;
  setShowDateFilter?: (show: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchBy,
  onSearch,
  onReset,
  placeholder = "Search...",
  loading = false,
  searchLoading = false,
  dateRange,
  setShowDateFilter,
}) => {
  return (
    <div className="filter-bar">
      <SearchBy
        searchBy={searchBy}
        onSearch={onSearch}
        onReset={onReset}
        placeholder={placeholder}
        loading={loading || searchLoading}
      />

      {setShowDateFilter && (
        <Tooltip title="Filter by date range" placement="bottom">
          <Button
            icon={dateRange ? <CalendarOutlined /> : <FilterOutlined />}
            onClick={() => setShowDateFilter(true)}
            type={dateRange ? "primary" : "default"}
            className="filter-btn"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default FilterBar;
