import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  initialSorting?: SortingState;
  onRowSelect?: (selectedRows: T[]) => void;
  enableSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  initialSorting = [],
  onRowSelect,
  enableSelection = false,
  enablePagination = true,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: enableSelection ? rowSelection : {},
      globalFilter,
    },
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Notify parent component about selection changes
  React.useEffect(() => {
    if (onRowSelect && enableSelection) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map(row => row.original);
      onRowSelect(selectedRows);
    }
  }, [rowSelection, table, onRowSelect, enableSelection]);

  return (
    <div className="flex flex-col">
      {/* Filter input */}
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full max-w-sm"
          placeholder="Ara..."
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <div className="md:hidden mb-4 text-sm text-gray-500">
          <p>Sağa-sola kaydırarak tablonun tamamını görebilirsiniz.</p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-3 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? ' 🔄'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`${
                  row.getIsSelected() ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-500 break-words md:whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Sayfa{' '}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{' '}
              /{' '}
              <span className="font-medium">
                {table.getPageCount()}
              </span>
            </span>
          </div>
          <div className="flex justify-between sm:justify-end w-full sm:w-auto gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 flex-1 sm:flex-auto"
            >
              Önceki
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 flex-1 sm:flex-auto"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
