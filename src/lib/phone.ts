/**
 * Bangladeshi mobile numbers.
 *
 * The backend stores and validates `shippingInfo.phone` as exactly 11 digits
 * starting with `01` (`^01\d{9}$`). The UI, however, accepts and *pre-fills*
 * the international form — checkout seeds the field from the signed-in user's
 * `mobileNumber`, which is stored as `+8801…`. That combination meant the
 * client-side check passed and the order was then rejected server-side with a
 * 400 for every signed-in customer, with the phone field looking perfectly
 * valid to them.
 *
 * `normaliseBdPhone` is the single place that converts any accepted form to the
 * canonical one the API expects.
 */

/** Accepted input forms: `+8801XXXXXXXXX`, `8801XXXXXXXXX`, `01XXXXXXXXX`. */
const BD_PHONE_INPUT = /^(?:\+?8801|01)(\d{9})$/;

/** Canonical output form: `01XXXXXXXXX`. */
const BD_PHONE_CANONICAL = /^01\d{9}$/;

/**
 * Returns the canonical `01XXXXXXXXX` form, or `null` when the input is not a
 * valid Bangladeshi mobile number.
 */
export const normaliseBdPhone = (value: string | null | undefined): string | null => {
  if (!value) return null;

  // Tolerate spaces, dashes and parentheses users type for readability.
  const compact = value.replace(/[\s\-()]/g, "");

  if (BD_PHONE_CANONICAL.test(compact)) return compact;

  const match = BD_PHONE_INPUT.exec(compact);

  return match ? `01${match[1]}` : null;
};

/** True when the value is a valid Bangladeshi mobile number in any accepted form. */
export const isValidBdPhone = (value: string | null | undefined): boolean =>
  normaliseBdPhone(value) !== null;