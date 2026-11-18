import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { CompanyGrid } from "@/components/company-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <CompanyGrid />
      </Suspense>
    </>
  );
}