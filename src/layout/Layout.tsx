import { Outlet } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLenis } from "@/hooks/useLenis";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Layout() {
  useLenis();
  useScrollToTop();

  return (
    <div className="relative min-h-screen bg-brand-black text-white">
      <Loader />
      <CustomCursor />
      <Particles />
      <Navbar />
      <main className="relative z-[2]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </div>
  );
}
