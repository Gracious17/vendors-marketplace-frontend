import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Search, ChevronDown, ChevronRight, HelpCircle, Book, Users, Settings, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface Article {
  title: string;
  content: string;
}

interface Category {
  id: string;
  title: string;
  icon: typeof Book;
  articles: Article[];
}

const HelpCenter: React.FC = () => {
  const { profile } = useAuthStore();
  const userRole: 'client' | 'vendor' = profile?.role === 'vendor' ? 'vendor' : 'client';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const categories: Category[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      articles: [
        { title: 'How to create an account', content: 'Step-by-step guide to registration.' },
        { title: 'Setting up your profile', content: 'Complete your profile for better visibility.' },
        { title: 'Understanding the platform', content: 'Learn about key features and navigation.' },
      ]
    },
    {
      id: 'account-management',
      title: 'Account Management',
      icon: Settings,
      articles: [
        { title: 'Updating your profile information', content: 'How to edit your personal details.' },
        { title: 'Changing your password', content: 'Security best practices and password updates.' },
        { title: 'Managing notifications', content: 'Control what notifications you receive.' },
      ]
    },
    ...(userRole === 'vendor' ? [
      {
        id: 'vendor-specific',
        title: 'Vendor Features',
        icon: Users,
        articles: [
          { title: 'Managing your vendor profile', content: 'Optimize your business listing.' },
          { title: 'Subscription plans and benefits', content: 'Understanding premium features.' },
          { title: 'Handling client inquiries', content: 'Best practices for client communication.' },
          { title: 'Analytics and performance', content: 'Track your business metrics.' },
        ]
      }
    ] : [
      {
        id: 'client-specific',
        title: 'Client Features',
        icon: Users,
        articles: [
          { title: 'Finding the right vendors', content: 'Search and filter techniques.' },
          { title: 'Contacting vendors', content: 'How to reach out to service providers.' },
          { title: 'Saving and organizing vendors', content: 'Manage your favorite vendors.' },
          { title: 'Leaving reviews', content: 'Share your experience with others.' },
        ]
      }
    ])
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to your support system
    alert('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ subject: '', message: '', priority: 'medium' });
    setShowContactForm(false);
  };

  const matchesQuery = (article: Article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase());

  const filteredCategories = categories
    .map(category => ({
      ...category,
      articles: category.articles.filter(matchesQuery),
    }))
    .filter(category => category.articles.length > 0 || searchQuery.trim() === '');

  const isSearching = searchQuery.trim() !== '';
  const searchResults = isSearching
    ? categories.flatMap(category =>
        category.articles
          .filter(matchesQuery)
          .map(article => ({ ...article, categoryId: category.id, categoryTitle: category.title }))
      )
    : [];

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const activeCategory = selectedCategoryData
    ? {
        ...selectedCategoryData,
        articles: isSearching
          ? selectedCategoryData.articles.filter(matchesQuery)
          : selectedCategoryData.articles,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-paper font-display">
      {/* Header band */}
      <div className="bg-carbon">
        <div className="max-w-[1200px] mx-auto px-6 py-14 text-center">
          <h1 className="font-display font-light text-4xl md:text-[48px] tracking-heading text-paper mb-3">
            How can we help you?
          </h1>
          <p className="text-mist mb-8">
            {userRole === 'vendor' ? 'Vendor support & resources' : 'Client support & resources'}
          </p>

          <div className="max-w-lg mx-auto flex items-stretch bg-paper rounded border border-mist overflow-hidden focus-within:border-fiverr-green">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="flex-1 min-w-0 px-5 py-3 text-base text-carbon placeholder-smoke bg-transparent outline-none"
            />
            <div className="w-12 shrink-0 flex items-center justify-center text-graphite">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-carbon uppercase tracking-wide mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { setShowContactForm(true); setSelectedCategory(null); }}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg border border-mist text-carbon text-sm font-medium hover:bg-mist/30 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-graphite" />
                  Contact Support
                </button>
                <button
                  onClick={() => window.open('tel:+1-555-123-4567')}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg border border-mist text-carbon text-sm font-medium hover:bg-mist/30 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2 text-graphite" />
                  Call Support
                </button>
                <button
                  onClick={() => window.open('mailto:support@vendorhub.com')}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg border border-mist text-carbon text-sm font-medium hover:bg-mist/30 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2 text-graphite" />
                  Email Support
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-carbon uppercase tracking-wide mb-3">Categories</h3>
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setShowContactForm(false);
                      setSelectedCategory(selectedCategory === category.id ? null : category.id);
                    }}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-fiverr-green/10 text-fiverr-green'
                        : 'hover:bg-mist/30 text-graphite'
                      }
                    `}
                  >
                    <div className="flex items-center min-w-0">
                      <category.icon className="h-4 w-4 mr-3 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-medium truncate">{category.title}</span>
                    </div>
                    {selectedCategory === category.id ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {showContactForm ? (
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-graphite hover:text-carbon mr-3"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-carbon">Contact Support</h2>
                </div>

                <div className="bg-paper rounded-2xl border border-mist p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-carbon mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        required
                        className="w-full px-3 py-2 border border-fog rounded-xl focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-carbon mb-1">
                        Priority
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-fog rounded-xl focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-carbon mb-1">
                        Message
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please describe your issue in detail..."
                        rows={6}
                        required
                        className="w-full px-3 py-2 border border-fog rounded-xl focus:outline-none focus:ring-2 focus:ring-fiverr-green/30 focus:border-fiverr-green"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="px-5 py-2.5 rounded-lg border border-mist text-carbon font-medium hover:bg-mist/30 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-carbon text-paper font-medium hover:bg-slate transition-colors"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : activeCategory ? (
              <div>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-graphite hover:text-carbon mr-3"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-carbon">
                    {activeCategory.title}
                  </h2>
                </div>

                {activeCategory.articles.length > 0 ? (
                  <div className="space-y-4">
                    {activeCategory.articles.map((article, index) => (
                      <div key={index} className="bg-paper rounded-2xl border border-mist p-6 hover:shadow-card transition-shadow">
                        <h3 className="text-lg font-medium text-carbon mb-2">
                          {article.title}
                        </h3>
                        <p className="text-graphite">
                          {article.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-graphite">
                    No articles in this category match &ldquo;{searchQuery}&rdquo;.
                  </p>
                )}
              </div>
            ) : isSearching ? (
              <div>
                <h2 className="text-xl font-semibold text-carbon mb-6">
                  {searchResults.length > 0
                    ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for “${searchQuery}”`
                    : `No results for “${searchQuery}”`}
                </h2>

                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((article, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedCategory(article.categoryId)}
                        className="w-full text-left bg-paper rounded-2xl border border-mist p-6 hover:shadow-card transition-shadow"
                      >
                        <p className="text-xs text-fiverr-green font-medium mb-1">{article.categoryTitle}</p>
                        <h3 className="text-lg font-medium text-carbon mb-2">
                          {article.title}
                        </h3>
                        <p className="text-graphite">
                          {article.content}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-smoke mx-auto mb-4" strokeWidth={1.5} />
                    <p className="text-graphite mb-6">
                      Try a different search term, or reach out directly.
                    </p>
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="inline-flex items-center px-6 py-3 rounded-lg bg-carbon text-paper font-medium hover:bg-slate transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-smoke mx-auto mb-4" strokeWidth={1.5} />
                  <h2 className="text-xl font-semibold text-carbon mb-2">
                    Browse by topic
                  </h2>
                  <p className="text-graphite mb-6">
                    Select a category from the sidebar or search for specific topics.
                  </p>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-carbon text-paper font-medium hover:bg-slate transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </button>
                </div>

                {/* Popular Articles */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-carbon mb-4">Popular Articles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedCategory('getting-started')}
                      className="text-left bg-paper rounded-2xl border border-mist p-5 hover:shadow-card transition-shadow"
                    >
                      <h4 className="font-medium text-carbon mb-1">Getting Started Guide</h4>
                      <p className="text-sm text-graphite">Learn the basics of using VendorHub</p>
                    </button>
                    <button
                      onClick={() => setSelectedCategory('account-management')}
                      className="text-left bg-paper rounded-2xl border border-mist p-5 hover:shadow-card transition-shadow"
                    >
                      <h4 className="font-medium text-carbon mb-1">Account Management</h4>
                      <p className="text-sm text-graphite">Manage your profile and settings</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-mist bg-mist/20">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-graphite">
          <div>
            <span>Need immediate help? </span>
            <button
              onClick={() => window.open('tel:+1-555-123-4567')}
              className="text-fiverr-green hover:text-forest-stage font-medium"
            >
              Call us at (555) 123-4567
            </button>
          </div>
          <div>Response time: usually within 24 hours</div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
