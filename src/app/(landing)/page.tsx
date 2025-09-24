import CardsSection from "@/features/landing/components/CardsSection";
import Footer from "@/features/landing/components/Footer";
import Schedule from "@/features/landing/components/Schedule";
import Slider from "@/features/landing/components/Slider";
import Link from "next/link";

const LandingPage = () => {
  return ( <main>
    <header className="flex justify-between items-center p-4 bg-green-600 text-white font-bold">
      <div className="text-2xl">
        Recolecta
      </div>
      <div className="space-x-8 mr-8">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </header>
    <section className="p-8 space-y-16">
      <Slider />
      <CardsSection />
      <Schedule />
    </section>
    <Footer />
  </main> );
}
 
export default LandingPage;