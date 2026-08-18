import React from 'react';
import { 
  TrendingUp, 
  Star, 
  Eye, 
  Users, 
  BarChart3, 
  Headphones, 
  Shield, 
  Zap 
} from 'lucide-react';
import Card from '../ui/Card';

const SubscriptionBenefits: React.FC = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increased Visibility',
      description: 'Get priority placement in search results and attract more potential clients.',
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      icon: Star,
      title: 'Premium Badge',
      description: 'Stand out with a premium vendor badge that builds trust and credibility.',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Eye,
      title: 'Homepage Featured',
      description: 'Get featured on the homepage where thousands of clients browse daily.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Users,
      title: 'More Inquiries',
      description: 'Premium vendors receive 3x more inquiries than free listings.',
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track your performance with detailed insights and booking analytics.',
      color: 'text-amber-600 bg-amber-100'
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: 'Get faster response times and dedicated customer support.',
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: Shield,
      title: 'Verified Status',
      description: 'Enhanced verification process that builds client confidence.',
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get real-time notifications for new inquiries and bookings.',
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Premium?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful vendors who have grown their business with our premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${benefit.color}`}>
                <benefit.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-gray-600">More Inquiries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">85%</div>
              <div className="text-gray-600">Higher Booking Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
              <div className="text-gray-600">Faster Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBenefits;