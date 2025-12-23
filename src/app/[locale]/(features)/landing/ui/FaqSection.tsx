import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Is Goalflow really free to use?",
    answer:
      "Yes! Our Free Plan includes unlimited tasks and lists, the Pomodoro timer, and streak tracking for up to 2 projects. It is perfect for students or individuals starting their productivity journey.",
  },
  {
    question: "What exactly do I get with the Pro Plan?",
    answer:
      "Pro is designed for power users who want deep insights. You get unlimited projects, the yearly activity heatmap, project performance tables, and comparison charts to help you master your time.",
  },
  {
    question: "What happens if I cancel my Pro subscription?",
    answer:
      "Your data is safe! If you downgrade to the Free Plan, any projects beyond the 2-project limit will be locked. You can still view them, but you won't be able to edit or add tasks until you reactivate Pro or delete existing projects.",
  },
  {
    question: "How does the Pomodoro timer link to my tasks?",
    answer:
      "Every task you create has a built-in timer session indicator. When you start a focus session, it is automatically logged to that specific task, project, and day. This creates your productivity reports automatically.",
  },
  {
    question: "Can I use Goalflow for team collaboration?",
    answer:
      "Currently, Goalflow is optimized for individual productivity, freelancers, and students. We focus on the bridge between your personal planning and your deep-focus execution.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Goalflow and our Pro features.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left font-medium  dark:hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
