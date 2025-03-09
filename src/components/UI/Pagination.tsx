import {Pagination} from "@heroui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <Pagination
      total={totalPages}
      page={currentPage}
      onChange={onPageChange}
      className="mt-6"
    />
  );
}