import dynamic from "next/dynamic";
import { Hero } from "@/components/home";

const FeaturedProducts = dynamic(() => import("@/components/home").then((mod) => mod.FeaturedProducts));
const WhyChooseUs = dynamic(() => import("@/components/home").then((mod) => mod.WhyChooseUs));
const Categories = dynamic(() => import("@/components/home").then((mod) => mod.Categories));
const Testimonials = dynamic(() => import("@/components/home").then((mod) => mod.Testimonials));
const CTABanner = dynamic(() => import("@/components/home").then((mod) => mod.CTABanner));

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
      <Categories />
      <Testimonials />
      <CTABanner />
    </>
  );
}
