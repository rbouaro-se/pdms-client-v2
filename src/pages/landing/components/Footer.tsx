import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex items-center gap-2"
          >
            <LogoIcon />
            Delivery Express
          </a>
          <p className="mt-2 text-muted-foreground text-sm">
            Fast, secure, and reliable delivery services across Ghana.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow Us</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Facebook
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Twitter
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="opacity-60 hover:opacity-100"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Services</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#pricing"
              className="opacity-60 hover:opacity-100"
            >
              Pricing
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#howItWorks"
              className="opacity-60 hover:opacity-100"
            >
              How We Operate
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#faq"
              className="opacity-60 hover:opacity-100"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Company</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#about"
              className="opacity-60 hover:opacity-100"
            >
              About Us
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#partners"
              className="opacity-60 hover:opacity-100"
            >
              Partners
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#newsletter"
              className="opacity-60 hover:opacity-100"
            >
              Newsletter
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Contact</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="mailto:support@deliveryexpress.com"
              className="opacity-60 hover:opacity-100"
            >
              support@deliveryexpress.com
            </a>
          </div>
          <div>
            <span className="opacity-60">+233 20 123 4567</span>
          </div>
          <div>
            <span className="opacity-60">Accra, Ghana</span>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; 2025 Delivery Express. All rights reserved.
        </h3>
      </section>
    </footer>
  );
};
