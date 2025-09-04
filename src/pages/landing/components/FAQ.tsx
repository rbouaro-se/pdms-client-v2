import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How do I schedule a delivery?",
    answer:
      "You can schedule a delivery online through our website or mobile app, or call our customer service hotline.",
    value: "item-1",
  },
  {
    question: "Can I track my parcel in real-time?",
    answer:
      "Yes! Every delivery comes with real-time tracking so you always know where your parcel is.",
    value: "item-2",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We offer nationwide delivery across Ghana, including both urban and rural locations.",
    value: "item-3",
  },
  {
    question: "What types of items can I send?",
    answer:
      "We deliver parcels, documents, packages, and bulk shipments. For special items, please contact our support.",
    value: "item-4",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team via phone, email, or live chat on our website.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
