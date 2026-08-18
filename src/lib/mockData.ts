import { Vendor, Review, User } from './types';

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Golden Gate Catering',
    category: 'catering',
    description: 'Premium catering services for corporate events, weddings, and special occasions. We specialize in farm-to-table cuisine with customizable menus.',
    services: ['Corporate Catering', 'Wedding Catering', 'Cocktail Reception', 'Buffet Service', 'Plated Dinners'],
    location: {
      city: 'San Francisco',
      state: 'CA',
      address: '123 Mission St'
    },
    contact: {
      email: 'info@goldengatecatering.com',
      phone: '(415) 555-0123',
      website: 'https://www.goldengatecatering.com'
    },
    pricing: {
      min: 50,
      max: 150,
      currency: 'USD',
      unit: 'per person'
    },
    rating: 4.8,
    reviewCount: 127,
    images: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: true,
    verified: true,
    availability: true,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Luminous Photography',
    category: 'photography',
    description: 'Award-winning wedding and event photography capturing your most precious moments with artistic flair and professional expertise.',
    services: ['Wedding Photography', 'Event Photography', 'Portrait Sessions', 'Photo Editing', 'Digital Gallery'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      address: '456 Sunset Blvd'
    },
    contact: {
      email: 'hello@luminousphoto.com',
      phone: '(323) 555-0456',
      website: 'https://www.luminousphoto.com'
    },
    pricing: {
      min: 1500,
      max: 5000,
      currency: 'USD',
      unit: 'per event'
    },
    rating: 4.9,
    reviewCount: 89,
    images: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: true,
    verified: true,
    availability: true,
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'The Grand Ballroom',
    category: 'venues',
    description: 'Elegant ballroom venue perfect for weddings, galas, and corporate events. Features crystal chandeliers and accommodates up to 300 guests.',
    services: ['Wedding Venue', 'Corporate Events', 'Gala Dinners', 'A/V Equipment', 'Event Coordination'],
    location: {
      city: 'Chicago',
      state: 'IL',
      address: '789 Michigan Ave'
    },
    contact: {
      email: 'events@grandballroom.com',
      phone: '(312) 555-0789',
      website: 'https://www.grandballroom.com'
    },
    pricing: {
      min: 3000,
      max: 8000,
      currency: 'USD',
      unit: 'per event'
    },
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: false,
    verified: true,
    availability: true,
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Harmony Sound Productions',
    category: 'music',
    description: 'Professional DJ and live music services for all types of events. From intimate acoustic sets to high-energy dance parties.',
    services: ['DJ Services', 'Live Bands', 'Sound Equipment', 'Lighting', 'MC Services'],
    location: {
      city: 'New York',
      state: 'NY',
      address: '321 Broadway'
    },
    contact: {
      email: 'bookings@harmonysound.com',
      phone: '(212) 555-0321',
      website: 'https://www.harmonysound.com'
    },
    pricing: {
      min: 800,
      max: 2500,
      currency: 'USD',
      unit: 'per event'
    },
    rating: 4.6,
    reviewCount: 203,
    images: [
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/154147/pexels-photo-154147.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: false,
    verified: true,
    availability: false,
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    name: 'Bloom & Blossom Florals',
    category: 'flowers',
    description: 'Exquisite floral arrangements and wedding bouquets using premium flowers. Custom designs tailored to your event theme and color palette.',
    services: ['Wedding Bouquets', 'Centerpieces', 'Ceremony Arches', 'Boutonnieres', 'Floral Installations'],
    location: {
      city: 'Austin',
      state: 'TX',
      address: '654 South Lamar'
    },
    contact: {
      email: 'orders@bloomandblossom.com',
      phone: '(512) 555-0654',
      website: 'https://www.bloomandblossom.com'
    },
    pricing: {
      min: 200,
      max: 1500,
      currency: 'USD',
      unit: 'per arrangement'
    },
    rating: 4.9,
    reviewCount: 78,
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: true,
    verified: true,
    availability: true,
    createdAt: new Date('2023-05-12')
  },
  {
    id: '6',
    name: 'Elite Event Planning',
    category: 'planning',
    description: 'Full-service event planning company specializing in luxury weddings, corporate events, and social celebrations.',
    services: ['Full Event Planning', 'Day-of Coordination', 'Vendor Management', 'Timeline Creation', 'Budget Management'],
    location: {
      city: 'Miami',
      state: 'FL',
      address: '987 Ocean Drive'
    },
    contact: {
      email: 'info@eliteeventplanning.com',
      phone: '(305) 555-0987',
      website: 'https://www.eliteeventplanning.com'
    },
    pricing: {
      min: 2000,
      max: 10000,
      currency: 'USD',
      unit: 'per event'
    },
    rating: 4.8,
    reviewCount: 94,
    images: [
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: false,
    verified: true,
    availability: true,
    createdAt: new Date('2023-06-18')
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    vendorId: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Golden Gate Catering exceeded our expectations! The food was absolutely delicious and the service was impeccable. Our wedding guests are still talking about the amazing meal.',
    eventType: 'Wedding',
    createdAt: new Date('2023-11-15')
  },
  {
    id: '2',
    vendorId: '2',
    userId: 'user2',
    userName: 'Michael Chen',
    rating: 5,
    comment: 'Luminous Photography captured our special day perfectly. The photos are stunning and truly tell the story of our wedding. Highly recommend!',
    eventType: 'Wedding',
    createdAt: new Date('2023-10-22')
  },
  {
    id: '3',
    vendorId: '3',
    userId: 'user3',
    userName: 'Emily Rodriguez',
    rating: 4,
    comment: 'Beautiful venue with excellent service. The ballroom was decorated perfectly and the staff was very professional throughout our corporate gala.',
    eventType: 'Corporate Event',
    createdAt: new Date('2023-09-08')
  }
];

export const mockUser: User = {
  id: 'user1',
  email: 'sarah.client@email.com',
  name: 'Sarah Johnson',
  role: 'client', // Fixed: changed from 'planner' to 'client'
  company: 'Dream Events Co.',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  createdAt: new Date('2023-01-01')
};