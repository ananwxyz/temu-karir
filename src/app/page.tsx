import { Hero } from "@/components/hero";
import { CompanyGrid } from "@/components/company-grid";
import { FreelanceGrid } from "@/components/freelance-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyGrid />
      <FreelanceGrid />
    </>
  );
}
