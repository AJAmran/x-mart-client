export type TBranchStatus = "active" | "inactive" | "maintenance";

export type TBranchContact = {
  phone: string;
  email: string;
  manager?: string;
  emergencyContact?: string;
  _id?: string;
};

export type TBranchLocation = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    type: "Point";
    /** GeoJSON order: [longitude, latitude]. */
    coordinates: [number, number];
  };
  _id?: string;
};

export type TBranchOperatingHours = {
  /** "weekdays" | "weekends" | "holidays" */
  dayType: string;
  openingTime?: string;
  closingTime?: string;
  is24Hours?: boolean;
  isClosed?: boolean;
  _id?: string;
};

export type TBranchFacilities = {
  parking?: boolean;
  wifi?: boolean;
  delivery?: boolean;
  pickup?: boolean;
  dining?: boolean;
  atm?: boolean;
  pharmacy?: boolean;
  bakery?: boolean;
  _id?: string;
};

export type TBranch = {
  _id?: string;
  name: string;
  code: string;
  status: TBranchStatus | string;
  type?: string;
  contact: TBranchContact;
  location: TBranchLocation;
  operatingHours: TBranchOperatingHours[];
  facilities?: TBranchFacilities;
  openingDate: Date | string;
  size?: number;
  description?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type BranchFilters = {
  searchTerm?: string;
  status?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  maxDistance?: number;
};

export type PaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/** Case-insensitive enum match — stored records predate the lowercase enum. */
export const isBranchStatus = (value: unknown, expected: TBranchStatus): boolean =>
  String(value ?? "").toLowerCase() === expected;

export const isDayType = (value: unknown, expected: string): boolean =>
  String(value ?? "").toLowerCase() === expected.toLowerCase();
