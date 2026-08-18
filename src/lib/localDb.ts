// Local, browser-only "database" that mirrors the previous Supabase schema.
// Swap the LocalTable calls below for real API calls once a backend exists.

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'vendor';
  profile_image?: string;
  currency: 'USD' | 'NGN';
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  description: string;
  services: string[];
  location: {
    city: string;
    state: string;
    address?: string;
  };
  pricing: {
    min: number;
    max: number;
    unit: string;
  };
  images: string[];
  profile_image?: string;
  verified: boolean;
  availability: boolean;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface VendorStats {
  id: string;
  vendor_id: string;
  profile_views: number;
  inquiries: number;
  bookings: number;
  revenue: number;
  month_year: string;
  created_at: string;
  updated_at: string;
}

export interface VendorInquiry {
  id: string;
  vendor_id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  event_type: string;
  event_date: string;
  message: string;
  status: 'New' | 'Responded' | 'Booked' | 'Declined';
  created_at: string;
}

export interface VendorBooking {
  id: string;
  vendor_id: string;
  client_id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface VendorSubscription {
  id: string;
  vendor_id: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

type WithId = { id: string };
type WithTimestamps = { created_at: string; updated_at?: string };

class LocalTable<T extends WithId> {
  constructor(private storageKey: string) {}

  private read(): T[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  private write(rows: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(rows));
  }

  getAll(): T[] {
    return this.read();
  }

  find(predicate: (row: T) => boolean): T[] {
    return this.read().filter(predicate);
  }

  findOne(predicate: (row: T) => boolean): T | undefined {
    return this.read().find(predicate);
  }

  insert(row: Omit<T, 'id' | 'created_at' | 'updated_at'> & Partial<WithTimestamps>): T {
    const now = new Date().toISOString();
    const newRow = {
      ...row,
      id: crypto.randomUUID(),
      created_at: row.created_at ?? now,
      updated_at: row.updated_at ?? now,
    } as unknown as T;

    const rows = this.read();
    rows.push(newRow);
    this.write(rows);
    return newRow;
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const rows = this.read();
    const index = rows.findIndex(row => row.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...rows[index],
      ...patch,
      updated_at: new Date().toISOString(),
    } as T;
    rows[index] = updated;
    this.write(rows);
    return updated;
  }

  remove(id: string): void {
    const rows = this.read().filter(row => row.id !== id);
    this.write(rows);
  }

  seedIfEmpty(rows: T[]): void {
    if (this.read().length === 0) {
      this.write(rows);
    }
  }
}

export const profilesTable = new LocalTable<Profile>('local_db_profiles');
export const vendorProfilesTable = new LocalTable<VendorProfile>('local_db_vendor_profiles');
export const vendorStatsTable = new LocalTable<VendorStats>('local_db_vendor_stats');
export const vendorInquiriesTable = new LocalTable<VendorInquiry>('local_db_vendor_inquiries');
export const vendorBookingsTable = new LocalTable<VendorBooking>('local_db_vendor_bookings');
export const vendorSubscriptionsTable = new LocalTable<VendorSubscription>('local_db_vendor_subscriptions');

interface SeedVendor {
  name: string;
  category: string;
  description: string;
  services: string[];
  city: string;
  state: string;
  address: string;
  email: string;
  phone: string;
  min: number;
  max: number;
  unit: string;
  image: string;
  subscription?: VendorSubscription['plan_type'];
}

const seedVendors: SeedVendor[] = [
  {
    name: 'Golden Gate Catering',
    category: 'catering',
    description: 'Premium catering services for corporate events, weddings, and special occasions. We specialize in farm-to-table cuisine with customizable menus.',
    services: ['Corporate Catering', 'Wedding Catering', 'Cocktail Reception', 'Buffet Service', 'Plated Dinners'],
    city: 'San Francisco',
    state: 'CA',
    address: '123 Mission St',
    email: 'info@goldengatecatering.com',
    phone: '(415) 555-0123',
    min: 50,
    max: 150,
    unit: 'per person',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
    subscription: 'enterprise',
  },
  {
    name: 'Luminous Photography',
    category: 'photography',
    description: 'Award-winning wedding and event photography capturing your most precious moments with artistic flair and professional expertise.',
    services: ['Wedding Photography', 'Event Photography', 'Portrait Sessions', 'Photo Editing', 'Digital Gallery'],
    city: 'Los Angeles',
    state: 'CA',
    address: '456 Sunset Blvd',
    email: 'hello@luminousphoto.com',
    phone: '(323) 555-0456',
    min: 1500,
    max: 5000,
    unit: 'per event',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    subscription: 'premium',
  },
  {
    name: 'The Grand Ballroom',
    category: 'venues',
    description: 'Elegant ballroom venue perfect for weddings, galas, and corporate events. Features crystal chandeliers and accommodates up to 300 guests.',
    services: ['Wedding Venue', 'Corporate Events', 'Gala Dinners', 'A/V Equipment', 'Event Coordination'],
    city: 'Chicago',
    state: 'IL',
    address: '789 Michigan Ave',
    email: 'events@grandballroom.com',
    phone: '(312) 555-0789',
    min: 3000,
    max: 8000,
    unit: 'per event',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Harmony Sound Productions',
    category: 'music',
    description: 'Professional DJ and live music services for all types of events. From intimate acoustic sets to high-energy dance parties.',
    services: ['DJ Services', 'Live Bands', 'Sound Equipment', 'Lighting', 'MC Services'],
    city: 'New York',
    state: 'NY',
    address: '321 Broadway',
    email: 'bookings@harmonysound.com',
    phone: '(212) 555-0321',
    min: 800,
    max: 2500,
    unit: 'per event',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    subscription: 'basic',
  },
  {
    name: 'Bloom & Blossom Florals',
    category: 'flowers',
    description: 'Exquisite floral arrangements and wedding bouquets using premium flowers. Custom designs tailored to your event theme and color palette.',
    services: ['Wedding Bouquets', 'Centerpieces', 'Ceremony Arches', 'Boutonnieres', 'Floral Installations'],
    city: 'Austin',
    state: 'TX',
    address: '654 South Lamar',
    email: 'orders@bloomandblossom.com',
    phone: '(512) 555-0654',
    min: 200,
    max: 1500,
    unit: 'per arrangement',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Elite Event Planning',
    category: 'planning',
    description: 'Full-service event planning company specializing in luxury weddings, corporate events, and social celebrations.',
    services: ['Full Event Planning', 'Day-of Coordination', 'Vendor Management', 'Timeline Creation', 'Budget Management'],
    city: 'Miami',
    state: 'FL',
    address: '987 Ocean Drive',
    email: 'info@eliteeventplanning.com',
    phone: '(305) 555-0987',
    min: 2000,
    max: 10000,
    unit: 'per event',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const ADMIN_SEED_ID = 'seed-admin';
export const DEMO_VENDOR_SEED_ID = 'seed-vendor-golden-gate';
export const DEMO_CLIENT_SEED_ID = 'seed-client-demo';

function seedDatabase(): void {
  if (profilesTable.getAll().length > 0) return;

  const now = new Date().toISOString();

  const profiles: Profile[] = [
    {
      id: ADMIN_SEED_ID,
      name: 'Platform Admin',
      email: 'admin@example.com',
      phone: '',
      role: 'client',
      currency: 'USD',
      is_admin: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: DEMO_CLIENT_SEED_ID,
      name: 'Demo Client',
      email: 'client@example.com',
      phone: '',
      role: 'client',
      currency: 'USD',
      is_admin: false,
      created_at: now,
      updated_at: now,
    },
  ];

  const vendorProfiles: VendorProfile[] = [];
  const subscriptions: VendorSubscription[] = [];

  seedVendors.forEach((vendor, index) => {
    const isDemoVendor = index === 0;
    const userId = isDemoVendor ? DEMO_VENDOR_SEED_ID : crypto.randomUUID();

    profiles.push({
      id: userId,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      role: 'vendor',
      currency: 'USD',
      is_admin: false,
      created_at: now,
      updated_at: now,
    });

    vendorProfiles.push({
      id: crypto.randomUUID(),
      user_id: userId,
      business_name: vendor.name,
      category: vendor.category,
      description: vendor.description,
      services: vendor.services,
      location: { city: vendor.city, state: vendor.state, address: vendor.address },
      pricing: { min: vendor.min, max: vendor.max, unit: vendor.unit },
      images: [vendor.image],
      profile_image: vendor.image,
      verified: true,
      availability: true,
      badges: [],
      created_at: now,
      updated_at: now,
    });

    if (vendor.subscription) {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 1);

      subscriptions.push({
        id: crypto.randomUUID(),
        vendor_id: userId,
        plan_type: vendor.subscription,
        status: 'active',
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        payment_reference: `seed_${userId}`,
        created_at: now,
        updated_at: now,
      });
    }
  });

  profilesTable.seedIfEmpty(profiles);
  vendorProfilesTable.seedIfEmpty(vendorProfiles);
  vendorSubscriptionsTable.seedIfEmpty(subscriptions);
}

seedDatabase();
