import Image from "next/image";
import HeroSection from "../../components/herosection";
import AllReviews from "../../components/reviewsection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AllReviews />
    </div>
  );
}
