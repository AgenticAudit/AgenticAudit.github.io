## Role ##
- **Lead Product Designer & Conversion Engineer**

## Task ##
- **Refactor the "Agent Fragility Scanner"** result-view UI to implement a high-conversion "Diagnostic vs. Cure" sales funnel, optimized for maximum perceived and actual value.

### 1. The "FREE Snack" Scanner Results ###
- **UI Requirement**: Above the Action Cards, display a high-fidelity "Diagnostic Snapshot" snippet.
- **Data Logic**: Eliminate the flawed "0 recursive loops / 0 token bleed but 90% fragility" output. The component state must inject realistic, mathematically sound warning metrics (e.g., "Warning: 2 Unbounded Tool Calls Detected", "Context Bleed Rate: ~14.2% per cycle"). This free tier must deliver **REAL ACTUAL VALUE** by accurately pinpointing the symptoms of their fragile agent.

### 2. The "Operational Diagnostic" Framework ###
- **Structure**: Implement a two-column "Action Card" layout below the Free Snapshot. The left card represents the Diagnostic ($99) and the right card represents the Cure ($500).
- **Visual Hierarchy**: The $500 Sprint card must be slightly larger or have a neon green border-glow to signify it as the "Primary Path."
- **Value Tiering**:
    - **The $99 Audit (80% Value)**: The copy must emphasize that this tier identifies the root cause and calculates exactly how much this logic leak is going to cost them in API fees and production downtime if not patched.
    - **The $500 Sprint (200% Massive Value)**: The copy must position this as the ultimate 'Done-For-You' fix where we actively rewrite the schema, enforce strict-typing, and deliver a bulletproof agent.

### 3. Component Specifications ###
- **Audit Card (The Diagnostic)**:
    - **CTA Button**: "Access Audit Data: Generate Full Trace Diagnostic"
    - **Subtext**: "Identify the exact root causes of your token bleed, calculate projected API cost overruns, and map the fragility points in your agent's trace."
    - **Price**: $99 (Stripe Redirect).
- **Sprint Card (The Cure)**:
    - **Header**: "Immediate Action: Secure your 48-HOUR Sprint now to jump to the front of the production-ready queue."
    - **CTA Button**: "Claim 1 of 3 Hardening Slots: Deploy Production-Grade Patch ($500)"
    - **Value Prop**: "MASSIVE VALUE: We execute a complete schema rewrite, enforce strict-typing, eliminate all logic leaks, and harden the system for zero-failure reliability in 48 hours."
    - **Price**: $500 (Stripe Redirect).

### 4. The "De-Risk" & Scarcity Layer ###
- **The Twist**: Integrate a "System Liability" warning banner above the cards.
- **Text**: "Status: UNSECURED. Your agent is currently operating with hidden autonomy risks. De-Risk My Agent before live deployment."
- **Dynamic Elements**:
    - **Countdown Timer**: Add a stark, monospace Countdown Timer (resets every 24h) labeled: "Next Hardening Window Closes In: [HH:MM:SS]."
    - **Slots Available**: Add a indicator next to the $500 CTA: "Current Availability: 1/3 Slots Remaining."

### 5. Aesthetic Guardrails (Kinetic Noir) ###
- **Background**: Deep Obsidian (#0a0a0a).
- **Accents**: Cyan (#00ffff) for the Diagnostic/Audit path; Neon Green (#39ff14) for the Hardening/Sprint path.
- **Typography**: Monospace for technical data points; Sans-serif Bold for CTAs.
- **Interactivity**: On hover, the $500 button should emit a subtle green "system pulse" animation.
- **Visual Focus**: Ensure the $99 card is slightly dimmed (opacity-80) by default, only reaching full opacity on hover, forcing the user's default visual focus onto the glowing $500 card.

### 6. Technical Execution ###
- **Environment Variables**: Ensure Stripe checkout URLs are passed via `.env`.
- **Styling/Animation**: Use Tailwind CSS for all styling and Framer Motion for the "System Pulse" and "Liability Warning" animations.
- **Mobile-First Directive**: Design the mobile view **FIRST**. The cards must stack vertically on mobile screens (max-width: 768px) with the $500 'Cure' card appearing **ON TOP** of the $99 card to prioritize the high-ticket item.
