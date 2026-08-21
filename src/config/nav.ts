import { VERIFIED_GAMES } from './games';

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Download', href: '/download/' },
  {
    label: 'Games',
    href: '/games/',
    children: [
      { label: 'All Games', href: '/games/' },
      ...VERIFIED_GAMES.map((g) => ({ label: g.name, href: `/games/${g.slug}/` })),
    ],
  },
  { label: 'Bonuses', href: '/bonuses/' },
  {
    label: 'Guides',
    href: '/guides/',
    children: [
      { label: 'Install the App', href: '/install/' },
      { label: 'App Updates', href: '/updates/' },
      { label: 'Registration and Login', href: '/register-login/' },
      { label: 'Deposit Guide', href: '/deposit/' },
      { label: 'Withdrawal Guide', href: '/withdrawal/' },
      { label: 'Easypaisa and JazzCash', href: '/easypaisa-jazzcash/' },
      { label: 'Common App Errors', href: '/common-errors/' },
    ],
  },
  { label: 'Blog', href: '/blog/' },
  {
    label: 'Help',
    href: '/customer-service/',
    children: [
      { label: 'Customer Service', href: '/customer-service/' },
      { label: 'APK Safety', href: '/safety/' },
      { label: 'Official Domains', href: '/official-domains/' },
      { label: 'Account Verification', href: '/account-verification/' },
      { label: 'Account Deletion', href: '/account-deletion/' },
      { label: 'Complaints', href: '/complaints/' },
      { label: 'Responsible Gaming', href: '/responsible-gaming/' },
    ],
  },
];

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const FOOTER_NAV: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Download', href: '/download/' },
      { label: 'Install the App', href: '/install/' },
      { label: 'App Version', href: '/app-version/' },
      { label: 'Updates', href: '/updates/' },
      { label: 'Bonuses', href: '/bonuses/' },
      { label: 'Promo Code', href: '/promo-code/' },
    ],
  },
  {
    heading: 'Games',
    links: [
      { label: 'All Games', href: '/games/' },
      ...VERIFIED_GAMES.map((g) => ({ label: g.name, href: `/games/${g.slug}/` })),
    ],
  },
  {
    heading: 'Guides',
    links: [
      { label: 'Registration and Login', href: '/register-login/' },
      { label: 'Deposit Guide', href: '/deposit/' },
      { label: 'Withdrawal Guide', href: '/withdrawal/' },
      { label: 'Easypaisa and JazzCash', href: '/easypaisa-jazzcash/' },
      { label: 'Common App Errors', href: '/common-errors/' },
      { label: 'All Guides', href: '/guides/' },
      { label: 'Blog', href: '/blog/' },
    ],
  },
  {
    heading: 'Help and Safety',
    links: [
      { label: 'Customer Service', href: '/customer-service/' },
      { label: 'APK Safety', href: '/safety/' },
      { label: 'APK Permissions', href: '/apk-permissions/' },
      { label: 'Official Domains', href: '/official-domains/' },
      { label: 'Account Verification', href: '/account-verification/' },
      { label: 'Account Deletion', href: '/account-deletion/' },
      { label: 'Complaints', href: '/complaints/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Editorial Policy', href: '/editorial-policy/' },
      { label: 'Corrections Policy', href: '/corrections-policy/' },
      { label: 'Authors', href: '/authors/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Legal Status', href: '/legal-status/' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Use', href: '/terms/' },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Cookie Policy', href: '/cookie-policy/' },
      { label: 'Disclaimer', href: '/disclaimer/' },
      { label: 'DMCA', href: '/dmca/' },
      { label: 'Responsible Gaming', href: '/responsible-gaming/' },
      { label: 'Age Restrictions', href: '/age-restrictions/' },
    ],
  },
];
