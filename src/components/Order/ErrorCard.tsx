import { TriangleAlert } from "lucide-react";
import { Button } from "@heroui/button";

interface ErrorCardProps {
  error: any;
  onRetry: () => void;
}

const ErrorCard = ({ error, onRetry }: ErrorCardProps) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-lg border border-danger/25 bg-surface-raised p-8 text-center shadow-xs">
        <span className="grid size-12 place-items-center rounded-full bg-danger/15 text-danger">
          <TriangleAlert aria-hidden size={22} />
        </span>
        <p className="text-title-md font-semibold text-content">
          Couldn&apos;t load orders
        </p>
        <p className="text-body-sm text-content-muted">
          {error?.message || "Something went wrong while fetching data."}
        </p>
        <Button color="primary" variant="flat" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
};

export default ErrorCard;
