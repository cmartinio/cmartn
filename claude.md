# System Context & Project Guidelines: Website Rebuild

## 1. Project Overview
This project involves the complete architectural rebuild and redesign of two interconnected static sites hosted on Cloudflare Pages, pulling directly from GitHub. The goal is to transition from an amateur, legacy state to a highly polished, "long and lasting" enterprise-grade digital presence.

**The Architecture:**
1. **Primary Hub:** Personal website living at `cmartn.com` (Repository: `https://github.com/cmartinio/cmartn`).
2. **Content Hub:** Independent blog living at `blog.cmartn.com`, accessible seamlessly from the primary hub. 

*Note: This `claude.md` is a living document and the requirements here will be iteratively improved.*

## 2. Subject Persona & Content Strategy
You are tasked with scraping, parsing, and intelligently refactoring all existing content from the legacy site. When upgrading this content, ensure the tone reflects the following professional persona:
* **Professional Identity:** Senior IT Professional and Solutions Architect based in Zurich.
* **Core Competencies:** Network engineering, systems architecture, cloud infrastructure, and high-level project design (e.g., modern AI-integrated financial data terminals).
* **Technical Passions (To highlight in blog/projects):** Advanced homelab environments (Proxmox, VMware vSphere, Kubernetes, Docker), deployment and benchmarking of local LLMs (DeepSeek, Qwen, Gemma), and quantitative financial research tools. 
* **Tone:** Authoritative, clean, highly technical yet accessible, valuing digital privacy and open-source philosophies. 

## 3. Design System & UX Principles
Both sites must share a unified design system that screams "enterprise, polished, and sleek." 

* **Inspiration:** [Anthropic.com](https://www.anthropic.com/) - highly refined typography, generous whitespace, subtle interactions, and a focus on content over flashy animations.
* **Color Themes:** * **Light Mode:** Crisp, high-contrast, minimalist, and academic.
    * **Dark Mode (Strict Requirement):** Must use the **Gruvbox** color palette. Focus on its warm, earthy, low-contrast dark themes (e.g., `#282828` backgrounds, `#ebdbb2` foregrounds, and muted retro accents for syntax and links) to ensure it is extremely easy on the eyes.
* **Responsive:** flawless execution on mobile, tablet, and ultra-wide displays.

## 4. Execution Directives for Claude Code
When executing tasks in this repository, follow these standard operating procedures:

1.  **Ingestion & Refactoring:** * Parse the existing legacy site files.
    * Extract the raw data and public information.
    * Rewrite and reformat the copy to match the sleek, professional tone outlined in Section 2. Do not just port bad HTML; extract the essence and rebuild the structure.
2.  **Tech Stack Alignment:**
    * Ensure the chosen framework (e.g., Astro, Next.js, or Hugo) is strictly optimized for Cloudflare Pages deployments. 
    * Maintain highly organized component directories to allow the blog and main site to share UI components (like the Gruvbox theme toggle, headers, and typography systems) even if deployed separately.
3.  **Iterative Delivery:**
    * Build the foundation first: setup the routing, the base Anthropic-inspired layout, and the Light/Gruvbox-Dark toggle.
    * Inject the refactored personal info into the `cmartn.com` index.
    * Scaffold the blog architecture for `blog.cmartn.com`.

## 5. Security & Build Rules
* Ensure all builds pass strict linting.
* No unnecessary client-side JavaScript. Keep it static, fast, and secure.
* Respect privacy: avoid third-party trackers or heavy analytics scripts unless explicitly requested.
