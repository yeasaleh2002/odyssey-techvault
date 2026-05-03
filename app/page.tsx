import { 
  Hero, 
  WhyChooseUs as Features, 
  Categories, 
  Stats, 
  FeaturedProducts, 
  Testimonials, 
  FAQ, 
  HowItWorks, 
  CTABanner as CTA 
} from "@/components/home";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Features />
      <Categories />
      <Stats />
      <FeaturedProducts />
      <Testimonials />
      <FAQ />
      <HowItWorks />
      <CTA />
    </main>
  );
}
