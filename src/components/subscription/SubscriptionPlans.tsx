import React from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { SubscriptionPlan } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  loading?: boolean;
  currency: 'USD' | 'NGN';
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  currentPlan,
  onSelectPlan,
  loading = false,
  currency
}) => {
  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'basic':
        return <Star className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      case 'enterprise':
        return <Zap className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'basic':
        return 'text-blue-600 bg-blue-100';
      case 'premium':
        return 'text-purple-600 bg-purple-100';
      case 'enterprise':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  // Convert prices to user's preferred currency
  const convertPrice = (price: number, planCurrency: string) => {
    if (currency === planCurrency) return price;
    
    // Simple conversion for demo - in production, use real exchange rates
    if (planCurrency === 'NGN' && currency === 'USD') {
      return Math.round(price / 1650); // Approximate conversion
    }
    if (planCurrency === 'USD' && currency === 'NGN') {
      return Math.round(price * 1650);
    }
    
    return price;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => {
        const isCurrentPlan = currentPlan === plan.type;
        const convertedPrice = convertPrice(plan.price, plan.currency);
        
        return (
          <Card
            key={plan.id}
            className={`
              relative overflow-hidden transition-all duration-300
              ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}
              ${isCurrentPlan ? 'ring-2 ring-emerald-500' : ''}
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${getPlanColor(plan.type)}`}>
                  {getPlanIcon(plan.type)}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(convertedPrice, currency)}
                </div>
                
                <p className="text-gray-600 text-sm">
                  per {plan.duration} month{plan.duration > 1 ? 's' : ''}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="text-center">
                {isCurrentPlan ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSelectPlan(plan.id)}
                    loading={loading}
                    className={`
                      w-full
                      ${plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : ''
                      }
                    `}
                    variant={plan.popular ? 'primary' : 'outline'}
                  >
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;