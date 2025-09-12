import React from "react";
import "./GoalSection.css";
import { FaSquareArrowUpRight } from "react-icons/fa6";

const goals = [
  {
    id: 1,
    title: "Professional Networking & Mentorship",
    description:
      "Create a vibrant platform where Kerala-educated engineers in Bengaluru can exchange ideas, mentor juniors, and forge rewarding career partnerships.",
    iconColor: "#267540", // KEA green
  },
  {
    id: 2,
    title: "Continuous Learning & Innovation",
    description:
      "Organise tech talks, industrial visits and knowledge-sharing sessions that keep members at the cutting edge of engineering and management trends.",
    iconColor: "#267540",
  },
  {
    id: 3,
    title: "Community Outreach & Social Responsibility",
    description:
      "Channel our collective expertise and resources to uplift the less-privileged through projects in education, health, and sustainable development.",
    iconColor: "#267540",
  },
  {
    id: 4,
    title: "Cultural Bonding & Fellowship",
    description:
      "Celebrate Kerala’s rich heritage and foster camaraderie with family get-togethers, arts & sports events, and festive gatherings.",
    iconColor: "#267540",
  },
];

const GoalSection = () => {
  return (
    <section className="goal-section">
      <div className="goal-container">
        {/* ---------- TITLE & INTRO ---------- */}
        <div className="goal-header">
          <h2 className="goal-title">
            Building a stronger <span className="s">KEA community</span>
          </h2>
          <p className="goal-subtext">
            Since 1992, Kerala Engineers’ Association – Bengaluru has
            empowered alumni to grow professionally, serve society, and stay
            connected to their roots. Here’s how we make it happen:
          </p>
        </div>

        {/* ---------- GOAL CARDS ---------- */}
        <div className="goal-cards">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <div
                className="goal-icon"
                style={{ backgroundColor: goal.iconColor }}
              >
                <FaSquareArrowUpRight />
              </div>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalSection;
