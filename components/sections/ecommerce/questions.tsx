import { SolutionEnquiry } from "@/components/sections/solution/solution-enquiry";
import { questions } from "@/content/ecommerce";

export function Questions() {
  return (
    <SolutionEnquiry title="Tell us about your project" questions={questions}>
      Send your product or store link, your goals, and your target launch date. We’ll review your requirements
      and discuss scope, timing, and budget.
    </SolutionEnquiry>
  );
}
