import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

interface ErrorCardProps {
  error: any;
  onRetry: () => void;
}

const ErrorCard = ({ error, onRetry }: ErrorCardProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full bg-red-50 border border-red-200 shadow-sm">
        <CardBody className="text-red-600 text-center p-6">
          <p className="text-lg font-semibold mb-2">Error loading orders</p>
          <p className="text-sm">{error.message}</p>
          <Button
            color="danger"
            variant="light"
            className="mt-4 hover:bg-red-100"
            onClick={onRetry}
          >
            Retry
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ErrorCard;
