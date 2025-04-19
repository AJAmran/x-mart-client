export const CATEGORIES = [
  "Fish",
  "Meat",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Frozen",
  "Grocery",
  "Personal Care",
  "House Hold",
  "Stationery",
  "Apparel & Linen",
];

  
  export const SORT_OPTIONS = [
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest Arrivals", value: "createdAt-desc" },
    { label: "Best Selling", value: "sales-desc" },
  ];





export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  PENDING: "PENDING", // Optional status if you need email verification
} as const;

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLE.ADMIN, label: "Admin" },
  { value: USER_ROLE.USER, label: "User" },
];

export const USER_STATUS_OPTIONS = [
  { value: USER_STATUS.ACTIVE, label: "Active" },
  { value: USER_STATUS.BLOCKED, label: "Blocked" },
  // { value: USER_STATUS.PENDING, label: "Pending" }, // Uncomment if using
];

// For table column definitions
export const USER_TABLE_COLUMNS = [
  { uid: "name", name: "Name", sortable: true },
  { uid: "email", name: "Email", sortable: true },
  { uid: "mobileNumber", name: "Phone" },
  { uid: "role", name: "Role", sortable: true },
  { uid: "status", name: "Status", sortable: true },
  { uid: "actions", name: "Actions" },
];

// For form field configuration
export const USER_FORM_FIELDS = {
  name: {
    label: "Full Name",
    placeholder: "Enter full name",
    required: true,
  },
  email: {
    label: "Email",
    placeholder: "Enter email address",
    required: true,
    type: "email",
  },
  mobileNumber: {
    label: "Phone Number",
    placeholder: "Enter phone number",
    required: true,
  },
  password: {
    label: "Password",
    placeholder: "Enter password",
    required: true,
    type: "password",
  },
  role: {
    label: "Role",
    required: true,
  },
  status: {
    label: "Status",
    required: true,
  },
  profilePhoto: {
    label: "Profile Photo URL",
    placeholder: "Enter image URL",
  },
};

// Status badge colors
export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: "success",
  [USER_STATUS.BLOCKED]: "danger",
  [USER_STATUS.PENDING]: "warning",
} as const;

// Role badge colors
export const ROLE_COLORS = {
  [USER_ROLE.ADMIN]: "primary",
  [USER_ROLE.USER]: "default",
} as const;

// Default pagination settings
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc" as const,
};

// User validation messages
export const USER_VALIDATION_MESSAGES = {
  name: {
    required: "Name is required",
    minLength: "Name must be at least 2 characters",
  },
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    minLength: "Password must be at least 6 characters",
  },
  mobileNumber: {
    required: "Phone number is required",
  },
  role: {
    required: "Role is required",
  },
  status: {
    required: "Status is required",
  },
};

export type UserRoleType = keyof typeof USER_ROLE;
export type UserStatusType = keyof typeof USER_STATUS;