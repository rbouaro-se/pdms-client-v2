import { Statistics } from "./Statistics";
import deliveryVan from "@/assets/delivery-truck-with-big-box.webp";
import { Typography } from "@mui/joy";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-15 sm:py-24"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={deliveryVan}
            alt="Delivery Van"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Delivery Express
              </h2>
              <Typography className="text-muted-foreground "
                sx={{
                  fontSize: "1.25rem",
                  lineHeight: "1.75rem",
                  marginTop: "1rem",
                }}
              >
                Delivery Express is Ghana’s trusted logistics partner, dedicated to providing fast, secure, and reliable delivery services for individuals and businesses. Our mission is to connect people and businesses through efficient transportation solutions, ensuring every parcel arrives safely and on time.
                <br /><br />
                We offer nationwide coverage, real-time tracking, affordable rates, and a professional team committed to your satisfaction. Experience hassle-free deliveries with our modern fleet of vans, trucks, motorcycles, and buses.
              </Typography>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
