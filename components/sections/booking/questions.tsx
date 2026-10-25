import { SolutionEnquiry } from "@/components/sections/solution/solution-enquiry";
import { questions } from "@/content/booking";

export function Questions() {
  return (
    <SolutionEnquiry title="Discuss your booking project" questions={questions}>
      Tell us what customers need to book, how your team manages it today, and which website, app, or on-site tools
      you need. We’ll discuss the scope, integrations, budget, and launch plan.
    </SolutionEnquiry>
  );
}
