import { About } from "./components/About";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Sponsors } from "./components/Sponsors";

// import "./App.css";

function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Sponsors />
            <About />
            <HowItWorks />
            <Features />
            <Pricing />
            <Newsletter />
            <FAQ />
            <Footer />
            <ScrollToTop />
        </>
    );
}

export default LandingPage;
