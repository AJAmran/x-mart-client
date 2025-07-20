// src/types/branch.d.ts
export type TBranchStatus = "active" | "inactive" | "maintenance";

export type TBranchContact = {
  phone: string;
  email: string;
  manager?: string;
  emergencyContact?: string;
};

export type TBranchLocation = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    type: "Point";
    coordinates: [number, number];
  };
};

export type TBranchOperatingHours = {
  day: string;
  openingTime: string;
  closingTime: string;
  isClosed?: boolean;
};

export type TBranch = {
  _id?: string;
  name: string;
  code: string;
  status: TBranchStatus;
  contact: TBranchContact;
  location: TBranchLocation;
  operatingHours: TBranchOperatingHours[];
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