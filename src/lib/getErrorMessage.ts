type ApiErrorSource = {
  path?: string;
  message?: string;
};

type ApiErrorShape = {
  message?: string;
  errorSources?: ApiErrorSource[];
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  const maybeApiError = error as {
    response?: {
      data?: ApiErrorShape;
    };
    message?: string;
  };

  const data = maybeApiError?.response?.data;

  if (data?.errorSources?.length) {
    return data.errorSources
      .map((source) => source.message)
      .filter(Boolean)
      .join(". ");
  }

  return data?.message || maybeApiError?.message || fallback;
};
