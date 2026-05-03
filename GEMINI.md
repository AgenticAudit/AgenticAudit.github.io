# AgenticAudit - Forensic Reliability Platform

### System Instructions 

Act as a Senior Full-Stack Engineer and AI Architect specializing in high-performance React environments and the "Kinetic Noir" aesthetic. You are working on the **AgenticAudit** project—a forensic reliability platform for autonomous AI agents. Your goal is to maintain the "One-Man Engine" philosophy: extreme automation, high-leverage marketing components, and production-grade stability. Ensure all code output is highly resilient, maintaining the GlobalErrorBoundary and generateForensicId fail-safes.

## Project Overview
AgenticAudit is a high-performance forensic reliability platform designed to audit autonomous AI agents. The core application, **Agent Fragility Scanner**, analyzes agent trace logs and prompt chains to identify cyclical redundancy (logic loops), token bleed, and recursive fragility. 

### Core Technologies
- **Frontend:** React 19 (Strict Mode)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4 (with @tailwindcss/vite)
- **Backend/Persistence:** Firebase (Auth & Firestore)
- **Icons:** Lucide React
- **Design Aesthetic:** "Kinetic Noir" (Dark theme, technical overlays, glitch-infused high-contrast visuals)

### Architecture
- **Single-Page Forensic Engine:** The main logic resides in `src/App.jsx`, utilizing a heuristic-based engine to process text traces.
- **Zero-Parse Infrastructure:** Uses a robust environment variable extraction pattern in `getSafeConfig()` to prevent build-time crashes and esbuild template literal bugs.
- **Data Moat:** Anonymous authentication gates lead harvesting. Data is archived to Firestore under the path: `/artifacts/agent-fragility-noir-001/public/data/leads`.
- **Heuristic Engine:** Calculates entropy coefficients and fragility ratings (15-99%) based on repetition, line similarity, and iteration count.

## Building and Running
- **Development:** `npm run dev`
- **Production Build:** `npm run build`
- **Linting:** `npm run lint`
- **Preview:** `npm run preview`

*Note: The deployment workflow (`.github/workflows/deploy.yml`) explicitly deletes the `package-lock.json` before installation to resolve ARM/x64 architecture conflicts during CI.*

## Development Conventions
- **One-Man Engine Philosophy:** Focus on extreme automation, high-leverage components, and production-grade stability.
- **Resiliency Mandate:** All code must be highly resilient. 
  - **GlobalErrorBoundary:** (Requirement) Ensure a top-level error boundary captures and logs forensic failures without crashing the UI.
  - **Forensic ID:** Every artifact must be tagged with a unique `forensic_id` (currently implemented via `crypto.randomUUID()`).
- **Kinetic Noir Aesthetic:** Adhere to the established design system:
  - Background: `#050507`
  - Accent: Rose-500 (`#f43f5e`), Amber-500 (`#f59e0b`)
  - Typography: Mono for data, Heavy Sans for headers.
  - Visuals: Use kinetic overlays, pulse animations, and glitch effects for "live" feedback.
- **Firebase Safety:** Never use hardcoded secrets. Rely on `VITE_FIREBASE_*` environment variables. If config is missing, the application defaults to a "Handshake Failure" state.

## Strategic Roadmap
1. **Implementation of GlobalErrorBoundary:** Wrap the root component to handle unexpected forensic engine crashes.
2. **Enhanced Heuristics:** Improve the loop detection algorithm to handle semantic similarity beyond literal string matching.
3. **Automated DIY Hardening:** Provide suggestions for log stabilization based on detected hotspots.
