// Product work showcased on /projects. Edit freely; `featured` items appear on the home page.
export interface Project {
  title: string;
  org?: string;
  period?: string;
  description: string;
  points?: string[];
  tags?: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: 'Pro Xtra Loyalty Program',
    org: 'The Home Depot',
    period: '2022–Present',
    description: 'Loyalty rewards powered by foundational accrual logic and customer-management capabilities.',
    points: [
      'Redesigned Purchase History, eliminating 18M annual API calls',
      'Led engineering teams of 4–8 and UX teams of 2–3',
    ],
    tags: ['Loyalty', 'Product Management', 'UX'],
    featured: true,
  },
  {
    title: 'Military Appreciation Program',
    org: 'The Home Depot',
    period: '2023',
    description: 'A discount program with a spend cap and military authentication where no prior controls existed.',
    points: ['Mitigated up to $100M in potential profit loss', 'Confluence documentation with 200+ views'],
    tags: ['E-commerce', 'Risk', 'Product Management'],
    featured: true,
  },
  {
    title: 'Marketing Preference Center',
    org: 'The Home Depot',
    period: '2020–2022',
    description: 'Brought customer marketing-preference management in-house — a $1.2M initiative.',
    points: [
      'Migrated 550M+ records across 11 teams, 8 vendors, and 20 data sources',
      'CCPA/TCPA/CAN-SPAM compliant; redesigned the preference UI for desktop + mobile',
    ],
    tags: ['Customer Data', 'Privacy', 'Migration'],
    featured: true,
  },
  {
    title: 'Equifax Data Breach Settlement API',
    org: 'Equifax',
    period: '2019',
    description: 'A consumer eligibility API for the Equifax Data Breach Settlement.',
    points: ['Handled 37M+ eligibility checks'],
    tags: ['API', 'Consumer'],
  },
  {
    title: 'Lock & Alert',
    org: 'Equifax',
    period: '2018',
    description: 'A real-time, free credit lock/unlock service launched for millions of U.S. consumers.',
    tags: ['Consumer', 'Security'],
  },
  {
    title: 'Belize Study Abroad — Women’s Education',
    org: 'Community project',
    period: '2014',
    description: 'Co-founded a program teaching women practical skills, later adapted for local schools.',
    points: ['Featured on Good Morning San Pedro, The San Pedro Times, and Ambergris Today'],
    tags: ['Social Impact', 'Education'],
  },
];
