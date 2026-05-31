// Site-wide config + links. Edit these and they update everywhere.
export const SITE = {
  name: 'Sally Tang Alptekin',
  title: 'Sally Tang Alptekin — Product Manager',
  description:
    'Product manager focused on e-commerce strategy, online experience optimization, and customer data — with a creative side.',
  url: 'https://sallyalptekin.com',
  role: 'Product Manager',
  tagline: 'E-commerce Strategy · Online Experience Optimization · Product Management',
  location: 'Marietta, GA',
  // Email intentionally blank for now — the footer hides the Email link when empty.
  email: '',
  social: {
    linkedin: 'https://www.linkedin.com/in/tangsally/',
  },
};

// Top navigation. The site name in the header links Home, so Home is omitted here.
export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/artwork', label: 'Artwork' },
];
