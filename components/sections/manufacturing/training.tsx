import { AppWindow } from "@/components/sections/solution/app-window";
import { Eyebrow } from "@/components/ui/eyebrow";
import { trainingApplications, trainingSequence } from "@/content/manufacturing";
import shared from "@/components/sections/solution/solution.module.css";
import { IsoBoxes, enclosureBoxes, project, viewBoxFor, type Vec3 } from "./iso";
import styles from "./manufacturing.module.css";
import previews from "./previews.module.css";

const enclosureCorners: Vec3[] = [[-120, -60, 300], [920, 1240, 0], [0, -60, 700], [800, -60, 700]];

/** Headset view: the door slid forward with the gasket to fit highlighted. */
function VrView() {
  return (
    <div className={previews.vr} role="img" aria-label="VR training view: step 3 of 5, fit the door gasket, with the gasket highlighted on the open enclosure">
      <svg viewBox={viewBoxFor(enclosureCorners, 40)} className={previews.drawing} aria-hidden="true">
        <IsoBoxes boxes={enclosureBoxes({ open: 300, highlight: "gasket" })} />
      </svg>
      <div className={previews.vrStep}>
        <p className={previews.cardKicker}>Step 3 of 5</p>
        <b>Fit the door gasket</b>
        <span>Start at the hinge side and press it into the channel all the way round.</span>
        <span className={previews.stepDots}><i data-done /><i data-done /><i data-active /><i /><i /></span>
      </div>
    </div>
  );
}

/** Tablet AR view: labels over the training model, set to its right. Shown as a proposed extension. */
function ArView() {
  const callouts: [at: Vec3, label: string, y: number][] = [
    [[19, 995, 316], "Hinge kit HK-20", -1080],
    [[400, 1157, 310], "Door gasket GS-1200", -760],
    [[715, 605, 334], "Quarter-turn lock L-3", -260],
  ];
  return (
    <div className={previews.arTablet} role="img" aria-label="Proposed AR extension: a tablet labels the hinge kit, door gasket and quarter-turn lock on the training model">
      <svg viewBox="-320 -1280 1960 1920" className={previews.drawing} aria-hidden="true">
        <IsoBoxes boxes={enclosureBoxes({ highlight: "lock" })} />
        {callouts.map(([at, label, y]) => {
          const [x0, y0] = project(at);
          return (
            <g key={label}>
              <polyline points={`${x0},${y0} 760,${y} 800,${y}`} fill="none" stroke="#2f6fd6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <circle cx={x0} cy={y0} r="18" fill="#2f6fd6" />
              <text x="820" y={y} dy="20" className={previews.arLabel}>{label}</text>
            </g>
          );
        })}
      </svg>
      <small>Proposed AR extension</small>
    </div>
  );
}

const trainees = [
  { name: "Trainee 1", steps: "5 of 5", attempts: 1, result: "Passed" },
  { name: "Trainee 2", steps: "5 of 5", attempts: 3, result: "Passed" },
  { name: "Trainee 3", steps: "3 of 5", attempts: 2, result: "In progress" },
  { name: "Trainee 4", steps: "5 of 5", attempts: 2, result: "Review step 3" },
];

function TrainerDashboard() {
  return (
    <AppWindow label="Trainer dashboard: completed steps, attempts and assessment results for four trainees" title="Training · Enclosure assembly">
      <div className={previews.pane}>
        <div className={previews.toolbar}><b>Assembly and inspection module</b><span className={previews.chip}>5 steps</span></div>
        <div className={previews.table} data-columns="training">
          <span className={previews.th}>Trainee</span><span className={previews.th}>Steps</span><span className={previews.th}>Attempts</span><span className={previews.th}>Assessment</span>
          {trainees.map((row) => (
            <div className={previews.tr} key={row.name}>
              <span><b>{row.name}</b></span>
              <span>{row.steps}</span>
              <span>{row.attempts}</span>
              <span><em data-state={row.result === "Passed" ? "ok" : row.result === "In progress" ? "active" : "short"}>{row.result}</em></span>
            </div>
          ))}
        </div>
      </div>
    </AppWindow>
  );
}

export function Training() {
  return (
    <section className={`site-container ${styles.training}`} aria-labelledby="training-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Industrial training</Eyebrow>
          <h2 id="training-title" data-reveal="lines">Train teams <br />with VR and AR</h2>
        </div>
        <p data-reveal>
          Create training around your equipment, workplace, and approved procedures. Let people practise tasks in VR, or
          use AR guidance to understand components and follow instructions in context.
        </p>
      </div>

      <div className={styles.trainingBoard} data-reveal="scale">
        <div className={styles.trainingHead}>
          <span className={styles.badge}>Illustrative training example</span>
          <h3>Industrial machine assembly and inspection</h3>
        </div>
        <ol className={styles.sequence}>
          {trainingSequence.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <b>{step.title}</b>
              <small>{step.text}</small>
            </li>
          ))}
        </ol>
        <div className={styles.trainingViews}>
          <VrView />
          <TrainerDashboard />
          <ArView />
        </div>
      </div>

      <p className={styles.note} data-reveal>
        Possible applications include {trainingApplications.join(", ").toLowerCase()}. Training content and assessment
        criteria are agreed with your subject experts, and existing 3D assets are reused where practical, adapted for the
        device and the task. This example is a browser preview, not a client deployment.
      </p>
    </section>
  );
}
