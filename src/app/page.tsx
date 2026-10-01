import Header from "@/components/Header";
import ScrollWorld3D from "@/components/ScrollWorld3D";
import Thinking from "@/components/Thinking";
import Writing from "@/components/Writing";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return <>
    <Header />
    <main>
      <ScrollWorld3D />
      <Thinking />
      <Writing />
      <Projects />
      <About />
    </main>
    <Footer />
  </>;
}
