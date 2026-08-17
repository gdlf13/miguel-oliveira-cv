import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Thinking from "@/components/Thinking";
import Writing from "@/components/Writing";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return <>
    <Header />
    <main>
      <Hero />
      <Thinking />
      <Writing />
      <Projects />
      <About />
    </main>
    <Footer />
  </>;
}
