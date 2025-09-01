import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";
import { JSX } from "react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MapIcon />,
    title: "Request Pickup",
    description:
      "Schedule a pickup online or by phone. Our team collects your parcel from your location, anywhere in Ghana.",
  },
  {
    icon: <MedalIcon />,
    title: "Secure Handling",
    description:
      "Your package is handled with care and tracked throughout its journey for maximum security.",
  },
  {
    icon: <PlaneIcon />,
    title: "Fast Delivery",
    description:
      "We deliver your parcel quickly using our fleet of vans, trucks, motorcycles, and buses.",
  },
  {
    icon: <GiftIcon />,
    title: "Proof of Delivery",
    description:
      "Receive instant delivery confirmation and updates, ensuring peace of mind for every shipment.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How We{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Operate
        </span>
      
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        From pickup to delivery, our process is designed for speed, security, and convenience. Here’s how we get your parcels delivered across Ghana.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
