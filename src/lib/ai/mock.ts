import { AIProvider } from './provider';

export class MockAIProvider implements AIProvider {
  async generateJSON<T>(prompt: string, _schema: object): Promise<T> {
    const p = prompt.toLowerCase();

    // Research Agent prompt detection
    if (p.includes("destination research") || p.includes("research one startup") || p.includes("research agent")) {
      const isReddit = /"category":\s*"reddit"/i.test(p) || p.includes("category: reddit") || p.includes("r/");
      return {
        active: true,
        official_submission_url: isReddit ? "https://www.reddit.com/r/SideProject/submit" : "https://www.producthunt.com/posts/new",
        category: isReddit ? "reddit" : "startup_directory",
        submission_method: isReddit ? "manual" : "form",
        registration_required: true,
        pricing_type: "free",
        price: null,
        required_fields: ["title", "tagline", "website_url", "description", "category"],
        file_requirements: ["logo_png_512x512", "screenshot_1280x720"],
        automation_policy: isReddit ? "requires_review" : "allowed",
        restrictions: isReddit ? ["No self-promotion on weekdays", "Follow community flair guidelines"] : ["Requires working product"],
        evidence_urls: ["https://example.com/guidelines"],
        confidence: 0.95,
        next_action: isReddit ? "human_review" : "queue_submission",
      } as unknown as T;
    }

    // Content Generation Agent prompt detection
    if (p.includes("copywriter") || p.includes("unique submission package") || p.includes("content agent")) {
      return {
        title: "LaunchPilot — Multi-Product Startup Distribution Engine",
        tagline: "Automate startup launch submissions across 100+ platforms with AI",
        short_description: "LaunchPilot automatically distributes your startup across 100+ directories, launch platforms, and startup communities while enforcing strict submission guidelines.",
        long_description: "LaunchPilot solves distribution fatigue for founders. Write your startup profile once, and our six specialized AI agents research destinations, generate tailored platform-specific copy, validate character limits, and execute automated submissions with zero duplicate posts.",
        founder_intro: "Hi, I built LaunchPilot because submitting a startup to 100+ directories by hand takes 40+ hours of repetitive copy-pasting.",
        problem_statement: "Founders spend dozens of hours manually formatting and submitting their products to directories with inconsistent forms and strict rules.",
        solution_statement: "An autonomous, cloud-only multi-agent engine that formats, plans, and tracks submissions across 100+ directories with human-in-the-loop safeguards.",
        key_features: [
          "Automated Research & Verification across 100+ destinations",
          "Platform-specific AI content generation respecting character limits",
          "Durable queue and browser execution with zero laptop dependency",
          "Built-in UTM tracking and qualified referral analytics",
        ],
        target_audience: "Indie hackers, SaaS founders, and startup growth teams",
        pricing_explanation: "Free open-source self-hosted or cloud starter",
        seo_keywords: ["startup directory", "product launch", "startup distribution", "automated marketing"],
        relevant_tags: ["saas", "marketing", "developer-tools", "productivity", "growth"],
        submission_fields: {
          product_name: "LaunchPilot",
          website: "https://launchpilot.example.com",
          category: "Developer Tools",
        },
        warnings: [],
      } as unknown as T;
    }

    // Planner Agent prompt detection
    if (p.includes("submission planning") || p.includes("execution plan") || p.includes("planner")) {
      const isReddit = /"category":\s*"reddit"/i.test(p) || p.includes("category: reddit") || p.includes("r/");
      return {
        selected_adapter: isReddit ? "reddit-draft" : "generic-form",
        eligibility: isReddit ? "review_required" : "eligible",
        reason: isReddit ? "Reddit posts require founder review per spam safeguards" : "Public directory form is verified and accessible",
        field_mapping: {
          title: "name",
          tagline: "tagline",
          url: "website_url",
          description: "short_description",
        },
        required_intervention: isReddit ? "approval" : "none",
        idempotency_key: "idemp_" + Date.now(),
      } as unknown as T;
    }

    // Monitoring Agent prompt detection
    if (p.includes("submission monitoring agent") || p.includes("monitor existing submissions")) {
      return {
        status: "approved",
        evidence_url: "https://directory.example.com/products/launchpilot",
        notes: "Listing verified live and indexed on directory catalogue.",
        next_action: "update_record",
      } as unknown as T;
    }

    // Analytics Agent prompt detection
    if (p.includes("growth analytics specialist") || p.includes("analyze distribution campaign")) {
      return {
        ranked_destinations: [
          { name: "Product Hunt", traffic: 450, conversions: 38, approvalRate: 1.0, recommendation: "scale" },
          { name: "SaaSHub", traffic: 180, conversions: 14, approvalRate: 1.0, recommendation: "maintain" },
          { name: "Launching Next", traffic: 95, conversions: 7, approvalRate: 1.0, recommendation: "maintain" },
          { name: "r/SideProject", traffic: 320, conversions: 24, approvalRate: 1.0, recommendation: "scale" },
        ],
        summary: "Directory distribution generated 1,045 qualified visits with an aggregate 7.9% signup conversion rate.",
        key_insights: [
          "Product Hunt and Reddit drove 73% of qualified traffic",
          "Automated directory listings provide continuous long-tail backlink and referral value",
        ],
      } as unknown as T;
    }

    // Default fallback
    return {} as unknown as T;
  }

  async generateText(prompt: string): Promise<string> {
    return `Mock AI Response for: ${prompt.slice(0, 60)}...`;
  }
}
