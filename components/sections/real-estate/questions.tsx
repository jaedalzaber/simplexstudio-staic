import { SolutionEnquiry } from "@/components/sections/solution/solution-enquiry";
import { questions } from "@/content/real-estate";

export function Questions() {
  return (
    <SolutionEnquiry title="Discuss your real estate project" questions={questions}>
      Share your development, current website, or management requirements. We’ll review what you need and discuss
      the scope, budget, and launch plan.
    </SolutionEnquiry>
  );
}
