import { UserProfile } from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-founder',
    name: 'Aaditya Sharma',
    email: 'founder@onegov.gov.in',
    role: 'founder',
    designation: 'Managing Director & Co-Founder',
  },
  {
    id: 'user-officer-mpcb',
    name: 'Dr. V. B. Shinde',
    email: 'officer@mpcb.gov.in',
    role: 'officer',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    designation: 'Sub-Regional Officer & Environmental Scrutiny Lead',
  },
  {
    id: 'user-inspector',
    name: 'Er. Rajesh Kadam',
    email: 'inspector@dish.gov.in',
    role: 'inspector',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    designation: 'Joint Director of Factories & Lead Field Inspector',
  },
  {
    id: 'user-admin',
    name: 'Pooja Narang',
    email: 'admin@onegov.gov.in',
    role: 'admin',
    department: 'National Informatics Centre / Single Window Operations',
    designation: 'Chief Systems Reliability & Diagnostic Engineer',
  },
];
