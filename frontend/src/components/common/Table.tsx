import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
}

function Table<T>({ columns, data, onRowClick, className = '' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto w-full">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-00 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick && onRowClick(item)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map((column, colIdx) => {
                  const value = typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor as keyof T];
                  
                  return (
                    <td
                      key={colIdx}
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                    >
                      {value as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;