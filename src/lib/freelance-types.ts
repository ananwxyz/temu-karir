export interface FreelancePlatform {
    id: string;
    name: string;
    slug: string;
    category: FreelanceCategory;
    payment_type: PaymentType;
    platform_url: string;
    status: "ACTIVE" | "FLAGGED" | "PENDING";
}

export type PaymentType = "Hourly" | "Fixed Project" | "Bebas";
export const PAYMENT_TYPES: PaymentType[] = ["Hourly", "Fixed Project", "Bebas"];

export type FreelanceCategory =
    | "Programming & Tech"
    | "Graphic Design & Creative"
    | "Writing & Translation"
    | "Digital Marketing"
    | "Video & Animation"
    | "General Freelance";

export const FREELANCE_CATEGORIES: FreelanceCategory[] = [
    "Programming & Tech",
    "Graphic Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Video & Animation",
    "General Freelance",
];
