import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Goalflow free?",
    answer:
      "Yes! Goalflow is currently in early access and is free to use. You can create as many tasks and projects as you want without paying anything.",
  },
  {
    question: "What is the Pomodoro timer and how does it work?",
    answer:
      "The Pomodoro Technique is a simple way to stay focused. You work for a set time (usually 25 or 50 minutes) and then take a short break. In Goalflow, this timer is built right into your tasks. When you start the timer, the app automatically records exactly how much time you spent working on that specific goal.",
  },
  {
    question: "Why should I use Goalflow instead of a normal to-do list?",
    answer:
      "A normal to-do list only tells you *what* to do. Goalflow helps you actually *do* it. Instead of switching between a calendar, a timer, and a list, we put everything in one place. It saves you energy and helps you focus on your work.",
  },
  {
    question: "Can I see my progress?",
    answer:
      "Yes. Goalflow shows you a 'streak' for every day you finish a task. It also gives you simple reports that show you how many hours you worked each day. It's a great way to stay motivated!",
  },
  {
    question: "Do I need to be a professional to use it?",
    answer:
      "Not at all. Goalflow is built to be very simple. It’s perfect for students learning a new language, freelancers, or anyone who wants to manage their time better without using a complicated app.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Common Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Goalflow.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
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
