import { lazy, Suspense } from "react";
import About from "@/components/About";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Timeline from "@/components/Timeline";
import WhyChoose from "@/components/WhyChoose";

const Gallery = lazy(() => import("@/components/Gallery"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const InstagramFeed = lazy(() => import("@/components/InstagramFeed"));

function SectionFallback() {
  return <div className="h-96" />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Suspense fallback={<SectionFallback />}>
        <Gallery />
      </Suspense>
      <About />
      <Timeline />
      <WhyChoose />
      <Stats />
      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
        <InstagramFeed />
      </Suspense>
      <CTA />
      <Contact />
    </>
  );
}
