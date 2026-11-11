import { DestinationsRepository } from "../database/destinations.repo";
import { DestinationCategory, SubmissionMethod } from "../../types/destination";
import { validateSafeUrl } from "../security/url-guard";
import { COMPREHENSIVE_CATALOGUE } from "./places-catalogue";

export interface ImportResult {
  totalParsed: number;
  redditCount: number;
  websiteCount: number;
  imported: number;
  errors: string[];
}

const GITHUB_RAW_URL = "https://raw.githubusercontent.com/mmccaff/PlacesToPostYourStartup/master/README.md";

// Comprehensive catalog markdown covering master README, community pull requests, and git revision history
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
* /r/InternetIsBeautiful - https://www.reddit.com/r/InternetIsBeautiful/
* /r/LadyBusiness - https://www.reddit.com/r/ladybusiness/
* /r/microsaas - https://www.reddit.com/r/microsaas/
* /r/plugyourproduct - https://www.reddit.com/r/plugyourproduct/
* /r/ProductHunters - https://www.reddit.com/r/ProductHunters/
* /r/RoastMyStartup - https://www.reddit.com/r/roastmystartup
* /r/SaaS - https://www.reddit.com/r/SaaS/
* /r/SeeknWander - https://reddit.com/r/seeknwander
* /r/shamelessplug - https://www.reddit.com/r/shamelessplug/
* /r/SideProject - https://reddit.com/r/sideproject
* /r/SmallBusiness - https://www.reddit.com/r/smallbusiness/
* /r/Startups - https://reddit.com/r/startups
* /r/thesidehustle - https://www.reddit.com/r/thesidehustle/

# Websites
* 10015 Product Finder - https://10015.io/product-finder
* 101 Best Websites - http://www.101bestwebsites.com/
* 10words - https://10words.io
* A1Lab - https://a1lab.tech
* Addictive Tips - http://www.addictivetips.com/
* AdHipster - https://adhipster.com/
* Agent Stack Directory - https://agentstackdirectory.com/submit/
* AI Collection - https://www.thataicollection.com/
* AIMiracle MAG - https://aimiracle.ai
* AiToolsObserver - https://aitoolsobserver.com/
* AIWget - https://aiwget.com/submit
* All My Faves - https://www.allmyfaves.com/
* All Startups - https://www.allstartups.info/Startups/Submit
* All Top Startups - https://alltopstartups.com/submit-startup/
* Alternative To - https://alternativeto.net/
* Alternative To (Github repo) - https://github.com/brentadamson/alternativeto
* Alternative.me - https://alternative.me/
* Altimateguide - https://altimateguide.com/request-inclusion
* Angel List - https://angel.co/join
* AngelList - https://angel.co/
* App 400 - http://apps400.com/
* App Advice - https://appadvice.com/page/about-us
* App Appeal - http://www.appappeal.com/contact/suggest
* App Rater - https://apprater.net/add/
* App Storm - http://formstack.com/forms/envato-appstorm_review
* Appcrawlr - http://appcrawlr.com/
* AppLensy - https://applensy.com/submit
* Appoid - https://appiod.com/submit-app-for-review/
* appPicker - https://www.apppicker.com/
* Apps 400 - https://apps400.com/submit-your-application-for-review
* Apps Listo - https://appslisto.com/submit-your-app/
* Apps Mamma - https://appsmamma.com/submit-your-app/
* Apps Mirror - http://www.appsmirror.com/submit-your-app-for-review
* AppsNow - http://appsnow.us/submit-app-for-review/
* Appstash - http://appstash.co/
* AppsThunder - https://appsthunder.com/submit-your-app/
* AppStorm - http://appstorm.net/
* Appvita - https://www.appvita.com/
* AppZapp - http://www.appzapp.net/en/app-review-request/
* AQX Logistics (US Freight Forwarding & Cross-Border Logistics Engine) - https://aqxlogistics.com
* Arctic Startup - https://arcticstartup.com/
* Aura++ - https://auraplusplus.com/
* Awesome Indie - https://awesomeindie.com
* Awesome Money Platforms - https://github.com/yourusername/awesome-money-platforms
* Awesome Tools - https://awesome.tools/submit
* Be Positive Advertising Agency - https://bepositive.az
* Be Positive Life Planner - https://bepositive.cc/
* BestAIApp - https://bestaiapp.co/featured
* Beta Bound - https://www.betabound.com/announce/
* Beta Page - https://betapage.co/
* Beta Testing - https://betatesting.com/beta-testing
* Betafy - https://www.betafy.co/easysignup/startup
* BetaList - https://betalist.com/
* Beterest - https://beterest.com/submit-startup/
* BizTechXperts - http://biztechxperts.com/?cb3
* Boilerplates Directory - https://boilerplates.directory/submit
* Boing Boing - https://boingboing.net/contact
* BreakPoint - https://breakpoint.io/new/
* Broadwise.org - https://broadwise.org/
* BuiltIn - https://builtin.com/send-us-tip
* BuiltInChicago - https://www.builtinchicago.org/send-us-tip
* Capterra - https://www.capterra.com/vendors/sign-up
* CazaProducto - https://cazaproducto.com
* Cheapbastards - https://cheapbastards.xyz/
* Cloud Surfing - http://www.cloudsurfing.com/
* CloudBook - http://www.cloudbook.net/directories/product-services/product-company-search.php
* Cloudli.st - http://www.cloudli.st/apps/new
* CloudShowPlace - http://www.cloudshowplace.com/add-your-company/
* Cnet - https://upload.cnet.com/
* CodeCanyons - https://codecanyons.net
* Codedelay - https://codedelay.com
* Collaborizm - https://www.collaborizm.com
* Cool Startup Bro - http://www.coolstartupbro.com/
* Crazy About Startups - http://www.crazyaboutstartups.com/index.php/share-your-startup-form
* Crowdstax - https://www.crowdstax.com
* CrozDesk - https://vendor.crozdesk.com/user/signup
* Crunch Base - https://www.crunchbase.com/#/home/index
* CSS Mania - http://www.cssmania.com/submit/
* CtrlAlt.cc - https://ctrlalt.cc/
* daily.dev - https://daily.dev/
* DBX Studio - https://www.dbxstudio.com
* Designer News - https://www.designernews.co/
* deskkit Launches - https://deskkit.app/launch
* Digg - http://digg.com/submit
* Discova - https://www.discova.co/
* Discover Cloud - https://www.discovercloud.com/become-a-vendor
* Early-stage News - https://earlystagenews.com/
* EarlyHunt - https://earlyhunt.com/
* eBool - https://www.ebool.com/submit
* Emoji Launch - https://emojilaunch.com/
* Erlibird - https://erlibird.com/beta-testing
* Esdecode - https://esdecode.com/
* Estartapero - https://estartapero.io/submit
* F6S - https://www.f6s.com/
* FalcoScan - https://falcoscan.com/submit
* Fastbmk - http://fastbmk.com/
* Feed My App - https://feedmyapp.com/submit/
* Feedback Army - http://feedbackarmy.com/feedback.slp
* Fiddy - https://fiddy.co
* FireSpotting - http://firespotting.com/submit
* G2 Crowd - https://www.g2crowd.com/
* Geek Wire - https://geekwire.com/startup-list/
* Geekopedia - http://geekopedia.me/startupsubmit
* Get App - https://getapp.com/
* Getworm - https://getworm.com/submit-startup
* GitHustle - http://www.githustle.com
* GrowthBoosters - https://www.growthboosters.com/product/add
* Gust - https://www.gust.com
* Hackerspad - https://hackerspad.net/submit-software/
* Hackerstreet - https://in.thehackerstreet.com/
* Haro - https://www.helpareporter.com
* HUSEVN Media Downloader - https://husevndl.top
* I Am Wire - http://www.iamwire.com/startups/user/register?uType=Entrepreneur
* Idea Hunt - http://ideahunt.io/
* Inc 42 - https://inc42.com/startup-submission/
* Index.co - https://index.co/startup
* Indie Hackers - https://www.indiehackers.com/
* IndieHunt - https://indiehunt.io/
* Inspired Beta - https://inspiredbeta.com/submit-a-startup/
* Instaking - http://instaking.org/
* Just Gone Live - http://www.justgonelive.com/add-listing
* JustLaunched - https://justlaunched.fyi
* Killer Startups - https://killerstartups.com/submit-startup/
* KitDB - https://kitdb.app/
* Lanci - https://lanci.dev
* Land-book - https://land-book.com/guidelines
* Larasites - https://larasites.com/
* Launch List - http://launchlist.co/submit-a-startup
* Launch Sky - http://launchsky.com/pitch/compose
* Launched - https://launched.deskio.org
* Launchef - https://launchef.com
* LaunchIgniter - https://launchigniter.com/submit
* Launching Next - https://www.launchingnext.com/submit/
* Launching Today - https://www.launching.today/
* Launchory - https://www.launchory.app
* Leakly - https://leakly.ai/
* Loop - https://app.loopinput.com/
* Maker Updates - https://www.makerupdates.com/
* Makerbase - https://makerbase.co/
* MakerHunt - https://makerhunt.io
* MakeUseOf - https://www.makeuseof.com/about/
* Maqtoob - https://maqtoob.com/submit-a-tool
* MEDIAPRONET - https://mediapronet.com/submit
* MeetNewAI - https://meetnewai.com/
* Mevvy - https://mevvy.com/submit-app/
* Micro SaaS Examples - https://www.microsaasexamples.com/
* Mobilzed - https://www.moblized.com/vendors/register
* MosaicHub - http://www.mosaichub.com/
* Museum of Modern Beta - http://momb.socio-kybernetics.net/about
* Mydentify - https://mydentify.com/submit
* Netted - https://www.netted.net/contact-us/
* New-Startups - http://www.new-startups.com/submit/
* Newzino - https://newzino.com/get-covered
* Next Big Product - http://nextbigproduct.net/product-submission/
* Next Big What - https://nextbigwhat.com/
* Nibletz - http://www.nibletz.com/submit-startup
* Nick Launches - https://nicklaunches.com/
* On the App - http://ontheapp.com/about/
* Operation 6 Fig - http://www.operation6fig.com/submit-a-start-up
* Oye Startups - https://oyestartups.com/contact
* Paggu - http://www.paggu.com/
* PainPoint Daily - https://painpointdaily.com
* pFind - http://www.pfind.com/submit
* Phyco - https://phyco.org/submit
* Pineapple - http://pineapple.io/resources/new
* PitchWall - https://pitchwall.co/
* Postmake - https://postmake.io/submit
* Postscapes - http://about.postscapes.com/tools
* PreApps - https://www.preapps.com/
* PriceBoxi - http://www.pricebox.io
* Product Hunt - https://www.producthunt.com/
* ProductWatch - https://productwatch.io/
* Programmable Web - https://www.programmableweb.com/news/how-to-pitch-programmableweb-covering-your-news/2016/11/18
* Project Hatch - https://www.projecthatch.co/your-story/
* Projectium Network - https://projectium.network
* PublicityX - https://www.publicityx.com/startups/new
* PWA Directory - https://pwa.directory/submit
* RadarMakers - https://radarmakers.com/submit
* RandomStartup - https://www.randomstartup.org/#/submit
* RankInPublic - https://rankinpublic.xyz
* Rate My Startup - http://ratemystartup.com/submit-your-startup/
* Really-aweso.me - http://www.really-aweso.me/submit-your-startup/
* Reikut - https://reikut.com/
* Rev 2 - http://www.rev2.org/
* Revleads (formerly CrozDesk) - https://vendor.revleads.com/user/signup
* Robingood - http://tools.robingood.com/
* RoboDebut - https://robodebut.com/submit-with-a-coding-agent
* SaaSCity - https://saascity.io
* SaaSHub - https://www.saashub.com/
* Saasified - https://saasified.co
* SaasRow - https://saasrow.com/
* Saijo's Tools List - https://saijogeorge.com/best-marketing-tools/
* Show HN - https://news.ycombinator.com/showhn.html
* Side Projectors - https://www.sideprojectors.com
* Side Projects - http://sideprojects.web3canvas.com
* SideHunt - https://sidehunt.io/
* SideProjects - https://sideprojects.net
* Signup First - http://signupfirst.com/
* SimilarSites - http://www.similarsites.com/
* SimilarSiteSearch - https://www.similarsitesearch.com/tips.html
* Simple Lister - https://simplelister.com/
* Siteefy - https://siteefy.com/submit-tool?utm_source=placestopost
* SitePatent - https://sitepatent.com/
* Slant - https://www.slant.co/
* SnapMunk - https://www.snapmunk.com/submit-your-startup/
* Softlaunched - https://www.softlaunched.com/
* Softpedia - http://www.softpedia.com/
* Software Advice - https://softwareadvice-markets.questionpro.com/
* Springwise - https://www.springwise.com/spotted/
* Stack Share - https://stackshare.io/
* Start HQ - https://starthq.com/apps/submit
* Start-ups - http://www.start-ups.co/startup-interview-questionnaire/
* Starter Story - https://starterstory.com/
* StartItUp - https://startitup.io/
* Startup 88 - https://startup88.com/
* Startup Base - https://startupbase.io/submit
* Startup Beat - https://startupbeat.com/startup-beat-featured-startup-pitch-guidelines/
* Startup Benchmarks - https://www.startupbenchmarks.com/
* Startup Buffer - https://startupbuffer.com
* Startup Collections - http://startupcollections.com/
* Startup Dope - http://startupdope.com/submit-news/
* Startup Inspire - https://www.startupinspire.com/submit
* Startup John - https://www.startupjohn.com/
* Startup Lift - http://www.startuplift.com/
* Startup Ranking - https://www.startupranking.com/
* Startup Register - http://startupregister.net/register-your-startup/
* Startup Resources - https://startupresources.io
* Startup Stash - https://startupstash.com/
* Startup Tabs - https://startuptabs.com/
* Startup Tracker - https://startuptracker.io/
* StartupBlink - https://www.startupblink.com/
* Startups - http://startups.fm/contact-us
* Startups Gallery - https://startups.gallery/
* Startups List - https://www.startups-list.com/
* State of Tech - https://stateoftech.net/advertise?submit-an-app-for-review
* StompStart - https://stompstart.com/
* Stumbleupon - http://www.stumbleupon.com/submit
* Tabscape - https://www.tapscape.com/
* Tech - http://www.techgreet.com/submit-your-tech-startup/
* Tech Crunch - https://techcrunch.com/
* Tech Faster - http://techfaster.com/submit-your-company/
* Tech Map - https://thetechmap.com/
* Tech Pluto - http://www.techpluto.com
* Tech Tips - http://techattitude.com/contact/
* The Changelog - https://github.com/thechangelog/ping
* The iPhone Mom - https://www.theiphonemom.com/
* The Startup Pitch - http://thestartuppitch.com/post-a-pitch/
* this blog post - https://triphappy.com/blog/131-startup-directories-to-promote-your-startup/1
* Tiny Launch - https://www.tinylaunch.com
* TinyLaunch - https://www.tinylaun.ch/
* Toolfound - https://toolfound.com
* Top Alternatives - https://topalternatives.com/
* Top Similar Sites - http://www.topsimilarsites.com/add.aspx
* Trustradius - https://www.trustradius.com/
* UserCV Blogging Community - https://usercv.com/blogs
* Vantaige - https://vantaige.io/list-your-ai-tool
* Vator - https://www.vator.tv/
* VB Profiles - http://vbprofiles.com/
* Vedika - https://vedika.io/
* Venture Beat - https://venturebeat.com/contact-2
* Venture Bin - http://www.venturebin.com/submit-venture/
* Venture Break - http://venturebreak.com/questions/
* VestingGap - https://www.vestinggap.com/
* Web App Rater - http://www.webapprater.com/webapprater-free-app-review
* WebApps Directory - https://webapps.directory/submit
* Webmenu - http://webmenu.org/
* Website Hunt - https://www.websitehunt.co
* Webwide - https://webwide.io/forums/project-showcase.15/
* Wellfound (formerly AngelList) - https://wellfound.com/
* WibbleWaggle - http://www.wibblewaggle.com/list-startup
* Ycombinator - https://news.ycombinator.com/
* yesRamen - https://yesramen.com/
* YouNoodle - https://ww2.younoodle.com/startups/
* Your Story - https://profiles.yourstory.com/
* ZeroRaised - https://zeroraised.com
* ZPlatform.ai - https://zplatform.ai/
`;

const CATALOGUE_MAP = new Map(COMPREHENSIVE_CATALOGUE.map((c) => [c.slug, c]));

export class GitHubImporter {
  constructor(private destinationsRepo: DestinationsRepository) {}

  async importFromGitHub(customMarkdown?: string): Promise<ImportResult> {
    let markdown = customMarkdown;
    const errors: string[] = [];

    if (!markdown) {
      try {
        const res = await fetch(GITHUB_RAW_URL, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const liveMarkdown = await res.text();
          // Merge live README from GitHub with our full repository catalogue so zero sites are missed
          markdown = this.mergeMarkdowns(FALLBACK_README, liveMarkdown);
        } else {
          errors.push(`GitHub fetch failed with status ${res.status}, using embedded comprehensive catalog.`);
          markdown = FALLBACK_README;
        }
      } catch (err: any) {
        errors.push(`Network fetch error (${err.message}), using embedded comprehensive catalog.`);
        markdown = FALLBACK_README;
      }
    }

    return this.parseAndPersist(markdown, errors);
  }

  private mergeMarkdowns(baseMd: string, extraMd: string): string {
    const parseLines = (md: string) => {
      const lines = md.split("\n");
      let section = "header";
      const reddits = new Map<string, string>();
      const websites = new Map<string, string>();

      for (const l of lines) {
        const t = l.trim();
        if (t.startsWith("# Reddit")) {
          section = "reddit";
          continue;
        }
        if (t.startsWith("# Websites")) {
          section = "websites";
          continue;
        }
        if (t.startsWith("# License") || t.startsWith("## License")) break;
        if (t.startsWith("*")) {
          const c = t.replace(/^\*\s*/, "").trim();
          const mdLink = c.match(/\[(.*?)\]\((.*?)\)/);
          let name = "", url = "";
          if (mdLink) {
            name = mdLink[1].trim();
            url = mdLink[2].trim();
          } else {
            const parts = c.split(/\s+-\s+/);
            if (parts.length >= 2) {
              name = parts[0].trim();
              url = parts.slice(1).join(" - ").trim();
            }
          }
          if (name && url) {
            const key = (name + "::" + url).toLowerCase();
            if (section === "reddit") reddits.set(key, `* ${name} - ${url}`);
            else websites.set(key, `* ${name} - ${url}`);
          }
        }
      }
      return { reddits, websites };
    };

    const b = parseLines(baseMd);
    const e = parseLines(extraMd);

    for (const [k, v] of e.reddits) b.reddits.set(k, v);
    for (const [k, v] of e.websites) b.websites.set(k, v);

    const rList = Array.from(b.reddits.values()).sort();
    const wList = Array.from(b.websites.values()).sort();

    return `# Reddit\n${rList.join("\n")}\n\n# Websites\n${wList.join("\n")}\n`;
  }

  private async parseAndPersist(markdown: string, errors: string[]): Promise<ImportResult> {
    const lines = markdown.split("\n");
    let currentSection: "header" | "reddit" | "websites" = "header";

    let redditCount = 0;
    let websiteCount = 0;
    let imported = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("# Reddit")) {
        currentSection = "reddit";
        continue;
      } else if (trimmed.startsWith("# Websites")) {
        currentSection = "websites";
        continue;
      } else if (trimmed.startsWith("# License") || trimmed.startsWith("## License")) {
        break;
      }

      if (currentSection === "header" || !trimmed.startsWith("*")) {
        continue;
      }

      // Format: * Name - https://example.com or * [Name](https://example.com)
      const parsed = this.parseLine(trimmed, currentSection);
      if (!parsed) continue;

      if (currentSection === "reddit") {
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
          pricing_type: "unknown",
          confidence: parsed.category === "reddit" ? 0.95 : 0.6,
          status: "unverified",
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

  private parseLine(
    line: string,
    section: "reddit" | "websites"
  ): {
    name: string;
    slug: string;
    url: string;
    submissionUrl?: string;
    category: DestinationCategory;
    submissionMethod: SubmissionMethod;
    automationPolicy: "allowed" | "requires_review" | "prohibited" | "unknown";
    adapterKey: string;
  } | null {
    // Strip leading "* "
    const content = line.replace(/^\*\s*/, "").trim();

    let name = "";
    let url = "";

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
        url = dashParts.slice(1).join(" - ").trim();
      } else {
        return null;
      }
    }

    if (!url || !name) return null;

    // Normalize URL
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const { valid } = validateSafeUrl(url);
    if (!valid) return null;

    const slug = this.generateSlug(name, section);

    // Look up known pre-verified catalogue if available
    const known = CATALOGUE_MAP.get(slug);

    if (section === "reddit") {
      return {
        name,
        slug,
        url,
        submissionUrl: known?.submission_url || url,
        category: "reddit",
        submissionMethod: "manual",
        automationPolicy: "requires_review", // Per Reddit anti-spam safeguards
        adapterKey: "reddit-draft",
      };
    }

    if (known) {
      return {
        name,
        slug,
        url,
        submissionUrl: known.submission_url || url,
        category: known.category,
        submissionMethod: known.submission_method,
        automationPolicy: known.automation_policy,
        adapterKey: known.adapter_key,
      };
    }

    // Determine heuristic category
    const lowerName = name.toLowerCase();
    const lowerUrl = url.toLowerCase();

    let category: DestinationCategory = "startup_directory";
    let submissionMethod: SubmissionMethod = "form";
    let adapterKey = "directory";
    let automationPolicy: "allowed" | "requires_review" | "prohibited" | "unknown" = "unknown";

    if (
      lowerName.includes("product hunt") ||
      lowerName.includes("pitchwall") ||
      lowerName.includes("launched") ||
      lowerName.includes("betabound") ||
      lowerName.includes("tiny launch") ||
      lowerName.includes("launchef") ||
      lowerName.includes("daily.dev")
    ) {
      category = "launch_platform";
      adapterKey = "directory";
    } else if (lowerUrl.includes("submit") || lowerUrl.includes("add") || lowerUrl.includes("new")) {
      category = "startup_directory";
      adapterKey = "generic-form";
    } else if (
      lowerName.includes("story") ||
      lowerName.includes("makeuseof") ||
      lowerName.includes("changelog") ||
      lowerName.includes("arctic") ||
      lowerName.includes("techcrunch") ||
      lowerName.includes("venturebeat")
    ) {
      category = "editorial";
      submissionMethod = "email";
      adapterKey = "email-pitch";
      automationPolicy = "requires_review";
    } else if (
      lowerName.includes("hackers") ||
      lowerName.includes("collaborizm") ||
      lowerName.includes("ycombinator") ||
      lowerName.includes("show hn")
    ) {
      category = "community";
      submissionMethod = "manual";
      adapterKey = "reddit-draft";
      automationPolicy = "requires_review";
    }

    return {
      name,
      slug,
      url,
      submissionUrl: url,
      category,
      submissionMethod,
      automationPolicy,
      adapterKey,
    };
  }

  private generateSlug(name: string, section: string): string {
    let base = name
      .toLowerCase()
      .replace(/^\/r\//, "reddit-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (section === "reddit" && !base.startsWith("reddit-")) {
      base = "reddit-" + base;
    }
    return base || "dest-" + Math.random().toString(36).substring(2, 8);
  }
}
