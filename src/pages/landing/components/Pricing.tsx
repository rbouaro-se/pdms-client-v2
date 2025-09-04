import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: string;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Standard Delivery",
    popular: PopularPlanType.NO,
    price: "₵20",
    description:
      "Reliable delivery within 12 hours. Perfect for everyday parcels and business needs.",
    buttonText: "Choose Standard",
    benefitList: [
      "Up to 10kg",
      "12 hour delivery",
      "Real-time tracking",
      "Door-to-door service",
      "Basic support",
    ],
  },
  {
    title: "Regular Delivery",
    popular: PopularPlanType.NO,
    price: "₵15",
    description:
      "Affordable option for non-urgent deliveries. Delivered within 48 hours.",
    buttonText: "Choose Regular",
    benefitList: [
      "Up to 20kg",
      "48 hour delivery",
      "Real-time tracking",
      "Door-to-door service",
      "Basic support",
    ],
  },
  {
    title: "Same-Day Delivery",
    popular: PopularPlanType.YES,
    price: "₵35",
    description:
      "Guaranteed delivery within the same day (24hrs). For urgent parcels and documents.",
    buttonText: "Choose Same-Day",
    benefitList: [
      "Up to 5kg",
      "Delivery within 24 hours",
      "Priority support",
      "Real-time tracking",
      "Insurance included",
    ],
  },
  {
    title: "Express Delivery",
    popular: PopularPlanType.NO,
    price: "₵50",
    description:
      "Fastest delivery option. Get your parcel delivered within 6-8 hours.",
    buttonText: "Choose Express",
    benefitList: [
      "Up to 5kg",
      "Delivery within 6-8 hours",
      "Priority support",
      "Real-time tracking",
      "Insurance included",
    ],
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Delivery
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "} Pricing {" "}
        </span>
        Plans
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Choose the best delivery option for your needs. Fast, secure, and affordable for everyone.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge
                    variant="secondary"
                    className="text-sm text-primary"
                  >
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">{pricing.price}</span>
                <span className="text-muted-foreground"> /parcel</span>
              </div>
              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button className="w-full">{pricing.buttonText}</Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
