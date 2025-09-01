import { Truck, Bike, Bus, Package } from "lucide-react";
import { JSX } from "react";

interface PartnerProps {
  icon: JSX.Element;
  name: string;
}

const partners: PartnerProps[] = [
  {
    icon: <Truck size={34} />,
    name: "DHL",
  },
  {
    icon: <Bike size={34} />,
    name: "Jumia Logistics",
  },
  {
    icon: <Bus size={34} />,
    name: "Metro Mass",
  },
  {
    icon: <Package size={34} />,
    name: "FedEx",
  },
  {
    icon: <Truck size={34} />,
    name: "UPS",
  },
  {
    icon: <Package size={34} />,
    name: "Ghana Post",
  },
];

export const Sponsors = () => {
  return (
    <section
      id="partners"
      className="container pt-24 sm:py-10"
    >
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Our Delivery Partners
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {partners.map(({ icon, name }: PartnerProps) => (
          <div
            key={name}
            className="flex items-center gap-1 text-muted-foreground/60"
          >
            <span>{icon}</span>
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
