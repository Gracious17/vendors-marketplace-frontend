import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import SubscriptionPlans from '../components/subscription/SubscriptionPlans';
import SubscriptionBenefits from '../components/subscription/SubscriptionBenefits';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SubscriptionPage: React.FC = () => {
  const { user, profile } = useAuthStore();
  const { 
    subscription, 
    plans, 
    loading, 
    error, 
    paymentLoading,
    fetchSubscription, 
    fetchPlans, 
    initiatePayment,
    clearError 
  } = useSubscriptionStore();
  
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!user || profile?.role !== 'vendor') {
      navigate('/dashboard/client');
      return;
    }

    fetchPlans();
    if (user.id) {
      fetchSubscription(user.id);
    }
  }, [user, profile, fetchPlans, fetchSubscription, navigate]);

  const handleSelectPlan = async (planId: string) => {
    if (!user?.id) return;
    
    setSelectedPlan(planId);
    
    try {
      const currency = profile?.currency || 'NGN';
      const reference = await initiatePayment(planId, user.id, currency);
      
      // In a real implementation, user would be redirected to Paystack
      // For demo, show success message
      alert(`Payment would be initiated with reference: ${reference}\n\nIn production, user would be redirected to Paystack payment page.`);
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
    } finally {
      setSelectedPlan(null);
    }
  };

  if (loading && !plans.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading subscription plans..." />
      </div>
    );
  }

  const userCurrency = profile?.currency || 'NGN';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard/vendor"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Grow your vendor business with our premium features and reach more clients than ever before.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearError}>
              ×
            </Button>
          </div>
        )}

        {/* Current Subscription Status */}
        {subscription && (
          <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-emerald-50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">
                    Active Subscription
                  </h3>
                  <p className="text-emerald-700">
                    You're currently on the {subscription.plan_type} plan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-emerald-600">Expires on</div>
                <div className="font-semibold text-emerald-900">
                  {new Date(subscription.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Subscription Plans
            </h2>
            <p className="text-gray-600">
              Choose the plan that best fits your business needs
            </p>
          </div>

          <SubscriptionPlans
            plans={plans}
            currentPlan={subscription?.plan_type}
            onSelectPlan={handleSelectPlan}
            loading={paymentLoading && selectedPlan !== null}
            currency={userCurrency}
          />
        </div>

        {/* Benefits Section */}
        <SubscriptionBenefits />

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does billing work?
              </h3>
              <p className="text-gray-600">
                You'll be charged monthly for your selected plan. You can upgrade, downgrade, or cancel at any time.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and bank transfers through Paystack.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All new vendors get a 7-day free trial of our Premium plan to experience the benefits.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Grow Your Business?
              </h2>
              <p className="text-purple-100 mb-6">
                Join thousands of successful vendors who have transformed their business with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;