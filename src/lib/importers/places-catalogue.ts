// Comprehensive verified catalog of all destinations from mmccaff/PlacesToPostYourStartup
// (incorporates master README, all community pull requests, and git revision history)
import { DestinationCategory, SubmissionMethod, AutomationPolicy, DestinationStatus } from "../../types/destination";

export interface CatalogueDestination {
  name: string;
  slug: string;
  source_url: string;
  submission_url: string;
  category: DestinationCategory;
  submission_method: SubmissionMethod;
  automation_policy: AutomationPolicy;
  pricing_type: string;
  adapter_key: string;
  confidence: number;
  status: DestinationStatus;
  http_status: number;
  sources: string[];
}

export const COMPREHENSIVE_CATALOGUE: CatalogueDestination[] = [
  {
    "name": "/r/Design_Critiques",
    "slug": "reddit-design-critiques",
    "source_url": "https://www.reddit.com/r/design_critiques/",
    "submission_url": "https://www.reddit.com/r/design_critiques/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/buildinpublic",
    "slug": "reddit-buildinpublic",
    "source_url": "https://www.reddit.com/r/buildinpublic/",
    "submission_url": "https://www.reddit.com/r/buildinpublic/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/Coupons",
    "slug": "reddit-coupons",
    "source_url": "https://www.reddit.com/r/coupons/",
    "submission_url": "https://www.reddit.com/r/coupons/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/EntrepreneurRideAlong",
    "slug": "reddit-entrepreneurridealong",
    "source_url": "https://www.reddit.com/r/EntrepreneurRideAlong/",
    "submission_url": "https://www.reddit.com/r/EntrepreneurRideAlong/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/SaaS",
    "slug": "reddit-saas",
    "source_url": "https://www.reddit.com/r/SaaS/",
    "submission_url": "https://www.reddit.com/r/SaaS/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/LadyBusiness",
    "slug": "reddit-ladybusiness",
    "source_url": "https://www.reddit.com/r/ladybusiness/",
    "submission_url": "https://www.reddit.com/r/ladybusiness/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/microsaas",
    "slug": "reddit-microsaas",
    "source_url": "https://www.reddit.com/r/microsaas/",
    "submission_url": "https://www.reddit.com/r/microsaas/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/IndieBiz",
    "slug": "reddit-indiebiz",
    "source_url": "https://www.reddit.com/r/indiebiz/",
    "submission_url": "https://www.reddit.com/r/indiebiz/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/shamelessplug",
    "slug": "reddit-shamelessplug",
    "source_url": "https://www.reddit.com/r/shamelessplug/",
    "submission_url": "https://www.reddit.com/r/shamelessplug/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/AlphaandBetausers",
    "slug": "reddit-alphaandbetausers",
    "source_url": "https://www.reddit.com/r/alphaandbetausers/",
    "submission_url": "https://www.reddit.com/r/alphaandbetausers/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/indiehackers",
    "slug": "reddit-indiehackers",
    "source_url": "https://www.reddit.com/r/indiehackers/",
    "submission_url": "https://www.reddit.com/r/indiehackers/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/thesidehustle",
    "slug": "reddit-thesidehustle",
    "source_url": "https://www.reddit.com/r/thesidehustle/",
    "submission_url": "https://www.reddit.com/r/thesidehustle/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/plugyourproduct",
    "slug": "reddit-plugyourproduct",
    "source_url": "https://www.reddit.com/r/plugyourproduct/",
    "submission_url": "https://www.reddit.com/r/plugyourproduct/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "/r/SmallBusiness",
    "slug": "reddit-smallbusiness",
    "source_url": "https://www.reddit.com/r/smallbusiness/",
    "submission_url": "https://www.reddit.com/r/smallbusiness/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/RoastMyStartup",
    "slug": "reddit-roastmystartup",
    "source_url": "https://www.reddit.com/r/roastmystartup",
    "submission_url": "https://www.reddit.com/r/roastmystartup",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Alternative To",
    "slug": "alternative-to",
    "source_url": "https://alternativeto.net/",
    "submission_url": "https://alternativeto.net/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/IMadeThis",
    "slug": "reddit-imadethis",
    "source_url": "https://reddit.com/r/imadethis",
    "submission_url": "https://reddit.com/r/imadethis",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/Startups",
    "slug": "reddit-startups",
    "source_url": "https://reddit.com/r/startups",
    "submission_url": "https://reddit.com/r/startups",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/Entrepreneur",
    "slug": "reddit-entrepreneur",
    "source_url": "https://reddit.com/r/entrepreneur",
    "submission_url": "https://reddit.com/r/entrepreneur",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "All Top Startups",
    "slug": "all-top-startups",
    "source_url": "https://alltopstartups.com/submit-startup/",
    "submission_url": "https://alltopstartups.com/submit-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "AppsThunder",
    "slug": "appsthunder",
    "source_url": "https://appsthunder.com/submit-your-app/",
    "submission_url": "https://appsthunder.com/submit-your-app/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "AngelList",
    "slug": "angellist",
    "source_url": "https://angel.co/",
    "submission_url": "https://angel.co/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/SideProject",
    "slug": "reddit-sideproject",
    "source_url": "https://reddit.com/r/sideproject",
    "submission_url": "https://reddit.com/r/sideproject",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Capterra",
    "slug": "capterra",
    "source_url": "https://www.capterra.com/vendors/sign-up",
    "submission_url": "https://www.capterra.com/vendors/sign-up",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "BuiltInChicago",
    "slug": "builtinchicago",
    "source_url": "https://www.builtinchicago.org/send-us-tip",
    "submission_url": "https://www.builtinchicago.org/send-us-tip",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "All Startups",
    "slug": "all-startups",
    "source_url": "https://www.allstartups.info/Startups/Submit",
    "submission_url": "https://www.allstartups.info/Startups/Submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Arctic Startup",
    "slug": "arctic-startup",
    "source_url": "https://arcticstartup.com/",
    "submission_url": "https://arcticstartup.com/",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Crunch Base",
    "slug": "crunch-base",
    "source_url": "https://www.crunchbase.com/#/home/index",
    "submission_url": "https://www.crunchbase.com/#/home/index",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "10words",
    "slug": "10words",
    "source_url": "https://10words.io",
    "submission_url": "https://10words.io",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Apps Listo",
    "slug": "apps-listo",
    "source_url": "https://appslisto.com/submit-your-app/",
    "submission_url": "https://appslisto.com/submit-your-app/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Awesome Indie",
    "slug": "awesome-indie",
    "source_url": "https://awesomeindie.com",
    "submission_url": "https://awesomeindie.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "appPicker",
    "slug": "apppicker",
    "source_url": "https://www.apppicker.com/",
    "submission_url": "https://www.apppicker.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "F6S",
    "slug": "f6s",
    "source_url": "https://www.f6s.com/",
    "submission_url": "https://www.f6s.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Getworm",
    "slug": "getworm",
    "source_url": "https://getworm.com/submit-startup",
    "submission_url": "https://getworm.com/submit-startup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Collaborizm",
    "slug": "collaborizm",
    "source_url": "https://www.collaborizm.com",
    "submission_url": "https://www.collaborizm.com",
    "category": "community",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Appoid",
    "slug": "appoid",
    "source_url": "https://appiod.com/submit-app-for-review/",
    "submission_url": "https://appiod.com/submit-app-for-review/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Alternative.me",
    "slug": "alternative-me",
    "source_url": "https://alternative.me/",
    "submission_url": "https://alternative.me/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "eBool",
    "slug": "ebool",
    "source_url": "https://www.ebool.com/submit",
    "submission_url": "https://www.ebool.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Indie Hackers",
    "slug": "indie-hackers",
    "source_url": "https://www.indiehackers.com/",
    "submission_url": "https://www.indiehackers.com/",
    "category": "community",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Land-book",
    "slug": "land-book",
    "source_url": "https://land-book.com/guidelines",
    "submission_url": "https://land-book.com/guidelines",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Loop",
    "slug": "loop",
    "source_url": "https://app.loopinput.com/",
    "submission_url": "https://app.loopinput.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "Get App",
    "slug": "get-app",
    "source_url": "https://getapp.com/",
    "submission_url": "https://getapp.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "G2 Crowd",
    "slug": "g2-crowd",
    "source_url": "https://www.g2crowd.com/",
    "submission_url": "https://www.g2crowd.com/products/new",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "Product Hunt",
    "slug": "product-hunt",
    "source_url": "https://www.producthunt.com/",
    "submission_url": "https://www.producthunt.com/",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Netted",
    "slug": "netted",
    "source_url": "https://www.netted.net/contact-us/",
    "submission_url": "https://www.netted.net/contact-us/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Beta Testing",
    "slug": "beta-testing",
    "source_url": "https://betatesting.com/beta-testing",
    "submission_url": "https://betatesting.com/beta-testing",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Gust",
    "slug": "gust",
    "source_url": "https://www.gust.com",
    "submission_url": "https://www.gust.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Appvita",
    "slug": "appvita",
    "source_url": "https://www.appvita.com/",
    "submission_url": "https://www.appvita.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Launched",
    "slug": "launched",
    "source_url": "https://launched.deskio.org",
    "submission_url": "https://launched.io/SubmitStartup",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "pr"
    ]
  },
  {
    "name": "Inc 42",
    "slug": "inc-42",
    "source_url": "https://inc42.com/startup-submission/",
    "submission_url": "https://inc42.com/startup-submission/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Next Big What",
    "slug": "next-big-what",
    "source_url": "https://nextbigwhat.com/",
    "submission_url": "https://nextbigwhat.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "AI Collection",
    "slug": "ai-collection",
    "source_url": "https://www.thataicollection.com/",
    "submission_url": "https://www.thataicollection.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Discover Cloud",
    "slug": "discover-cloud",
    "source_url": "https://www.discovercloud.com/become-a-vendor",
    "submission_url": "https://www.discovercloud.com/become-a-vendor",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Geek Wire",
    "slug": "geek-wire",
    "source_url": "https://geekwire.com/startup-list/",
    "submission_url": "https://geekwire.com/startup-list/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Launching Next",
    "slug": "launching-next",
    "source_url": "https://www.launchingnext.com/submit/",
    "submission_url": "https://www.launchingnext.com/submit/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Show HN",
    "slug": "show-hn",
    "source_url": "https://news.ycombinator.com/showhn.html",
    "submission_url": "https://news.ycombinator.com/showhn.html",
    "category": "community",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Micro SaaS Examples",
    "slug": "micro-saas-examples",
    "source_url": "https://www.microsaasexamples.com/",
    "submission_url": "https://www.microsaasexamples.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "CrozDesk",
    "slug": "crozdesk",
    "source_url": "https://vendor.crozdesk.com/user/signup",
    "submission_url": "https://vendor.crozdesk.com/user/signup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Killer Startups",
    "slug": "killer-startups",
    "source_url": "https://killerstartups.com/submit-startup/",
    "submission_url": "https://killerstartups.com/submit-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "App Rater",
    "slug": "app-rater",
    "source_url": "https://apprater.net/add/",
    "submission_url": "https://apprater.net/add/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "LaunchIgniter",
    "slug": "launchigniter",
    "source_url": "https://launchigniter.com/submit",
    "submission_url": "https://launchigniter.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "All My Faves",
    "slug": "all-my-faves",
    "source_url": "https://www.allmyfaves.com/",
    "submission_url": "https://www.allmyfaves.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Postmake",
    "slug": "postmake",
    "source_url": "https://postmake.io/submit",
    "submission_url": "https://postmake.io/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "SaaSHub",
    "slug": "saashub",
    "source_url": "https://www.saashub.com/",
    "submission_url": "https://www.saashub.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Stack Share",
    "slug": "stack-share",
    "source_url": "https://stackshare.io/",
    "submission_url": "https://stackshare.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 429,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Side Projectors",
    "slug": "side-projectors",
    "source_url": "https://www.sideprojectors.com",
    "submission_url": "https://www.sideprojectors.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Saijo's Tools List",
    "slug": "saijo-s-tools-list",
    "source_url": "https://saijogeorge.com/best-marketing-tools/",
    "submission_url": "https://saijogeorge.com/best-marketing-tools/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup Stash",
    "slug": "startup-stash",
    "source_url": "https://startupstash.com/",
    "submission_url": "https://startupstash.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Beta Bound",
    "slug": "beta-bound",
    "source_url": "https://www.betabound.com/announce/",
    "submission_url": "https://www.betabound.com/announce/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Slant",
    "slug": "slant",
    "source_url": "https://www.slant.co/",
    "submission_url": "https://www.slant.co/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startups Gallery",
    "slug": "startups-gallery",
    "source_url": "https://startups.gallery/",
    "submission_url": "https://startups.gallery/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup Buffer",
    "slug": "startup-buffer",
    "source_url": "https://startupbuffer.com",
    "submission_url": "https://startupbuffer.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup Beat",
    "slug": "startup-beat",
    "source_url": "https://startupbeat.com/startup-beat-featured-startup-pitch-guidelines/",
    "submission_url": "https://startupbeat.com/startup-beat-featured-startup-pitch-guidelines/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup Tabs",
    "slug": "startup-tabs",
    "source_url": "https://startuptabs.com/",
    "submission_url": "https://startuptabs.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup Ranking",
    "slug": "startup-ranking",
    "source_url": "https://www.startupranking.com/",
    "submission_url": "https://www.startupranking.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "StartupBlink",
    "slug": "startupblink",
    "source_url": "https://www.startupblink.com/",
    "submission_url": "https://www.startupblink.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup Tracker",
    "slug": "startup-tracker",
    "source_url": "https://startuptracker.io/",
    "submission_url": "https://startuptracker.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "SimilarSiteSearch",
    "slug": "similarsitesearch",
    "source_url": "https://www.similarsitesearch.com/tips.html",
    "submission_url": "https://www.similarsitesearch.com/tips.html",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "SnapMunk",
    "slug": "snapmunk",
    "source_url": "https://www.snapmunk.com/submit-your-startup/",
    "submission_url": "https://www.snapmunk.com/submit-your-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Apps Mamma",
    "slug": "apps-mamma",
    "source_url": "https://appsmamma.com/submit-your-app/",
    "submission_url": "https://appsmamma.com/submit-your-app/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Starter Story",
    "slug": "starter-story",
    "source_url": "https://starterstory.com/",
    "submission_url": "https://starterstory.com/",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "PreApps",
    "slug": "preapps",
    "source_url": "https://www.preapps.com/",
    "submission_url": "https://www.preapps.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Startup 88",
    "slug": "startup-88",
    "source_url": "https://startup88.com/",
    "submission_url": "https://startup88.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Tabscape",
    "slug": "tabscape",
    "source_url": "https://www.tapscape.com/",
    "submission_url": "https://www.tapscape.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "PitchWall",
    "slug": "pitchwall",
    "source_url": "https://pitchwall.co/",
    "submission_url": "https://pitchwall.co/product/submit",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "Boing Boing",
    "slug": "boing-boing",
    "source_url": "https://boingboing.net/contact",
    "submission_url": "https://boingboing.net/contact",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "pr",
      "history"
    ]
  },
  {
    "name": "Website Hunt",
    "slug": "website-hunt",
    "source_url": "https://www.websitehunt.co",
    "submission_url": "https://www.websitehunt.co",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "The Changelog",
    "slug": "the-changelog",
    "source_url": "https://github.com/thechangelog/ping",
    "submission_url": "https://changelog.com/news/submit",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "pr"
    ]
  },
  {
    "name": "Web App Rater",
    "slug": "web-app-rater",
    "source_url": "http://www.webapprater.com/webapprater-free-app-review",
    "submission_url": "https://webapprater.com/submit-your-web-application-for-review-html",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "Startup Inspire",
    "slug": "startup-inspire",
    "source_url": "https://www.startupinspire.com/submit",
    "submission_url": "https://www.startupinspire.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "/r/InternetIsBeautiful",
    "slug": "reddit-internetisbeautiful",
    "source_url": "https://www.reddit.com/r/InternetIsBeautiful/",
    "submission_url": "https://www.reddit.com/r/InternetIsBeautiful/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "/r/ProductHunters",
    "slug": "reddit-producthunters",
    "source_url": "https://www.reddit.com/r/ProductHunters/",
    "submission_url": "https://www.reddit.com/r/ProductHunters/",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "SaasRow",
    "slug": "saasrow",
    "source_url": "https://saasrow.com/",
    "submission_url": "https://saasrow.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Tech Map",
    "slug": "tech-map",
    "source_url": "https://thetechmap.com/",
    "submission_url": "https://thetechmap.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "pr"
    ]
  },
  {
    "name": "MakeUseOf",
    "slug": "makeuseof",
    "source_url": "https://www.makeuseof.com/about/",
    "submission_url": "https://www.makeuseof.com/about/",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "App Advice",
    "slug": "app-advice",
    "source_url": "https://appadvice.com/page/about-us",
    "submission_url": "https://appadvice.com/page/about-us",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Ycombinator",
    "slug": "ycombinator",
    "source_url": "https://news.ycombinator.com/",
    "submission_url": "https://news.ycombinator.com/",
    "category": "community",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "BuiltIn",
    "slug": "builtin",
    "source_url": "https://builtin.com/send-us-tip",
    "submission_url": "https://builtin.com/send-us-tip",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Tiny Launch",
    "slug": "tiny-launch",
    "source_url": "https://www.tinylaunch.com",
    "submission_url": "https://www.tinylaunch.com",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "Tech Pluto",
    "slug": "tech-pluto",
    "source_url": "http://www.techpluto.com",
    "submission_url": "https://www.techpluto.com/submit-a-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master",
      "history"
    ]
  },
  {
    "name": "Startup Benchmarks",
    "slug": "startup-benchmarks",
    "source_url": "https://www.startupbenchmarks.com/",
    "submission_url": "https://www.startupbenchmarks.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Launching Today",
    "slug": "launching-today",
    "source_url": "https://www.launching.today/",
    "submission_url": "https://www.launching.today/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "StartItUp",
    "slug": "startitup",
    "source_url": "https://startitup.io/",
    "submission_url": "https://startitup.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Venture Beat",
    "slug": "venture-beat",
    "source_url": "https://venturebeat.com/contact-2",
    "submission_url": "https://venturebeat.com/news-tips/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 429,
    "sources": [
      "pr",
      "history"
    ]
  },
  {
    "name": "Startup Base",
    "slug": "startup-base",
    "source_url": "https://startupbase.io/submit",
    "submission_url": "https://startupbase.io/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Vator",
    "slug": "vator",
    "source_url": "https://www.vator.tv/",
    "submission_url": "https://www.vator.tv/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Awesome Money Platforms",
    "slug": "awesome-money-platforms",
    "source_url": "https://github.com/yourusername/awesome-money-platforms",
    "submission_url": "https://github.com/yourusername/awesome-money-platforms",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "RankInPublic",
    "slug": "rankinpublic",
    "source_url": "https://rankinpublic.xyz",
    "submission_url": "https://rankinpublic.xyz",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "DBX Studio",
    "slug": "dbx-studio",
    "source_url": "https://www.dbxstudio.com",
    "submission_url": "https://www.dbxstudio.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "daily.dev",
    "slug": "daily-dev",
    "source_url": "https://daily.dev/",
    "submission_url": "https://daily.dev/",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Apps 400",
    "slug": "apps-400",
    "source_url": "https://apps400.com/submit-your-application-for-review",
    "submission_url": "https://apps400.com/submit-your-application-for-review",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Vedika",
    "slug": "vedika",
    "source_url": "https://vedika.io/",
    "submission_url": "https://vedika.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "TinyLaunch",
    "slug": "tinylaunch",
    "source_url": "https://www.tinylaun.ch/",
    "submission_url": "https://www.tinylaun.ch/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "ZPlatform.ai",
    "slug": "zplatform-ai",
    "source_url": "https://zplatform.ai/",
    "submission_url": "https://zplatform.ai/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "JustLaunched",
    "slug": "justlaunched",
    "source_url": "https://justlaunched.fyi",
    "submission_url": "https://justlaunched.fyi",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "AiToolsObserver",
    "slug": "aitoolsobserver",
    "source_url": "https://aitoolsobserver.com/",
    "submission_url": "https://aitoolsobserver.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "State of Tech",
    "slug": "state-of-tech",
    "source_url": "https://stateoftech.net/advertise?submit-an-app-for-review",
    "submission_url": "https://stateoftech.net/advertise?submit-an-app-for-review",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Software Advice",
    "slug": "software-advice",
    "source_url": "https://softwareadvice-markets.questionpro.com/",
    "submission_url": "https://softwareadvice-markets.questionpro.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "master"
    ]
  },
  {
    "name": "Mydentify",
    "slug": "mydentify",
    "source_url": "https://mydentify.com/submit",
    "submission_url": "https://mydentify.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Simple Lister",
    "slug": "simple-lister",
    "source_url": "https://simplelister.com/",
    "submission_url": "https://simplelister.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "master"
    ]
  },
  {
    "name": "ProductWatch",
    "slug": "productwatch",
    "source_url": "https://productwatch.io/",
    "submission_url": "https://productwatch.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "/r/SeeknWander",
    "slug": "reddit-seeknwander",
    "source_url": "https://reddit.com/r/seeknwander",
    "submission_url": "https://reddit.com/r/seeknwander",
    "category": "reddit",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.95,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Toolfound",
    "slug": "toolfound",
    "source_url": "https://toolfound.com",
    "submission_url": "https://toolfound.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Phyco",
    "slug": "phyco",
    "source_url": "https://phyco.org/submit",
    "submission_url": "https://phyco.org/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "CazaProducto",
    "slug": "cazaproducto",
    "source_url": "https://cazaproducto.com",
    "submission_url": "https://cazaproducto.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "AIWget",
    "slug": "aiwget",
    "source_url": "https://aiwget.com/submit",
    "submission_url": "https://aiwget.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Launchory",
    "slug": "launchory",
    "source_url": "https://www.launchory.app",
    "submission_url": "https://www.launchory.app",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "AIMiracle MAG",
    "slug": "aimiracle-mag",
    "source_url": "https://aimiracle.ai",
    "submission_url": "https://aimiracle.ai",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Vantaige",
    "slug": "vantaige",
    "source_url": "https://vantaige.io/list-your-ai-tool",
    "submission_url": "https://vantaige.io/list-your-ai-tool",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "SaaSCity",
    "slug": "saascity",
    "source_url": "https://saascity.io",
    "submission_url": "https://saascity.io",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Nick Launches",
    "slug": "nick-launches",
    "source_url": "https://nicklaunches.com/",
    "submission_url": "https://nicklaunches.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "10015 Product Finder",
    "slug": "10015-product-finder",
    "source_url": "https://10015.io/product-finder",
    "submission_url": "https://10015.io/product-finder",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Cheapbastards",
    "slug": "cheapbastards",
    "source_url": "https://cheapbastards.xyz/",
    "submission_url": "https://cheapbastards.xyz/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "A1Lab",
    "slug": "a1lab",
    "source_url": "https://a1lab.tech",
    "submission_url": "https://a1lab.tech",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Instaking",
    "slug": "instaking",
    "source_url": "http://instaking.org/",
    "submission_url": "http://instaking.org/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "AQX Logistics (US Freight Forwarding & Cross-Border Logistics Engine)",
    "slug": "aqx-logistics-us-freight-forwarding-cross-border-logistics-engine",
    "source_url": "https://aqxlogistics.com",
    "submission_url": "https://aqxlogistics.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Crowdstax",
    "slug": "crowdstax",
    "source_url": "https://www.crowdstax.com",
    "submission_url": "https://www.crowdstax.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Lanci",
    "slug": "lanci",
    "source_url": "https://lanci.dev",
    "submission_url": "https://lanci.dev",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "AppLensy",
    "slug": "applensy",
    "source_url": "https://applensy.com/submit",
    "submission_url": "https://applensy.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Esdecode",
    "slug": "esdecode",
    "source_url": "https://esdecode.com/",
    "submission_url": "https://esdecode.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Be Positive Life Planner",
    "slug": "be-positive-life-planner",
    "source_url": "https://bepositive.cc/",
    "submission_url": "https://bepositive.cc/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Aura++",
    "slug": "aura",
    "source_url": "https://auraplusplus.com/",
    "submission_url": "https://auraplusplus.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "VestingGap",
    "slug": "vestinggap",
    "source_url": "https://www.vestinggap.com/",
    "submission_url": "https://www.vestinggap.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "FalcoScan",
    "slug": "falcoscan",
    "source_url": "https://falcoscan.com/submit",
    "submission_url": "https://falcoscan.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Newzino",
    "slug": "newzino",
    "source_url": "https://newzino.com/get-covered",
    "submission_url": "https://newzino.com/get-covered",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Discova",
    "slug": "discova",
    "source_url": "https://www.discova.co/",
    "submission_url": "https://www.discova.co/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "HUSEVN Media Downloader",
    "slug": "husevn-media-downloader",
    "source_url": "https://husevndl.top",
    "submission_url": "https://husevndl.top",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Altimateguide",
    "slug": "altimateguide",
    "source_url": "https://altimateguide.com/request-inclusion",
    "submission_url": "https://altimateguide.com/request-inclusion",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Wellfound (formerly AngelList)",
    "slug": "wellfound-formerly-angellist",
    "source_url": "https://wellfound.com/",
    "submission_url": "https://wellfound.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "deskkit Launches",
    "slug": "deskkit-launches",
    "source_url": "https://deskkit.app/launch",
    "submission_url": "https://deskkit.app/launch",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "BestAIApp",
    "slug": "bestaiapp",
    "source_url": "https://bestaiapp.co/featured",
    "submission_url": "https://bestaiapp.co/featured",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Estartapero",
    "slug": "estartapero",
    "source_url": "https://estartapero.io/submit",
    "submission_url": "https://estartapero.io/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "PainPoint Daily",
    "slug": "painpoint-daily",
    "source_url": "https://painpointdaily.com",
    "submission_url": "https://painpointdaily.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "RadarMakers",
    "slug": "radarmakers",
    "source_url": "https://radarmakers.com/submit",
    "submission_url": "https://radarmakers.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Revleads (formerly CrozDesk)",
    "slug": "revleads-formerly-crozdesk",
    "source_url": "https://vendor.revleads.com/user/signup",
    "submission_url": "https://vendor.revleads.com/user/signup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "PriceBoxi",
    "slug": "priceboxi",
    "source_url": "http://www.pricebox.io",
    "submission_url": "http://www.pricebox.io",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "SitePatent",
    "slug": "sitepatent",
    "source_url": "https://sitepatent.com/",
    "submission_url": "https://sitepatent.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "MEDIAPRONET",
    "slug": "mediapronet",
    "source_url": "https://mediapronet.com/submit",
    "submission_url": "https://mediapronet.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Appstash",
    "slug": "appstash",
    "source_url": "http://appstash.co/",
    "submission_url": "http://appstash.co/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Be Positive Advertising Agency",
    "slug": "be-positive-advertising-agency",
    "source_url": "https://bepositive.az",
    "submission_url": "https://bepositive.az",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Fastbmk",
    "slug": "fastbmk",
    "source_url": "http://fastbmk.com/",
    "submission_url": "http://fastbmk.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "MeetNewAI",
    "slug": "meetnewai",
    "source_url": "https://meetnewai.com/",
    "submission_url": "https://meetnewai.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Boilerplates Directory",
    "slug": "boilerplates-directory",
    "source_url": "https://boilerplates.directory/submit",
    "submission_url": "https://boilerplates.directory/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Siteefy",
    "slug": "siteefy",
    "source_url": "https://siteefy.com/submit-tool?utm_source=placestopost",
    "submission_url": "https://siteefy.com/submit-tool?utm_source=placestopost",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Agent Stack Directory",
    "slug": "agent-stack-directory",
    "source_url": "https://agentstackdirectory.com/submit/",
    "submission_url": "https://agentstackdirectory.com/submit/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "PWA Directory",
    "slug": "pwa-directory",
    "source_url": "https://pwa.directory/submit",
    "submission_url": "https://pwa.directory/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Awesome Tools",
    "slug": "awesome-tools",
    "source_url": "https://awesome.tools/submit",
    "submission_url": "https://awesome.tools/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "WebApps Directory",
    "slug": "webapps-directory",
    "source_url": "https://webapps.directory/submit",
    "submission_url": "https://webapps.directory/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "RoboDebut",
    "slug": "robodebut",
    "source_url": "https://robodebut.com/submit-with-a-coding-agent",
    "submission_url": "https://robodebut.com/submit-with-a-coding-agent",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Haro",
    "slug": "haro",
    "source_url": "https://www.helpareporter.com",
    "submission_url": "https://www.helpareporter.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "Launchef",
    "slug": "launchef",
    "source_url": "https://launchef.com",
    "submission_url": "https://launchef.com",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "CtrlAlt.cc",
    "slug": "ctrlalt-cc",
    "source_url": "https://ctrlalt.cc/",
    "submission_url": "https://ctrlalt.cc/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "ZeroRaised",
    "slug": "zeroraised",
    "source_url": "https://zeroraised.com",
    "submission_url": "https://zeroraised.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "BetaList",
    "slug": "betalist",
    "source_url": "https://betalist.com/",
    "submission_url": "https://betalist.com/submit",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "SideHunt",
    "slug": "sidehunt",
    "source_url": "https://sidehunt.io/",
    "submission_url": "https://sidehunt.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "GrowthBoosters",
    "slug": "growthboosters",
    "source_url": "https://www.growthboosters.com/product/add",
    "submission_url": "https://www.growthboosters.com/product/add",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Trustradius",
    "slug": "trustradius",
    "source_url": "https://www.trustradius.com/",
    "submission_url": "https://www.trustradius.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Leakly",
    "slug": "leakly",
    "source_url": "https://leakly.ai/",
    "submission_url": "https://leakly.ai/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "UserCV Blogging Community",
    "slug": "usercv-blogging-community",
    "source_url": "https://usercv.com/blogs",
    "submission_url": "https://usercv.com/blogs",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "KitDB",
    "slug": "kitdb",
    "source_url": "https://kitdb.app/",
    "submission_url": "https://kitdb.app/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Alternative To (Github repo)",
    "slug": "alternative-to-github-repo",
    "source_url": "https://github.com/brentadamson/alternativeto",
    "submission_url": "https://github.com/brentadamson/alternativeto",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Oye Startups",
    "slug": "oye-startups",
    "source_url": "https://oyestartups.com/contact",
    "submission_url": "https://oyestartups.com/contact",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "MakerHunt",
    "slug": "makerhunt",
    "source_url": "https://makerhunt.io",
    "submission_url": "https://makerhunt.io",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "EarlyHunt",
    "slug": "earlyhunt",
    "source_url": "https://earlyhunt.com/",
    "submission_url": "https://earlyhunt.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "IndieHunt",
    "slug": "indiehunt",
    "source_url": "https://indiehunt.io/",
    "submission_url": "https://indiehunt.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "Emoji Launch",
    "slug": "emoji-launch",
    "source_url": "https://emojilaunch.com/",
    "submission_url": "https://emojilaunch.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startup John",
    "slug": "startup-john",
    "source_url": "https://www.startupjohn.com/",
    "submission_url": "https://www.startupjohn.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 526,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Broadwise.org",
    "slug": "broadwise-org",
    "source_url": "https://broadwise.org/",
    "submission_url": "https://broadwise.org/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "CodeCanyons",
    "slug": "codecanyons",
    "source_url": "https://codecanyons.net",
    "submission_url": "https://codecanyons.net",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Webwide",
    "slug": "webwide",
    "source_url": "https://webwide.io/forums/project-showcase.15/",
    "submission_url": "https://webwide.io/forums/project-showcase.15/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Early-stage News",
    "slug": "early-stage-news",
    "source_url": "https://earlystagenews.com/",
    "submission_url": "https://earlystagenews.com/",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "SideProjects",
    "slug": "sideprojects",
    "source_url": "https://sideprojects.net",
    "submission_url": "https://sideprojects.net",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Projectium Network",
    "slug": "projectium-network",
    "source_url": "https://projectium.network",
    "submission_url": "https://projectium.network",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Fiddy",
    "slug": "fiddy",
    "source_url": "https://fiddy.co",
    "submission_url": "https://fiddy.co",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "AppStorm",
    "slug": "appstorm",
    "source_url": "http://appstorm.net/",
    "submission_url": "http://appstorm.net/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Cloud Surfing",
    "slug": "cloud-surfing",
    "source_url": "http://www.cloudsurfing.com/",
    "submission_url": "http://www.cloudsurfing.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "AppZapp",
    "slug": "appzapp",
    "source_url": "http://www.appzapp.net/en/app-review-request/",
    "submission_url": "http://www.appzapp.net/en/app-review-request/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Springwise",
    "slug": "springwise",
    "source_url": "https://www.springwise.com/spotted/",
    "submission_url": "http://springwise.com/tipus/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "Codedelay",
    "slug": "codedelay",
    "source_url": "https://codedelay.com",
    "submission_url": "https://codedelay.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "pr"
    ]
  },
  {
    "name": "CSS Mania",
    "slug": "css-mania",
    "source_url": "http://www.cssmania.com/submit/",
    "submission_url": "http://www.cssmania.com/submit/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Project Hatch",
    "slug": "project-hatch",
    "source_url": "https://www.projecthatch.co/your-story/",
    "submission_url": "https://www.projecthatch.co/your-story/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Hackerstreet",
    "slug": "hackerstreet",
    "source_url": "https://in.thehackerstreet.com/",
    "submission_url": "https://in.thehackerstreet.com/",
    "category": "community",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Larasites",
    "slug": "larasites",
    "source_url": "https://larasites.com/",
    "submission_url": "https://larasites.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Addictive Tips",
    "slug": "addictive-tips",
    "source_url": "http://www.addictivetips.com/",
    "submission_url": "http://www.addictivetips.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "yesRamen",
    "slug": "yesramen",
    "source_url": "https://yesramen.com/",
    "submission_url": "https://yesramen.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "GitHustle",
    "slug": "githustle",
    "source_url": "http://www.githustle.com",
    "submission_url": "http://www.githustle.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "RandomStartup",
    "slug": "randomstartup",
    "source_url": "https://www.randomstartup.org/#/submit",
    "submission_url": "https://www.randomstartup.org/#/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Programmable Web",
    "slug": "programmable-web",
    "source_url": "https://www.programmableweb.com/news/how-to-pitch-programmableweb-covering-your-news/2016/11/18",
    "submission_url": "https://www.programmableweb.com/news/how-to-pitch-programmableweb-covering-your-news/2016/11/18",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Hackerspad",
    "slug": "hackerspad",
    "source_url": "https://hackerspad.net/submit-software/",
    "submission_url": "https://hackerspad.net/submit-software/",
    "category": "community",
    "submission_method": "manual",
    "automation_policy": "requires_review",
    "adapter_key": "reddit-draft",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Reikut",
    "slug": "reikut",
    "source_url": "https://reikut.com/",
    "submission_url": "https://reikut.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Saasified",
    "slug": "saasified",
    "source_url": "https://saasified.co",
    "submission_url": "https://saasified.co",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startups List",
    "slug": "startups-list",
    "source_url": "https://www.startups-list.com/",
    "submission_url": "https://www.startups-list.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "PublicityX",
    "slug": "publicityx",
    "source_url": "https://www.publicityx.com/startups/new",
    "submission_url": "https://www.publicityx.com/startups/new",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 503,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Softpedia",
    "slug": "softpedia",
    "source_url": "http://www.softpedia.com/",
    "submission_url": "http://www.softpedia.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Maker Updates",
    "slug": "maker-updates",
    "source_url": "https://www.makerupdates.com/",
    "submission_url": "https://www.makerupdates.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Softlaunched",
    "slug": "softlaunched",
    "source_url": "https://www.softlaunched.com/",
    "submission_url": "https://www.softlaunched.com/",
    "category": "launch_platform",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "App 400",
    "slug": "app-400",
    "source_url": "http://apps400.com/",
    "submission_url": "http://apps400.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Tech Crunch",
    "slug": "tech-crunch",
    "source_url": "https://techcrunch.com/",
    "submission_url": "https://techcrunch.com/got-a-tip/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "Paggu",
    "slug": "paggu",
    "source_url": "http://www.paggu.com/",
    "submission_url": "http://www.paggu.com/submit-your-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "Appcrawlr",
    "slug": "appcrawlr",
    "source_url": "http://appcrawlr.com/",
    "submission_url": "http://appcrawlr.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Tech",
    "slug": "tech",
    "source_url": "http://www.techgreet.com/submit-your-tech-startup/",
    "submission_url": "http://www.techgreet.com/submit-your-tech-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Index.co",
    "slug": "index-co",
    "source_url": "https://index.co/startup",
    "submission_url": "https://index.co/startup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history"
    ]
  },
  {
    "name": "VB Profiles",
    "slug": "vb-profiles",
    "source_url": "http://vbprofiles.com/",
    "submission_url": "http://vbprofiles.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "StompStart",
    "slug": "stompstart",
    "source_url": "https://stompstart.com/",
    "submission_url": "https://stompstart.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Tech Tips",
    "slug": "tech-tips",
    "source_url": "http://techattitude.com/contact/",
    "submission_url": "http://techattitude.com/contact/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "YouNoodle",
    "slug": "younoodle",
    "source_url": "https://ww2.younoodle.com/startups/",
    "submission_url": "https://ww2.younoodle.com/startups/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "pFind",
    "slug": "pfind",
    "source_url": "http://www.pfind.com/submit",
    "submission_url": "http://www.pfind.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Top Alternatives",
    "slug": "top-alternatives",
    "source_url": "https://topalternatives.com/",
    "submission_url": "https://topalternatives.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "App Appeal",
    "slug": "app-appeal",
    "source_url": "http://www.appappeal.com/contact/suggest",
    "submission_url": "http://www.appappeal.com/contact/suggest",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "AppsNow",
    "slug": "appsnow",
    "source_url": "http://appsnow.us/submit-app-for-review/",
    "submission_url": "http://appsnow.us/submit-app-for-review/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Rev 2",
    "slug": "rev-2",
    "source_url": "http://www.rev2.org/",
    "submission_url": "http://www.rev2.org/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 403,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Erlibird",
    "slug": "erlibird",
    "source_url": "https://erlibird.com/beta-testing",
    "submission_url": "https://erlibird.com/beta-testing",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "SimilarSites",
    "slug": "similarsites",
    "source_url": "http://www.similarsites.com/",
    "submission_url": "http://www.similarsites.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Cnet",
    "slug": "cnet",
    "source_url": "https://upload.cnet.com/",
    "submission_url": "https://upload.cnet.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "The iPhone Mom",
    "slug": "the-iphone-mom",
    "source_url": "https://www.theiphonemom.com/",
    "submission_url": "https://www.theiphonemom.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Feedback Army",
    "slug": "feedback-army",
    "source_url": "http://feedbackarmy.com/feedback.slp",
    "submission_url": "http://feedbackarmy.com/feedback.slp",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Top Similar Sites",
    "slug": "top-similar-sites",
    "source_url": "http://www.topsimilarsites.com/add.aspx",
    "submission_url": "http://www.topsimilarsites.com/add.aspx",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Venture Bin",
    "slug": "venture-bin",
    "source_url": "http://www.venturebin.com/submit-venture/",
    "submission_url": "http://www.venturebin.com/submit-venture/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Webmenu",
    "slug": "webmenu",
    "source_url": "http://webmenu.org/",
    "submission_url": "http://webmenu.org/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startup Collections",
    "slug": "startup-collections",
    "source_url": "http://startupcollections.com/",
    "submission_url": "http://startupcollections.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Designer News",
    "slug": "designer-news",
    "source_url": "https://www.designernews.co/",
    "submission_url": "https://www.designernews.co/",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Beta Page",
    "slug": "beta-page",
    "source_url": "https://betapage.co/",
    "submission_url": "https://betapage.co/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "101 Best Websites",
    "slug": "101-best-websites",
    "source_url": "http://www.101bestwebsites.com/",
    "submission_url": "http://www.101bestwebsites.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Apps Mirror",
    "slug": "apps-mirror",
    "source_url": "http://www.appsmirror.com/submit-your-app-for-review",
    "submission_url": "http://www.appsmirror.com/submit-your-app-for-review",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "On the App",
    "slug": "on-the-app",
    "source_url": "http://ontheapp.com/about/",
    "submission_url": "http://ontheapp.com/about/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "MosaicHub",
    "slug": "mosaichub",
    "source_url": "http://www.mosaichub.com/",
    "submission_url": "http://www.mosaichub.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 503,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Operation 6 Fig",
    "slug": "operation-6-fig",
    "source_url": "http://www.operation6fig.com/submit-a-start-up",
    "submission_url": "http://www.operation6fig.com/submit-a-start-up",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Postscapes",
    "slug": "postscapes",
    "source_url": "http://about.postscapes.com/tools",
    "submission_url": "http://about.postscapes.com/tools",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "BizTechXperts",
    "slug": "biztechxperts",
    "source_url": "http://biztechxperts.com/?cb3",
    "submission_url": "http://biztechxperts.com/?cb3",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "BreakPoint",
    "slug": "breakpoint",
    "source_url": "https://breakpoint.io/new/",
    "submission_url": "https://breakpoint.io/new/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Side Projects",
    "slug": "side-projects",
    "source_url": "http://sideprojects.web3canvas.com",
    "submission_url": "http://sideprojects.web3canvas.com",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Rate My Startup",
    "slug": "rate-my-startup",
    "source_url": "http://ratemystartup.com/submit-your-startup/",
    "submission_url": "http://ratemystartup.com/submit-your-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Geekopedia",
    "slug": "geekopedia",
    "source_url": "http://geekopedia.me/startupsubmit",
    "submission_url": "http://geekopedia.me/startupsubmit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 526,
    "sources": [
      "history"
    ]
  },
  {
    "name": "CloudShowPlace",
    "slug": "cloudshowplace",
    "source_url": "http://www.cloudshowplace.com/add-your-company/",
    "submission_url": "http://www.cloudshowplace.com/add-your-company/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Cloudli.st",
    "slug": "cloudli-st",
    "source_url": "http://www.cloudli.st/apps/new",
    "submission_url": "http://www.cloudli.st/apps/new",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Cool Startup Bro",
    "slug": "cool-startup-bro",
    "source_url": "http://www.coolstartupbro.com/",
    "submission_url": "http://www.coolstartupbro.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Feed My App",
    "slug": "feed-my-app",
    "source_url": "https://feedmyapp.com/submit/",
    "submission_url": "https://feedmyapp.com/submit/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Start-ups",
    "slug": "start-ups",
    "source_url": "http://www.start-ups.co/startup-interview-questionnaire/",
    "submission_url": "http://www.start-ups.co/startup-interview-questionnaire/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Launch List",
    "slug": "launch-list",
    "source_url": "http://launchlist.co/submit-a-startup",
    "submission_url": "http://launchlist.co/submit-a-startup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history",
      "history"
    ]
  },
  {
    "name": "Museum of Modern Beta",
    "slug": "museum-of-modern-beta",
    "source_url": "http://momb.socio-kybernetics.net/about",
    "submission_url": "http://momb.socio-kybernetics.net/about",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startup Lift",
    "slug": "startup-lift",
    "source_url": "http://www.startuplift.com/",
    "submission_url": "http://www.startuplift.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.9,
    "status": "verified",
    "http_status": 200,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Mevvy",
    "slug": "mevvy",
    "source_url": "https://mevvy.com/submit-app/",
    "submission_url": "https://mevvy.com/submit-app/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "The Startup Pitch",
    "slug": "the-startup-pitch",
    "source_url": "http://thestartuppitch.com/post-a-pitch/",
    "submission_url": "http://thestartuppitch.com/post-a-pitch/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startup Resources",
    "slug": "startup-resources",
    "source_url": "https://startupresources.io",
    "submission_url": "https://startupresources.io",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 520,
    "sources": [
      "history"
    ]
  },
  {
    "name": "New-Startups",
    "slug": "new-startups",
    "source_url": "http://www.new-startups.com/submit/",
    "submission_url": "http://www.new-startups.com/submit/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Your Story",
    "slug": "your-story",
    "source_url": "https://profiles.yourstory.com/",
    "submission_url": "https://profiles.yourstory.com/",
    "category": "editorial",
    "submission_method": "email",
    "automation_policy": "requires_review",
    "adapter_key": "email-pitch",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startups",
    "slug": "startups",
    "source_url": "http://startups.fm/contact-us",
    "submission_url": "http://startups.fm/contact-us",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 404,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Start HQ",
    "slug": "start-hq",
    "source_url": "https://starthq.com/apps/submit",
    "submission_url": "https://starthq.com/apps/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Beterest",
    "slug": "beterest",
    "source_url": "https://beterest.com/submit-startup/",
    "submission_url": "https://beterest.com/submit-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Venture Break",
    "slug": "venture-break",
    "source_url": "http://venturebreak.com/questions/",
    "submission_url": "http://venturebreak.com/questions/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Betafy",
    "slug": "betafy",
    "source_url": "https://www.betafy.co/easysignup/startup",
    "submission_url": "https://www.betafy.co/easysignup/startup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "this blog post",
    "slug": "this-blog-post",
    "source_url": "https://triphappy.com/blog/131-startup-directories-to-promote-your-startup/1",
    "submission_url": "https://triphappy.com/blog/131-startup-directories-to-promote-your-startup/1",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "AdHipster",
    "slug": "adhipster",
    "source_url": "https://adhipster.com/",
    "submission_url": "https://adhipster.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Angel List",
    "slug": "angel-list",
    "source_url": "https://angel.co/join",
    "submission_url": "https://angel.co/join",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "App Storm",
    "slug": "app-storm",
    "source_url": "http://formstack.com/forms/envato-appstorm_review",
    "submission_url": "http://formstack.com/forms/envato-appstorm_review",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "CloudBook",
    "slug": "cloudbook",
    "source_url": "http://www.cloudbook.net/directories/product-services/product-company-search.php",
    "submission_url": "http://www.cloudbook.net/directories/product-services/product-company-search.php",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Crazy About Startups",
    "slug": "crazy-about-startups",
    "source_url": "http://www.crazyaboutstartups.com/index.php/share-your-startup-form",
    "submission_url": "http://www.crazyaboutstartups.com/index.php/share-your-startup-form",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Digg",
    "slug": "digg",
    "source_url": "http://digg.com/submit",
    "submission_url": "http://digg.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "FireSpotting",
    "slug": "firespotting",
    "source_url": "http://firespotting.com/submit",
    "submission_url": "http://firespotting.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "I Am Wire",
    "slug": "i-am-wire",
    "source_url": "http://www.iamwire.com/startups/user/register?uType=Entrepreneur",
    "submission_url": "http://www.iamwire.com/startups/user/register?uType=Entrepreneur",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Idea Hunt",
    "slug": "idea-hunt",
    "source_url": "http://ideahunt.io/",
    "submission_url": "http://ideahunt.io/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Inspired Beta",
    "slug": "inspired-beta",
    "source_url": "https://inspiredbeta.com/submit-a-startup/",
    "submission_url": "https://inspiredbeta.com/submit-a-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Just Gone Live",
    "slug": "just-gone-live",
    "source_url": "http://www.justgonelive.com/add-listing",
    "submission_url": "http://www.justgonelive.com/add-listing",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Launch Sky",
    "slug": "launch-sky",
    "source_url": "http://launchsky.com/pitch/compose",
    "submission_url": "http://launchsky.com/pitch/compose",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Makerbase",
    "slug": "makerbase",
    "source_url": "https://makerbase.co/",
    "submission_url": "https://makerbase.co/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Maqtoob",
    "slug": "maqtoob",
    "source_url": "https://maqtoob.com/submit-a-tool",
    "submission_url": "https://maqtoob.com/submit-a-tool",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Mobilzed",
    "slug": "mobilzed",
    "source_url": "https://www.moblized.com/vendors/register",
    "submission_url": "https://www.moblized.com/vendors/register",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Next Big Product",
    "slug": "next-big-product",
    "source_url": "http://nextbigproduct.net/product-submission/",
    "submission_url": "http://nextbigproduct.net/product-submission/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Nibletz",
    "slug": "nibletz",
    "source_url": "http://www.nibletz.com/submit-startup",
    "submission_url": "http://www.nibletz.com/submit-startup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Pineapple",
    "slug": "pineapple",
    "source_url": "http://pineapple.io/resources/new",
    "submission_url": "http://pineapple.io/resources/new",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Really-aweso.me",
    "slug": "really-aweso-me",
    "source_url": "http://www.really-aweso.me/submit-your-startup/",
    "submission_url": "http://www.really-aweso.me/submit-your-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Robingood",
    "slug": "robingood",
    "source_url": "http://tools.robingood.com/",
    "submission_url": "http://tools.robingood.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Signup First",
    "slug": "signup-first",
    "source_url": "http://signupfirst.com/",
    "submission_url": "http://signupfirst.com/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startup Dope",
    "slug": "startup-dope",
    "source_url": "http://startupdope.com/submit-news/",
    "submission_url": "http://startupdope.com/submit-news/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Startup Register",
    "slug": "startup-register",
    "source_url": "http://startupregister.net/register-your-startup/",
    "submission_url": "http://startupregister.net/register-your-startup/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Stumbleupon",
    "slug": "stumbleupon",
    "source_url": "http://www.stumbleupon.com/submit",
    "submission_url": "http://www.stumbleupon.com/submit",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "Tech Faster",
    "slug": "tech-faster",
    "source_url": "http://techfaster.com/submit-your-company/",
    "submission_url": "http://techfaster.com/submit-your-company/",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  },
  {
    "name": "WibbleWaggle",
    "slug": "wibblewaggle",
    "source_url": "http://www.wibblewaggle.com/list-startup",
    "submission_url": "http://www.wibblewaggle.com/list-startup",
    "category": "startup_directory",
    "submission_method": "form",
    "automation_policy": "unknown",
    "adapter_key": "directory",
    "pricing_type": "unknown",
    "confidence": 0.3,
    "status": "inactive",
    "http_status": 0,
    "sources": [
      "history"
    ]
  }
];
