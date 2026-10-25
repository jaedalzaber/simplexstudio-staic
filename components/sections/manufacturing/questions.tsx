import { SolutionEnquiry } from "@/components/sections/solution/solution-enquiry";
import { questions } from "@/content/manufacturing";

export function Questions() {
  return (
    <SolutionEnquiry title="Discuss your manufacturing or logistics project" questions={questions}>
      Tell us what you make or move, how your team works today, and where you need better software or visibility.
      We’ll discuss the workflows, data, visuals, and integrations your project needs.
    </SolutionEnquiry>
  );
}
