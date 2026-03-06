import { FreelancePlatform } from "./freelance-types";

export const freelanceData: FreelancePlatform[] = [
    {
        id: "1",
        name: "Upwork",
        slug: "upwork",
        category: "General Freelance",
        payment_type: "Bebas",
        platform_url: "https://www.upwork.com/",
        status: "ACTIVE",
    },
    {
        id: "2",
        name: "Fiverr",
        slug: "fiverr",
        category: "General Freelance",
        payment_type: "Fixed Project",
        platform_url: "https://www.fiverr.com/",
        status: "ACTIVE",
    },
    {
        id: "3",
        name: "Sribulancer",
        slug: "sribulancer",
        category: "General Freelance",
        payment_type: "Fixed Project",
        platform_url: "https://www.sribulancer.com/",
        status: "ACTIVE",
    },
    {
        id: "4",
        name: "Fastwork",
        slug: "fastwork",
        category: "General Freelance",
        payment_type: "Fixed Project",
        platform_url: "https://fastwork.id/",
        status: "ACTIVE",
    },
    {
        id: "5",
        name: "Toptal",
        slug: "toptal",
        category: "Programming & Tech",
        payment_type: "Hourly",
        platform_url: "https://www.toptal.com/",
        status: "ACTIVE",
    },
    {
        id: "6",
        name: "Projects.co.id",
        slug: "projects-co-id",
        category: "General Freelance",
        payment_type: "Bebas",
        platform_url: "https://projects.co.id/",
        status: "ACTIVE",
    },
    {
        id: "7",
        name: "Freelancer.com",
        slug: "freelancer",
        category: "General Freelance",
        payment_type: "Bebas",
        platform_url: "https://www.freelancer.co.id/",
        status: "ACTIVE",
    },
    {
        id: "8",
        name: "99designs",
        slug: "99designs",
        category: "Graphic Design & Creative",
        payment_type: "Fixed Project",
        platform_url: "https://99designs.com/",
        status: "ACTIVE",
    },
];

export function getFreelancePlatforms(): FreelancePlatform[] {
    return freelanceData;
}

export function searchFreelance(
    query: string,
    category?: string,
    payment_type?: string
): FreelancePlatform[] {
    let results = freelanceData.filter((c) => c.status !== "PENDING");

    if (query) {
        const q = query.toLowerCase();
        results = results.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (category && category !== "all") {
        results = results.filter((c) => c.category === category);
    }

    if (payment_type && payment_type !== "all") {
        results = results.filter((c) => c.payment_type === payment_type);
    }

    return results;
}
