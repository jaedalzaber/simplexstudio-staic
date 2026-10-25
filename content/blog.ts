import type { Route } from "next";
import type { BlogCategory, BlogPost } from "./types";

export const blogCategories: readonly BlogCategory[] = ["Design", "Software", "Lead Generation"];

/** Posts per listing page: one featured post plus a grid of six. */
export const blogPageSize = 7;

const cover = (alt: string, wide = false) => ({ alt, width: wide ? 1100 : 522, height: wide ? 620 : 358 });

const author = {
  name: "Jaed Al Zaber",
  role: "CEO & Creative Director",
  photo: { alt: "", width: 140, height: 140 },
};

// Listing order is display order: the first post in each category is featured.
// Posts without a `body` appear on the listing only. Add `src` to a cover to
// replace its grey placeholder.
export const posts: BlogPost[] = [
  {
    slug: "redesign-vs-refresh",
    title: "Redesign vs. Refresh: How to Make the Right Call Before Committing Budget",
    summary: "",
    status: "published",
    date: "2026-10-05",
    readMinutes: 13,
    categories: ["Design", "Software"],
    cover: cover("Hand pointing along a path from baseline and hypothesis to redesign", true),
  },
  {
    slug: "validate-ai-mvp",
    title: "How to Validate an AI MVP Before Full Build: 5 Risks to Test First",
    summary: "An impressive AI demo is not the same as a useful AI product. Here is how we test value, capability, context, recovery, and readiness before a team commits to a full build.",
    status: "published",
    date: "2026-10-23",
    readMinutes: 9,
    categories: ["Design", "Software"],
    cover: cover("Two approaches compared: adding AI for its own sake versus solving a user problem"),
    author,
    body: [
      { type: "paragraph", text: "A good AI demo is easy to love. It runs on hand-picked inputs, in front of people who already want it to work. Real users are less generous: they type half a request, skip the detail that matters, and take a confident answer at face value even when it is wrong." },
      { type: "paragraph", text: "That gap between a convincing demo and a dependable product is where most AI budgets disappear. This guide is the checklist we use with clients before anyone commits to a full build. It splits the uncertainty into five risks, each with its own inexpensive test, so you learn what could sink the product while changes are still cheap." },
      { type: "video", poster: { alt: "Walkthrough of the five-risk framework", width: 720, height: 405 }, caption: "A short walkthrough of the five-risk framework." },
      { type: "heading", id: "demo-vs-product", text: "Why a Great AI Demo Isn’t a Great AI Product" },
      { type: "paragraph", text: "Model quality is only one ingredient. A capable model pointed at the wrong problem still produces a product nobody needs. A model without the right context guesses. And a model that is right most of the time still fails the people who cannot tell when it is wrong." },
      { type: "figure", image: { alt: "Diagram: a good model plus the wrong problem, missing context, and poor recovery adds up to a bad product", width: 720, height: 400 }, caption: "A good model is only one part of a good AI product." },
      { type: "paragraph", text: "Validation gets manageable once you separate those failure modes. We test five of them:" },
      {
        type: "list",
        ordered: true,
        items: [
          { lead: "Value:", text: "whether AI solves a real problem better than what people do today." },
          { lead: "Capability:", text: "whether it does the job reliably, not just once." },
          { lead: "Context:", text: "whether the system has the information it needs at the moment it needs it." },
          { lead: "Recovery:", text: "whether people can spot a wrong output and fix it quickly." },
          { lead: "Readiness:", text: "whether the AI workflow measurably beats the current one." },
        ],
      },
      { type: "paragraph", text: "Each risk needs its own test. Passing one tells you nothing about the others." },
      { type: "heading", id: "risk-value", text: "Risk 1 — Value: Should You Build This at All?" },
      { type: "paragraph", text: "Start with the problem, not the model. Who has it, how often, and what do they do about it today? If people already solve it well with a spreadsheet and ten minutes, an AI feature has a high bar to clear." },
      { type: "paragraph", text: "Because AI features are now everywhere, users judge them harshly. A modest improvement rarely changes behaviour; the feature needs to make the task dramatically faster, cheaper, or possible for the first time." },
      { type: "callout", text: "Quick test: describe the AI outcome to five target users without showing any interface. If they can’t say what they would stop doing because of it, the value isn’t there yet." },
      { type: "heading", id: "risk-capability", text: "Risk 2 — Capability: Can AI Do the Job Reliably?" },
      { type: "paragraph", text: "One great answer proves very little. Collect 30–50 real examples of the task, including the messy ones, and run them through the simplest possible setup. Often a prompt and a spreadsheet are enough." },
      { type: "paragraph", text: "Score the results against what a competent person would produce. Look at the spread, not the average: a system that is excellent 80% of the time and badly wrong 20% of the time may be worse than no automation at all." },
      {
        type: "list",
        items: [
          { text: "Use real inputs, not examples written to suit the model." },
          { text: "Agree on what “good enough” means before you look at results." },
          { text: "Track the worst failures as closely as the success rate." },
        ],
      },
      { type: "heading", id: "risk-context", text: "Risk 3 — Context: Does AI Have What It Needs?" },
      { type: "paragraph", text: "Many failures blamed on the model are really missing information. The model can’t see the customer’s history, the latest price list, or the rule everyone on the team simply knows." },
      { type: "paragraph", text: "Map every piece of information a person uses to do the task well, then check which of it the system can actually reach, in what format, and how fresh it is. Gaps here are usually integration work, and they belong in the estimate." },
      { type: "heading", id: "risk-recovery", text: "Risk 4 — Recovery: Can People Catch and Fix Mistakes?" },
      { type: "paragraph", text: "Every AI system will be wrong sometimes. What matters is what happens next. Can users tell when an answer is uncertain? Can they see where it came from? Can they correct it in one step rather than starting over?" },
      { type: "paragraph", text: "Prototype the failure path before the happy path. Show users a deliberately wrong output and watch whether they notice and how they recover. Treat review, edit, and undo as first-class features, not afterthoughts." },
      { type: "heading", id: "risk-readiness", text: "Risk 5 — Readiness: Does It Beat the Current Workflow?" },
      { type: "paragraph", text: "Finally, compare the whole AI-assisted workflow with the one people use today, end to end. Include the time spent reviewing outputs, fixing errors, and switching tools. A faster draft that takes longer to check is not a win." },
      { type: "paragraph", text: "Define one or two measures in advance, such as time to complete the task or the share of outputs used without edits, and run a small pilot with real users. If the numbers move, you have earned the full build." },
      { type: "heading", id: "putting-it-together", text: "Putting It Together" },
      { type: "paragraph", text: "These tests are deliberately small: most take days, not months. Run them in order, stop when one fails, and fix the cause before moving on. You end up with a product decision based on evidence rather than on how impressive the demo looked in the room." },
      { type: "paragraph", text: "If you are weighing an AI feature and want a second opinion on where the risks are, we’re happy to talk it through." },
    ],
  },
  {
    slug: "ux-roi",
    title: "UX ROI: What Bad UX Really Costs, and How to Estimate the Return on Fixing It",
    summary: "",
    status: "published",
    date: "2026-10-19",
    readMinutes: 13,
    categories: ["Design", "Lead Generation"],
    cover: cover("System Usability Scale chart with acceptability ranges"),
  },
  {
    slug: "sports-marketing-platform",
    title: "Designing a Sports Marketing Platform: A Case Study",
    summary: "",
    status: "published",
    date: "2026-10-19",
    readMinutes: 15,
    categories: ["Design", "Lead Generation"],
    cover: cover("Sports marketing platform dashboard"),
  },
  {
    slug: "product-design-trends-2026",
    title: "Product Design Trends for 2026: What Matters for Product Teams",
    summary: "",
    status: "published",
    date: "2026-10-21",
    readMinutes: 15,
    categories: ["Design", "Software"],
    cover: cover("2026 product design trends illustration"),
  },
  {
    slug: "yacht-marketplace-design",
    title: "Marketplace Design for Yacht Sales: From First Search to Enquiry",
    summary: "",
    status: "published",
    date: "2026-10-06",
    readMinutes: 8,
    categories: ["Design", "Lead Generation"],
    cover: cover("Yacht marketplace interface"),
  },
  {
    slug: "product-design-process",
    title: "Our Product Design Process, Step by Step",
    summary: "",
    status: "published",
    date: "2026-10-06",
    readMinutes: 10,
    categories: ["Design", "Software"],
    cover: cover("Process of product design poster"),
  },
];

/** Posts with a published article page. */
export function articles() {
  return posts.filter((post) => post.status === "published" && post.body);
}

/** A post as listed on cards: everything except the body, plus its page link. */
export type PostTile = Omit<BlogPost, "body"> & { href?: Route };

export function postTiles(): PostTile[] {
  return posts
    .filter((post) => post.status === "published")
    .map(({ body, ...post }) => ({ ...post, href: body ? (`/blog/${post.slug}` as Route) : undefined }));
}
