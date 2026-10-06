/**
 * Backend API base URL.
 *
 * There is deliberately no fallback to the demo deployment. A store owner who
 * forgot to set this would otherwise build a perfectly working shop whose
 * orders, carts and customers are all written into someone else's database —
 * a failure that is invisible until real money is involved.
 *
 * `npm run doctor` on the web side reports this if it is missing.
 */
const baseApi = process.env.NEXT_PUBLIC_BASE_API?.replace(/\/+$/, "");

if (!baseApi && process.env.NODE_ENV === "production") {
  /* eslint-disable no-console */
  console.warn(
    "[config] NEXT_PUBLIC_BASE_API is not set. The storefront will not be able to " +
      "reach the API. Copy .env.example to .env.local and set it to your API's " +
      "public URL, e.g. https://api.yourstore.com/api/v1"
  );
  /* eslint-enable no-console */
}

const envConfig = {
  baseApi: baseApi ?? "http://localhost:5000/api/v1",
};

export default envConfig;