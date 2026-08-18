import React, { useState } from 'react';
import { X, MessageCircle, Phone, Mail, Search, ChevronDown, ChevronRight, HelpCircle, Book, Users, Settings } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'client' | 'vendor';
}

const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose, userRole = 'client' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      articles: [
        { title: 'How to create an account', content: 'Step-by-step guide to registration...' },
        { title: 'Setting up your profile', content: 'Complete your profile for better visibility...' },
        { title: 'Understanding the platform', content: 'Learn about key features and navigation...' },
      ]
    },
    {
      id: 'account-management',
      title: 'Account Management',
      icon: Settings,
      articles: [
        { title: 'Updating your profile information', content: 'How to edit your personal details...' },
        { title: 'Changing your password', content: 'Security best practices and password updates...' },
        { title: 'Managing notifications', content: 'Control what notifications you receive...' },
      ]
    },
    ...(userRole === 'vendor' ? [
      {
        id: 'vendor-specific',
        title: 'Vendor Features',
        icon: Users,
        articles: [
          { title: 'Managing your vendor profile', content: 'Optimize your business listing...' },
          { title: 'Subscription plans and benefits', content: 'Understanding premium features...' },
          { title: 'Handling client inquiries', content: 'Best practices for client communication...' },
          { title: 'Analytics and performance', content: 'Track your business metrics...' },
        ]
      }
    ] : [
      {
        id: 'client-specific',
        title: 'Client Features',
        icon: Users,
        articles: [
          { title: 'Finding the right vendors', content: 'Search and filter techniques...' },
          { title: 'Contacting vendors', content: 'How to reach out to service providers...' },
          { title: 'Saving and organizing vendors', content: 'Manage your favorite vendors...' },
          { title: 'Leaving reviews', content: 'Share your experience with others...' },
        ]
      }
    ])
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to your support system
    console.log('Support request submitted:', contactForm);
    alert('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ subject: '', message: '', priority: 'medium' });
    setShowContactForm(false);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0 || searchQuery === '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Help Center</h2>
              <p className="text-indigo-100">
                {userRole === 'vendor' ? 'Vendor Support & Resources' : 'Client Support & Resources'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            {/* Search */}
            <div className="mb-6">
              <Input
                icon={Search}
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowContactForm(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open('tel:+1-555-123-4567')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open('mailto:support@vendorhub.com')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <category.icon className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">{category.title}</span>
                    </div>
                    {selectedCategory === category.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {showContactForm ? (
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-600 hover:text-gray-800 mr-3"
                  >
                    ←
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900">Contact Support</h3>
                </div>

                <Card>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <Input
                      label="Subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please describe your issue in detail..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Send Message
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            ) : selectedCategory ? (
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-600 hover:text-gray-800 mr-3"
                  >
                    ←
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {categories
                    .find(c => c.id === selectedCategory)
                    ?.articles.map((article, index) => (
                      <Card key={index} hover>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {article.title}
                        </h4>
                        <p className="text-gray-600">
                          {article.content}
                        </p>
                      </Card>
                    ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can we help you?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select a category from the sidebar or search for specific topics.
                  </p>
                  <Button onClick={() => setShowContactForm(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>

                {/* Popular Articles */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card hover className="cursor-pointer" onClick={() => setSelectedCategory('getting-started')}>
                      <h5 className="font-medium text-gray-900 mb-2">Getting Started Guide</h5>
                      <p className="text-sm text-gray-600">Learn the basics of using VendorHub</p>
                    </Card>
                    <Card hover className="cursor-pointer" onClick={() => setSelectedCategory('account-management')}>
                      <h5 className="font-medium text-gray-900 mb-2">Account Management</h5>
                      <p className="text-sm text-gray-600">Manage your profile and settings</p>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span>Need immediate help? </span>
              <button
                onClick={() => window.open('tel:+1-555-123-4567')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Call us at (555) 123-4567
              </button>
            </div>
            <div>
              Response time: Usually within 24 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;