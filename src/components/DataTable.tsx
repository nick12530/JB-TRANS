import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown,
  Filter,
  Download,
  CheckSquare,
  Square,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ value: string; label: string }>;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onBulkAction?: (action: string, selectedRows: T[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  bulkActions?: Array<{ label: string; value: string; icon?: React.ReactNode; variant?: 'default' | 'danger' }>;
  filters?: FilterOption[];
  exportable?: boolean;
  onExport?: (data: T[]) => void;
  refreshable?: boolean;
  onRefresh?: () => void;
  className?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (row: T) => void;
    variant?: 'default' | 'danger' | 'warning';
    condition?: (row: T) => boolean;
  }>;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  loading = false,
  pagination = true,
  pageSize = 10,
  selectable = false,
  bulkActions = [],
  filters = [],
  exportable = false,
  onExport,
  refreshable = false,
  onRefresh,
  className,
  rowClassName,
  onRowClick,
  actions = [],
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showBulkActions, setShowBulkActions] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = data.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        filtered = filtered.filter((item) => {
          const itemValue = item[key as keyof T];
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection, activeFilters, columns]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? processedData.slice(startIndex, endIndex) : processedData;

  // Handle sorting
  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    const selectedData = data.filter(row => selectedRows.has(row.id));
    onBulkAction?.(action, selectedData);
    setSelectedRows(new Set());
    setShowBulkActions(false);
  };

  // Handle export
  const handleExport = () => {
    onExport?.(processedData);
  };

  // Clear filters
  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
  };

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  // Show bulk actions when rows are selected
  useEffect(() => {
    setShowBulkActions(selectedRows.size > 0);
  }, [selectedRows]);

  const getSortIcon = (column: keyof T) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-bright-green" /> : 
      <ChevronDown className="h-4 w-4 text-bright-green" />;
  };

  return (
    <div className={`space-y-4 ${className}`} ref={tableRef}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-64"
              />
            </div>
          )}

          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors',
                showFilters 
                  ? 'bg-bright-green text-white border-bright-green' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(activeFilters).some(v => v !== '' && v !== null && v !== undefined) && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {Object.values(activeFilters).filter(v => v !== '' && v !== null && v !== undefined).length}
                </span>
              )}
            </button>
          )}

          {refreshable && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={clsx('h-4 w-4', loading && 'animate-spin')} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Export and Bulk Actions */}
        <div className="flex items-center space-x-2">
          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}

          {showBulkActions && bulkActions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRows.size} selected
              </span>
              {bulkActions.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleBulkAction(action.value)}
                  className={clsx(
                    'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    action.variant === 'danger' 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-bright-green hover:bg-green-600 text-white'
                  )}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && filters.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {filter.label}
                </label>
                {filter.type === 'text' && (
                  <input
                    type="text"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, [filter.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                )}
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, [filter.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === 'date' && (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, [filter.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                )}
                {filter.type === 'number' && (
                  <input
                    type="number"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => setActiveFilters({ ...activeFilters, [filter.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-emerald-200 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              {selectable && (
                <th className="px-2 py-2 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {selectedRows.size === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={clsx(
                    'px-2 py-2 text-xs font-medium text-gray-700 dark:text-gray-300',
                    column.headerAlign === 'center' && 'text-center',
                    column.headerAlign === 'right' && 'text-right',
                    column.headerClassName
                  )}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + ((onEdit || onDelete || onView || actions.length > 0) ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-bright-green" />
                    <span className="text-gray-600 dark:text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + ((onEdit || onDelete || onView || actions.length > 0) ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/10 dark:hover:to-teal-900/10 transition-all duration-200',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row)
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-2 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {selectedRows.has(row.id) ? (
                          <CheckSquare className="h-4 w-4 text-bright-green" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={clsx(
                        'px-2 py-2 text-xs text-gray-900 dark:text-gray-100',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.className
                      )}
                    >
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] || '-')}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView || actions.length > 0) && (
                    <td className="px-2 py-2 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, index) => {
                          if (action.condition && !action.condition(row)) return null;
                          return (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              className={clsx(
                                'p-1 rounded-md transition-colors',
                                action.variant === 'danger' 
                                  ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                  : action.variant === 'warning'
                                  ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                  : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                              )}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          );
                        })}
                        {onView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)} of {processedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      'px-3 py-2 rounded-lg transition-colors',
                      currentPage === page
                        ? 'bg-bright-green text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}