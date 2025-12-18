// src/constants/branch.ts
export const BRANCH_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    MAINTENANCE: "maintenance",
} as const;

export const BRANCH_STATUS_VALUES = Object.values(BRANCH_STATUS);

export const DAYS_OF_WEEK = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

export const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";

    return `${hour.toString().padStart(2, "0")}:00 ${ampm}`;
});
