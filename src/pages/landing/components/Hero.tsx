import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-10 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h2 className="inline">
            Your Trusted Delivery Partner
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0"
        
        >
          Delivery Express is a leading logistics company that provides fast and reliable delivery services in Ghana. Our mission is to connect people and businesses through efficient transportation solutions.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a
            href="/authentication/phone-login"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "default",
            })}`}
          >
            Track Parcel
          </a>
          <a
            href="/authentication/login"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })} bg-transparent`}
          >
            Admin Dashboard
            {/* <GitHubLogoIcon className="ml-2 w-5 h-5" /> */}
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
