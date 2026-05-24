import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

const baseTranscriber = {
  provider: "deepgram" as const,
  model: "nova-2" as const,
  language: "en" as const,
};

const baseModel = (systemContent: string) => ({
  provider: "openai" as const,
  model: "gpt-4" as const,
  messages: [{ role: "system" as const, content: systemContent }],
});

const QUESTIONS_TEMPLATE = `Follow the structured question flow:
{{questions}}

This is a voice conversation — keep responses short, natural, and conversational.
Listen actively and ask brief follow-up questions when needed.
Conclude by thanking the candidate and letting them know they will hear back soon.`;

export const coaches: Record<string, CreateAssistantDTO> = {
  sarah: {
    name: "Sarah",
    firstMessage:
      "Hi there! I’m Sarah, and I’m really looking forward to our conversation today. Take a breath — this is a safe space to practice. Let’s get started!",
    transcriber: baseTranscriber,
    voice: {
      provider: "openai",
      voiceId: "nova",
    },
    model: baseModel(`You are Sarah, an encouraging and supportive interview coach.
Your style is warm, patient, and constructive. You celebrate effort and guide candidates gently.
When a candidate struggles, offer a brief hint or reassurance before moving on.
${QUESTIONS_TEMPLATE}`),
  },

  david: {
    name: "David",
    firstMessage:
      "Let’s get straight to it. I’m David. We have limited time and high standards — I expect precise, structured answers. Ready?",
    transcriber: baseTranscriber,
    voice: {
      provider: "openai",
      voiceId: "onyx",
    },
    model: baseModel(`You are David, a challenging and rigorous interviewer from a top-tier firm.
Your style is direct, fast-paced, and demanding. You ask sharp follow-up questions and do not accept vague answers.
Push the candidate to be specific. Keep a professional but intense tone throughout.
${QUESTIONS_TEMPLATE}`),
  },

  maya: {
    name: "Maya",
    firstMessage:
      "Good day. I’m Maya. I’ll be conducting your interview today in a standard professional format. Please answer clearly and concisely.",
    transcriber: baseTranscriber,
    voice: {
      provider: "openai",
      voiceId: "shimmer",
    },
    model: baseModel(`You are Maya, a formal and objective professional interviewer.
Your style is calm, balanced, and thorough. You follow the question flow precisely and maintain a corporate tone.
Acknowledge answers briefly before moving to the next question.
${QUESTIONS_TEMPLATE}`),
  },
};

// Backward-compatible default
export const interviewer: CreateAssistantDTO = coaches.maya;

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
