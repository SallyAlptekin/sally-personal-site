// Résumé + about content for Sally's site. Edit here to update the site.

export const BIO = [
  "I'm a product manager focused on e-commerce strategy, online experience optimization, and customer data.",
  'At The Home Depot I help power loyalty and online experiences for a $25B+ e-commerce business; before that I led consumer products at Equifax. I love turning messy requirements into clear roadmaps and shipping things that make customers’ lives easier.',
  "I work across engineering, UX, design, legal, and business stakeholders — and I'm happiest when I'm learning something new.",
];

// Personal interests — edit freely (placeholders to start).
export const INTERESTS = [
  'Art & making things — see the Artwork page',
  'Mentoring and community programs',
  'Travel and trying new things',
  '(Add your own here — edit src/data/resume.ts)',
];

export interface ExperienceItem {
  role: string;
  org: string;
  dates: string;
  points: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Senior Online Experience Optimization & Strategy Analyst',
    org: 'The Home Depot',
    dates: 'Mar 2025 – Present',
    points: ['Supporting a $25B+ e-commerce business at HomeDepot.com, the #5 online retailer in the U.S.'],
  },
  {
    role: 'Product Manager — Loyalty Programs',
    org: 'The Home Depot',
    dates: 'Sep 2022 – Present',
    points: [
      'Powered the Pro Xtra rewards program with foundational accrual logic and customer-management capabilities, leading engineering teams of 4–8 and UX teams of 2–3.',
      'Redesigned the Purchase History feature, improving UX and eliminating 18M annual API calls.',
      'Shipped the Military Appreciation Program (discount cap + military authentication), mitigating up to $100M in potential profit loss.',
    ],
  },
  {
    role: 'Product Manager — Customer Data & Marketing Preferences',
    org: 'The Home Depot',
    dates: 'Jun 2020 – Aug 2022',
    points: [
      'Drove a $1.2M initiative to bring marketing-preference management in-house.',
      'Migrated 550M+ records across 11 teams, 8 vendors, and 20 data sources; retired vendor dependencies to cut annual spend.',
      'Redesigned the preference experience for desktop + mobile, compliant with CCPA, TCPA, and CAN-SPAM.',
    ],
  },
  {
    role: 'Product Owner — Global Consumer Solutions',
    org: 'Equifax',
    dates: 'Apr 2018 – May 2020',
    points: [
      'Delivered the Data Breach Settlement eligibility API (37M+ eligibility checks) and the Lock & Alert real-time credit lock for millions of consumers.',
      'Led UK repatriation and GDPR data-purge efforts with partners across the UK, Canada, India, and US. Recipient of the One Equifax Team Award.',
    ],
  },
  {
    role: 'Technical Business Analyst',
    org: 'Equifax',
    dates: 'Jan 2017 – Apr 2018',
    points: [
      'Drove high-visibility Equifax.com work: CFPB disclosure updates, a new dispute webpage, a Liferay DXP upgrade, and responsive redesigns — owning requirements, acceptance criteria, and QA.',
    ],
  },
  {
    role: 'Data Analyst & Assistant Student Manager',
    org: 'University of Georgia',
    dates: '2014 – 2016',
    points: [
      'Analyzed parking/transportation data and produced reports that improved operations; named a Top 100 Student Employee out of 5,000+.',
    ],
  },
];

export interface SkillGroup {
  group: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  { group: 'Product', items: ['Roadmapping', 'Feature prioritization', 'Backlog management', 'Discovery & requirements'] },
  { group: 'Process', items: ['Agile / Scrum', 'SAFe', 'Jira', 'Confluence', 'BPMN'] },
  { group: 'Domains', items: ['E-commerce', 'Loyalty', 'Customer data & privacy (CCPA/TCPA/GDPR)', 'Online experience optimization'] },
  { group: 'Collaboration', items: ['Cross-functional leadership', 'UX partnership', 'Stakeholder & vendor management'] },
];

export const EDUCATION = [
  { school: 'The University of Georgia', degree: 'B.S., Management Information Systems', dates: '' },
  { school: 'University of North Georgia', degree: 'Business Administration', dates: '' },
];

export const CERTS = [
  { name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: 'Issued May 2019' },
  { name: 'SAFe 4.0 Advanced Scrum Master', issuer: 'Scaled Agile', date: 'Issued Aug 2017' },
];

export const HONORS = [
  'One Equifax Team Award (2018)',
  'Top 100 Student Employee, University of Georgia (2016)',
];

export const VOLUNTEERING = [
  'VITA Volunteer Tax Preparer — IRS',
  'Enactus — Administrative Assistant',
  'Belize Study Abroad — co-founded a program teaching women practical skills',
];
