import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Community } from "./components/Community";
import { Priests } from "./components/Priests";
import { Schedules } from "./components/Schedules";
import { Groups } from "./components/Groups";
import { Sacraments } from "./components/Sacraments";
import { Announcements } from "./components/Announcements";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";

/**
 * Single page. Schedules sit high up: Mass and confession times are what most visitors
 * come looking for.
 */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Community />
        <Schedules />
        <Priests />
        <Groups />
        <Sacraments />
        <Announcements />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
