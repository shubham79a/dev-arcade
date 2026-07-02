import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import PopularCourses from "./_components/PopularCourses";

export default function Home() {
  return (
    <div className="flex flex-col items-center">

      {/* hero  */}
      <Hero />
      <PopularCourses />
    </div>
  );
}
