"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Inbox, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableRowSkeleton } from "@/components/ui/skeleton";

export interface AdminTableRow {
  id: string;
  searchable: string;
  cells: React.ReactNode[];
}

export interface AdminDataTableProps {
  columns: string[];
  rows: AdminTableRow[];
  emptyMessage?: string;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  pageSize?: number;
  loading?: boolean;
  error?: string | null;
}

export function AdminDataTable({
  columns,
  rows,
  emptyMessage = "Chưa có dữ liệu phù hợp để hiển thị.",
  searchPlaceholder = "Tìm kiếm dữ liệu...",
  toolbar,
  pageSize = 6,
  loading = false,
  error = null,
}: AdminDataTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    if (!normalized) return rows;
    return rows.filter((row) =>
      row.searchable.toLocaleLowerCase("vi").includes(normalized)
    );
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = visibleRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-4 sm:px-6">
        <div className="relative flex w-full sm:max-w-sm items-center">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/25"
          />
        </div>
        {toolbar && (
          <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
        )}
      </div>

      {error ? (
        <div className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Không thể tải dữ liệu"
            description={error}
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50/90 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3.5 sm:px-6"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={columns.length} />
                    ))
                  : paginatedRows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        {row.cells.map((cell, index) => (
                          <td
                            key={`${row.id}-${index}`}
                            className="px-4 py-4 sm:px-6 align-middle text-slate-700"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && visibleRows.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={Inbox}
                title="Không có kết quả"
                description={emptyMessage}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-4 py-4 sm:px-6">
            <p className="text-xs text-slate-600" aria-live="polite">
              Hiển thị{" "}
              <strong className="text-slate-900">{paginatedRows.length}</strong>{" "}
              trên tổng số{" "}
              <strong className="text-slate-900">{visibleRows.length}</strong>{" "}
              mục
            </p>
            {totalPages > 1 && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
