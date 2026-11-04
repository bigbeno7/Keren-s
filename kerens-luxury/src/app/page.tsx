import { Hero } from "@/components/home/Hero";
import { DesignerMarquee, NewArrivals, CategoryMosaic, Story, Campaign, Spotlight, Maisons, Trust, ConsignBand } from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <DesignerMarquee />
      <NewArrivals />
      <CategoryMosaic />
      <Story />
      <Campaign />
      <Spotlight />
      <Maisons />
      <Trust />
      <ConsignBand />
    </>
  );
}
