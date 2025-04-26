"use client";

import { Pagination } from "@heroui/pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";


export default function PaginationControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  // Mock total pages (replace with actual data from useProducts)
  const totalPages = 10; // Adjust based on actual data.meta.totalPages

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-8">
      <Pagination
        total={totalPages}
        page={page}
        onChange={handlePageChange}
        showControls
        aria-label="Product pagination"
      />
    </div>
  );
}