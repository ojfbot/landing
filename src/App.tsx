import { CorridorCanvas } from "./components/Background/CorridorCanvas";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { Portfolio } from "./components/Portfolio/Portfolio";
import { Signal } from "./components/Signal/Signal";
import { Teaser } from "./components/Teaser/Teaser";
import { Footer } from "./components/Footer/Footer";

export function App() {
  return (
    <>
      <CorridorCanvas />
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <Signal />
        <Teaser />
      </main>
      <Footer />
    </>
  );
}
