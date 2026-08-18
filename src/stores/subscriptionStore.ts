import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { VendorSubscription, SubscriptionPlan, PaystackPaymentData } from '../lib/types';

interface SubscriptionState {
  subscription: VendorSubscription | null;
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  paymentLoading: boolean;
}

interface SubscriptionActions {
  fetchSubscription: (vendorId: string) => Promise<void>;
  fetchPlans: () => Promise<void>;
  initiatePayment: (planId: string, vendorId: string, currency: 'USD' | 'NGN') => Promise<string>;
  verifyPayment: (reference: string) => Promise<boolean>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  clearError: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

// Mock subscription plans - in production, these would come from your backend
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    type: 'basic',
    price: 2000, // NGN
    currency: 'NGN',
    duration: 1,
    features: [
      'Priority listing in search results',
      'Basic analytics dashboard',
      'Email support',
      'Up to 10 portfolio images'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    type: 'premium',
    price: 5000, // NGN
    currency: 'NGN',
    duration: 1,
    features: [
      'Top vendor badge',
      'Featured on homepage',
      'Advanced analytics',
      'Priority customer support',
      'Unlimited portfolio images',
      'Custom business profile URL'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    type: 'enterprise',
    price: 10000, // NGN
    currency: 'NGN',
    duration: 1,
    features: [
      'All Premium features',
      'Dedicated account manager',
      'Custom branding options',
      'API access',
      'White-label solutions',
      'Priority placement in all searches'
    ]
  }
];

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      // State
      subscription: null,
      plans: mockPlans,
      loading: false,
      error: null,
      paymentLoading: false,

      // Actions
      fetchSubscription: async (vendorId: string) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('vendor_subscriptions')
            .select('*')
            .eq('vendor_id', vendorId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          set({ subscription: data });
        } catch (error) {
          console.error('Error fetching subscription:', error);
          set({ error: 'Failed to fetch subscription data' });
        } finally {
          set({ loading: false });
        }
      },

      fetchPlans: async () => {
        // In a real app, you'd fetch from your backend
        // For now, we're using the mock data
        set({ plans: mockPlans });
      },

      initiatePayment: async (planId: string, vendorId: string, currency: 'USD' | 'NGN') => {
        set({ paymentLoading: true, error: null });
        
        try {
          const plan = get().plans.find(p => p.id === planId);
          if (!plan) {
            throw new Error('Plan not found');
          }

          // Convert price to kobo (Paystack requires amount in kobo for NGN)
          const amount = currency === 'NGN' ? plan.price * 100 : plan.price;
          
          // Generate unique reference
          const reference = `sub_${vendorId}_${planId}_${Date.now()}`;

          // In a real implementation, you would:
          // 1. Create a payment record in your backend
          // 2. Get user email from your auth system
          // 3. Initialize Paystack payment
          
          /* 
          PAYSTACK INTEGRATION FLOW - COMMENT FOR LATER USE:
          
          1. Initialize Payment:
          const paystackData: PaystackPaymentData = {
            email: userEmail,
            amount: amount,
            currency: currency,
            reference: reference,
            callback_url: `${window.location.origin}/subscription/verify`,
            metadata: {
              vendor_id: vendorId,
              plan_type: plan.type,
              plan_duration: plan.duration
            }
          };

          const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(paystackData)
          });

          const result = await response.json();
          
          if (result.status) {
            // Redirect user to Paystack payment page
            window.location.href = result.data.authorization_url;
            return reference;
          } else {
            throw new Error(result.message);
          }

          2. Verify Payment (called after user completes payment):
          const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
              'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
          });

          const verifyResult = await verifyResponse.json();
          
          if (verifyResult.status && verifyResult.data.status === 'success') {
            // Payment successful, create subscription in database
            await createSubscription(vendorId, plan, reference);
            return true;
          }

          3. Webhook Handler (for backend):
          // Set up webhook endpoint to handle Paystack events
          // URL: https://yourdomain.com/api/paystack/webhook
          
          app.post('/api/paystack/webhook', (req, res) => {
            const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
              .update(JSON.stringify(req.body))
              .digest('hex');
              
            if (hash === req.headers['x-paystack-signature']) {
              const event = req.body;
              
              if (event.event === 'charge.success') {
                // Handle successful payment
                handleSuccessfulPayment(event.data);
              }
            }
            
            res.sendStatus(200);
          });
          */

          // For demo purposes, simulate payment initialization
          console.log('Payment would be initialized with Paystack:', {
            amount,
            currency,
            reference,
            plan: plan.name
          });

          // Return the reference for demo
          return reference;
          
        } catch (error) {
          console.error('Error initiating payment:', error);
          set({ error: 'Failed to initiate payment' });
          throw error;
        } finally {
          set({ paymentLoading: false });
        }
      },

      verifyPayment: async (reference: string) => {
        set({ loading: true, error: null });
        
        try {
          /* 
          PAYSTACK VERIFICATION - COMMENT FOR LATER USE:
          
          const response = await fetch(`/api/subscription/verify/${reference}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          });

          const result = await response.json();
          
          if (result.success) {
            // Refresh subscription data
            await get().fetchSubscription(result.vendorId);
            return true;
          }
          
          return false;
          */

          // For demo purposes, simulate successful verification
          console.log('Payment verification would be handled for reference:', reference);
          return true;
          
        } catch (error) {
          console.error('Error verifying payment:', error);
          set({ error: 'Failed to verify payment' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      cancelSubscription: async (subscriptionId: string) => {
        set({ loading: true, error: null });
        
        try {
          const { error } = await supabase
            .from('vendor_subscriptions')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscriptionId);

          if (error) throw error;

          set({ subscription: null });
        } catch (error) {
          console.error('Error cancelling subscription:', error);
          set({ error: 'Failed to cancel subscription' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        subscription: state.subscription,
        plans: state.plans
      })
    }
  )
);