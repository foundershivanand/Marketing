import { DestinationsRepository } from '../database/destinations.repo';
import { DestinationCategory, SubmissionMethod } from '../../types/destination';
import { validateSafeUrl } from '../security/url-guard';

export interface ImportResult {
  totalParsed: number;
  redditCount: number;
  websiteCount: number;
  imported: number;
  errors: string[];
}

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/mmccaff/PlacesToPostYourStartup/master/README.md';

// Embedded fallback README in case GitHub raw content is unreachable or offline
const FALLBACK_README = `
# Reddit
* /r/AlphaandBetausers - https://www.reddit.com/r/alphaandbetausers/
* /r/buildinpublic - https://www.reddit.com/r/buildinpublic/
* /r/Coupons - https://www.reddit.com/r/coupons/
* /r/Design_Critiques - https://www.reddit.com/r/design_critiques/
* /r/Entrepreneur - https://reddit.com/r/entrepreneur
* /r/EntrepreneurRideAlong - https://www.reddit.com/r/EntrepreneurRideAlong/
* /r/IMadeThis - https://reddit.com/r/imadethis
* /r/IndieBiz - https://www.reddit.com/r/indiebiz/
* /r/indiehackers - https://www.reddit.com/r/indiehackers/
* /r/LadyBusiness - https://www.reddit.com/r/ladybusiness/
* /r/microsaas - https://www.reddit.com/r/microsaas/
* /r/plugyourproduct - https://www.reddit.com/r/plugyourproduct/
* /r/RoastMyStartup - https://www.reddit.com/r/roastmystartup
* /r/SaaS - https://www.reddit.com/r/SaaS/
* /r/shamelessplug - https://www.reddit.com/r/shamelessplug/
* /r/SideProject - https://reddit.com/r/sideproject
* /r/SmallBusiness - https://www.reddit.com/r/smallbusiness/
* /r/Startups - https://reddit.com/r/startups
* /r/thesidehustle - https://www.reddit.com/r/thesidehustle/

# Websites
* 10words - https://10words.io
* AI Collection - https://www.thataicollection.com/
* All My Faves - https://www.allmyfaves.com/
* All Startups - https://www.allstartups.info/Startups/Submit
* All Top Startups - https://alltopstartups.com/submit-startup/
* Alternative To - https://alternativeto.net/
* Alternative.me - https://alternative.me/
* AngelList - https://angel.co/
* App Rater - https://apprater.net/add/
* Appoid - https://appiod.com/submit-app-for-review/
* appPicker - https://www.apppicker.com/
* Apps Listo - https://appslisto.com/submit-your-app/
* Apps Mamma - https://appsmamma.com/submit-your-app/
* AppsThunder - https://appsthunder.com/submit-your-app/
* Appvita - https://www.appvita.com/
* Arctic Startup - https://arcticstartup.com/
* Awesome Indie - https://awesomeindie.com
* Beta Bound - https://www.betabound.com/announce/
* Beta Testing - https://betatesting.com/beta-testing
* BuiltInChicago - https://www.builtinchicago.org/send-us-tip
* Capterra - https://www.capterra.com/vendors/sign-up
* Collaborizm - https://www.collaborizm.com
* CrozDesk - https://vendor.crozdesk.com/user/signup
* Crunch Base - https://www.crunchbase.com/#/home/index
* Discover Cloud - https://www.discovercloud.com/become-a-vendor
* eBool - https://www.ebool.com/submit
* F6S - https://www.f6s.com/
* G2 Crowd - https://www.g2crowd.com/products/new
* Geek Wire - https://geekwire.com/startup-list/
* Get App - https://getapp.com/
* Getworm - https://getworm.com/submit-startup
* Gust - https://www.gust.com
* Inc 42 - https://inc42.com/startup-submission/
* Indie Hackers - https://www.indiehackers.com/
* Killer Startups - https://killerstartups.com/submit-startup/
* Land-book - https://land-book.com/guidelines
* Launched - https://launched.io/SubmitStartup
* LaunchIgniter - https://launchigniter.com/submit
* Launching Next - https://www.launchingnext.com/submit/
* Loop - https://app.loopinput.com/
* MakeUseOf - https://www.makeuseof.com/about/
* Micro SaaS Examples - https://www.microsaasexamples.com/
* Netted - https://www.netted.net/contact-us/
* Next Big What - https://nextbigwhat.com/
* PitchWall - https://pitchwall.co/product/submit
* Postmake - https://postmake.io/submit
* PreApps - https://www.preapps.com/
* Product Hunt - https://www.producthunt.com/
* SaaSHub - https://www.saashub.com/
* SaasRow - https://saasrow.com/
* Saijo's Tools List - https://saijogeorge.com/best-marketing-tools/
* Show HN - https://news.ycombinator.com/showhn.html
* Side Projectors - https://www.sideprojectors.com
* Simple Lister - https://simplelister.com/
* SimilarSiteSearch - https://www.similarsitesearch.com/tips.html
* Slant - https://www.slant.co/
* SnapMunk - https://www.snapmunk.com/submit-your-startup/
* Software Advice - https://softwareadvice-markets.questionpro.com/
* Stack Share - https://stackshare.io/
* Starter Story - https://starterstory.com/
* Startup 88 - https://startup88.com/
* Startup Base - https://startupbase.io/submit
* Startup Beat - https://startupbeat.com/startup-beat-featured-startup-pitch-guidelines/
* Startup Benchmarks - https://www.startupbenchmarks.com/
* Startup Buffer - https://startupbuffer.com
* Startup Inspire - https://www.startupinspire.com/submit
* Startup Ranking - https://www.startupranking.com/
* Startup Stash - https://startupstash.com/
* Startup Tabs - https://startuptabs.com/
* Startup Tracker - https://startuptracker.io/
* StartupBlink - https://www.startupblink.com/
* Startups Gallery - https://startups.gallery/
* State of Tech - https://stateoftech.net/advertise?submit-an-app-for-review
* Tabscape - https://www.tapscape.com/
* Tech Map - https://thetechmap.com/
* Tech Pluto - https://www.techpluto.com/submit-a-startup/
* Tiny Launch - https://www.tinylaunch.com
* The Changelog - https://github.com/thechangelog/ping
* Vator - https://www.vator.tv/
* Web App Rater - https://webapprater.com/submit-your-web-application-for-review-html
* Website Hunt - https://www.websitehunt.co
* Ycombinator - https://news.ycombinator.com/
`;

export class GitHubImporter {
  constructor(private destinationsRepo: DestinationsRepository) {}

  async importFromGitHub(customMarkdown?: string): Promise<ImportResult> {
    let markdown = customMarkdown;
    const errors: string[] = [];

    if (!markdown) {
      try {
        const res = await fetch(GITHUB_RAW_URL, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          markdown = await res.text();
        } else {
          errors.push(`GitHub fetch failed with status ${res.status}, using embedded fallback repository.`);
          markdown = FALLBACK_README;
        }
      } catch (err: any) {
        errors.push(`Network fetch error (${err.message}), using embedded fallback repository.`);
        markdown = FALLBACK_README;
      }
    }

    return this.parseAndPersist(markdown, errors);
  }

  private async parseAndPersist(markdown: string, errors: string[]): Promise<ImportResult> {
    const lines = markdown.split('\n');
    let currentSection: 'header' | 'reddit' | 'websites' = 'header';

    let redditCount = 0;
    let websiteCount = 0;
    let imported = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('# Reddit')) {
        currentSection = 'reddit';
        continue;
      } else if (trimmed.startsWith('# Websites')) {
        currentSection = 'websites';
        continue;
      } else if (trimmed.startsWith('# License') || trimmed.startsWith('## License')) {
        break;
      }

      if (currentSection === 'header' || !trimmed.startsWith('*')) {
        continue;
      }

      // Format: * Name - https://example.com or * [Name](https://example.com)
      const parsed = this.parseLine(trimmed, currentSection);
      if (!parsed) continue;

      if (currentSection === 'reddit') {
        redditCount++;
      } else {
        websiteCount++;
      }

      try {
        await this.destinationsRepo.upsert({
          name: parsed.name,
          slug: parsed.slug,
          source_url: parsed.url,
          submission_url: parsed.submissionUrl || parsed.url,
          category: parsed.category,
          submission_method: parsed.submissionMethod,
          automation_policy: parsed.automationPolicy,
          pricing_type: 'unknown',
          confidence: parsed.category === 'reddit' ? 0.9 : 0.5,
          status: 'unverified',
          adapter_key: parsed.adapterKey,
        });
        imported++;
      } catch (err: any) {
        errors.push(`Failed to import "${parsed.name}": ${err.message}`);
      }
    }

    return {
      totalParsed: redditCount + websiteCount,
      redditCount,
      websiteCount,
      imported,
      errors,
    };
  }

  private parseLine(line: string, section: 'reddit' | 'websites'): {
    name: string;
    slug: string;
    url: string;
    submissionUrl?: string;
    category: DestinationCategory;
    submissionMethod: SubmissionMethod;
    automationPolicy: 'allowed' | 'requires_review' | 'prohibited' | 'unknown';
    adapterKey: string;
  } | null {
    // Strip leading '* '
    const content = line.replace(/^\*\s*/, '').trim();

    let name = '';
    let url = '';

    // Pattern 1: [Name](URL)
    const mdLinkMatch = content.match(/\[(.*?)\]\((.*?)\)/);
    if (mdLinkMatch) {
      name = mdLinkMatch[1].trim();
      url = mdLinkMatch[2].trim();
    } else {
      // Pattern 2: Name - URL
      const dashParts = content.split(/\s+-\s+/);
      if (dashParts.length >= 2) {
        name = dashParts[0].trim();
        url = dashParts.slice(1).join(' - ').trim();
      } else {
        return null;
      }
    }

    if (!url || !name) return null;

    // Normalize URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const { valid } = validateSafeUrl(url);
    if (!valid) return null;

    const slug = this.generateSlug(name, section);

    if (section === 'reddit') {
      return {
        name,
        slug,
        url,
        submissionUrl: url,
        category: 'reddit',
        submissionMethod: 'manual',
        automationPolicy: 'requires_review', // Per Reddit policy blueprint
        adapterKey: 'reddit-draft',
      };
    }

    // Determine heuristic category
    const lowerName = name.toLowerCase();
    const lowerUrl = url.toLowerCase();

    let category: DestinationCategory = 'startup_directory';
    let submissionMethod: SubmissionMethod = 'form';
    let adapterKey = 'directory';

    if (lowerName.includes('product hunt') || lowerName.includes('pitchwall') || lowerName.includes('launched')) {
      category = 'launch_platform';
      adapterKey = 'directory';
    } else if (lowerUrl.includes('submit') || lowerUrl.includes('add') || lowerUrl.includes('new')) {
      category = 'startup_directory';
      adapterKey = 'generic-form';
    } else if (lowerName.includes('story') || lowerName.includes('makeuseof') || lowerName.includes('changelog')) {
      category = 'editorial';
      submissionMethod = 'email';
      adapterKey = 'email-pitch';
    }

    return {
      name,
      slug,
      url,
      submissionUrl: url,
      category,
      submissionMethod,
      automationPolicy: 'unknown', // Unknown must never be treated as allowed
      adapterKey,
    };
  }

  private generateSlug(name: string, section: string): string {
    let base = name
      .toLowerCase()
      .replace(/^\/r\//, 'reddit-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (section === 'reddit' && !base.startsWith('reddit-')) {
      base = 'reddit-' + base;
    }
    return base || 'dest-' + Math.random().toString(36).substring(2, 8);
  }
}
