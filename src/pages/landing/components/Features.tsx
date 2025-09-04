import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image1 from "@/assets/testimony-1.jpg";
import image2 from "@/assets/testimony-2.jpg";
import image3 from "@/assets/testimony-3.jpg";

interface TestimonyProps {
  name: string;
  message: string;
  image: string;
}

const testimonies: TestimonyProps[] = [
  {
    name: "Kwame A.",
    message:
      "Delivery Express got my package to Kumasi in less than 24 hours. Fast, reliable, and friendly service!",
    image: image1,
  },
  {
    name: "Ama S.",
    message:
      "I love the real-time tracking. I always know where my parcel is. Highly recommended for business deliveries!",
    image: image2,
  },
  {
    name: "Yaw B.",
    message:
      "Affordable rates and professional drivers. My fragile items arrived safely. Will use again!",
    image: image3,
  },
];

export const Features = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        What Our{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Customers Say
        </span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonies.map(({ name, message, image }: TestimonyProps) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{message}</p>
            </CardContent>
            <CardFooter>
              <img
                src={image}
                alt={name}
                className="w-[100px] lg:w-[120px] mx-auto rounded-full bg-white"
                style={{ background: "none" }}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
