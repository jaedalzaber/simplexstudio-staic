"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./services.module.css";

const projects = [
  {
    name: "Slattery Auctions",
    location: "Australia · Auctions, heavy machinery",
    image: "/images/services/slattery-auctions.png",
    alt: "Online auction website displayed on a desktop monitor with cars featured",
    stats: [["12+", "Years in market"], ["98%", "Client referral rate"], ["5+", "Years average collaboration"]],
  },
  {
    name: "Toto",
    location: "Canada · Government & public service",
    image: "/images/services/toto-community.png",
    alt: "Community service app displayed on a phone against a blue interface",
    stats: [["12+", "Years on market"]],
  },
];

export function ProjectsCarousel() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + projects.length) % projects.length);
  }

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label="Selected client work">
      <div className={styles.carouselControls}>
        <span aria-live="polite" aria-atomic="true">Project {active + 1} of {projects.length}</span>
        <button type="button" onClick={() => move(-1)} aria-label="Show previous project"><span aria-hidden="true">←</span></button>
        <button type="button" onClick={() => move(1)} aria-label="Show next project"><span aria-hidden="true">→</span></button>
      </div>
      <article className={styles.projectSlide} role="group" aria-roledescription="slide" aria-label={`${project.name}, ${active + 1} of ${projects.length}`}>
        <Image className={styles.projectArt} src={project.image} alt={project.alt} width={1760} height={1148} sizes="(max-width: 760px) 100vw, 70vw" priority={active === 0} />
        <div className={styles.projectInfo}>
          <div className={styles.projectName}>
            <h3>{project.name} <span aria-hidden="true">↗</span></h3>
            <p>{project.location}</p>
          </div>
          <div className={styles.projectStats}>
            {project.stats.map(([value, label]) => <div key={label}><strong>{value}<i aria-hidden="true">↑</i></strong><span>{label}</span></div>)}
          </div>
        </div>
      </article>
    </div>
  );
}
