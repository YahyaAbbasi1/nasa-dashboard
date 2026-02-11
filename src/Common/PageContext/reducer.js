export const initialState = {
  sorting: {
    sortOrder: null,
    sortBy: null,
  },
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },

  filters: {
    searchTerm: "",
    searchBy: "",
    appliedFiltersCount: 0,
  },
  temporaryFilters: {
    searchTerm: "",
    searchBy: "",
    appliedFiltersCount: 0,
  },
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_PROP":
      const hasContextProp = state.filters.hasOwnProperty(payload.key);
      let updatedCount = state.filters.appliedFiltersCount;
      if (!hasContextProp) {
        updatedCount += 1;
      }
      return {
        ...state,
        filters: {
          ...state.filters,
          [payload.key]: payload.value,
          appliedFiltersCount: updatedCount,
        },
      };
    case "SET_TEMPORARY_PROPS": {
      const hasContextPropInFilters = state.filters.hasOwnProperty(payload.key);
      const hasContextPropInTemporaryFilters =
        state.temporaryFilters.hasOwnProperty(payload.key);

      let updatedCount = state.filters.appliedFiltersCount;

      if (!hasContextPropInFilters) {
        updatedCount += 1;
      }

      let tempFilterCount = state.temporaryFilters.appliedFiltersCount;
      if (!hasContextPropInTemporaryFilters) {
        tempFilterCount += 1;
      }

      return {
        ...state,
        filters: {
          ...state.filters,
          [payload.key]: payload.value,
          appliedFiltersCount: updatedCount,
        },
        temporaryFilters: {
          ...state.temporaryFilters,
          [payload.key]: payload.value,
          appliedFiltersCount: tempFilterCount,
        },
      };
    }
    case "REMOVE_PROP":
      const { contextPropToRemove } = payload;
      const { [contextPropToRemove]: propToRemove, ...remainingFilters } =
        state.filters;

      return {
        ...state,
        filters: {
          ...remainingFilters,
          appliedFiltersCount: Math.max(
            state.filters.appliedFiltersCount - 1,
            0
          ),
        },
      };

    case "REMOVE_TEMPORARY_FILTERS_PROP": {
      const { contextPropToRemove } = payload;
      const { [contextPropToRemove]: removedFilterProp, ...remainingFilters } =
        state.filters;
      const {
        [contextPropToRemove]: removedTempFilterProp,
        ...remainingTempFilters
      } = state.temporaryFilters;

      return {
        ...state,
        filters: {
          ...remainingFilters,
          appliedFiltersCount: Math.max(
            state.filters.appliedFiltersCount - 1,
            0
          ),
        },
        temporaryFilters: {
          ...remainingTempFilters,
          appliedFiltersCount: Math.max(
            state.temporaryFilters.appliedFiltersCount - 1,
            0
          ),
        },
      };
    }
    case "CLEAR_FILTERS": {
      const { searchTerm, searchBy, ...remainingFilters } =
        initialState.filters;
      const {
        searchTerm: tempSearchTerm,
        searchBy: tempSearchBy,
        ...remainingTempFilters
      } = initialState.temporaryFilters;

      return {
        ...state,
        filters: {
          ...remainingFilters,
          searchTerm: state.filters.searchTerm,
          searchBy: state.filters.searchBy,
        },
        temporaryFilters: {
          ...remainingTempFilters,
          searchTerm: state.temporaryFilters.searchTerm,
          searchBy: state.temporaryFilters.searchBy,
        },
      };
    }

    case "SET_TEMPORARY_FILTERS":
      return {
        ...state,
        temporaryFilters: { ...state.filters },
      };
    case "SET_SEARCH_TERM":
      return {
        ...state,
        filters: {
          ...state.filters,
          searchTerm: payload,
        },
        pagination: {
          current: 1,
          pageSize: state.pagination.pageSize,
        },
      };

    case "SET_SEARCH_BY":
      return {
        ...state,
        filters: {
          ...state.filters,
          searchBy: payload,
        },
      };
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: {
          current: payload.current,
          pageSize: payload.pageSize,
          total: payload.total,
        },
      };
    case "SET_PAGE":
      return {
        ...state,
        page: payload,
      };
    case "SET_SORTING_SORTBY":
      return {
        ...state,
        sorting: {
          ...state.sorting,
          sortBy: payload.sortBy,
        },
      };
    case "SET_SORTING_SORTORDER":
      return {
        ...state,
        sorting: {
          ...state.sorting,
          sortOrder: payload.sortOrder,
        },
      };

    case "SET_USER_ID": // New action type to set userId
      return {
        ...state,
        filters: {
          ...state.filters,
          userId: payload,
        },
      };

    case "SET_CAMPAIGN_ID": // New action type to set userId
      return {
        ...state,
        filters: {
          ...state.filters,
          campaignId: payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
