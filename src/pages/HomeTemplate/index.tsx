import { Outlet } from "react-router-dom";
import Header from "./_components/header";
import Footer from "./_components/footer";
// import Carousel from "./Carousel";
import Discover from "./Discover";
import AnywhereSection from "./AnyWhere";

export default function HomeTemplate() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Discover */}
        <div className="mt-10 max-w-7xl mx-auto px-6">
          <Discover />
        </div>

        {/* Route con xuất hiện tại đây */}
        <Outlet />

        <AnywhereSection />
      </main>

      <Footer />
    </div>
  );
}
