import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { VendorCategory } from '../lib/types';
import { getCategoryLabel } from '../lib/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import CurrencySelector from '../components/ui/CurrencySelector';

interface VendorProfileData {
  id?: string;
  business_name: string;
  category: VendorCategory | '';
  description: string;
  services: string[];
  location: {
    city: string;
    state: string;
    address: string;
  };
  pricing: {
    min: number;
    max: number;
    unit: string;
  };
  profile_image?: string;
  verified: boolean;
  availability: boolean;
}

const categories: VendorCategory[] = [
  'catering', 'photography', 'venues', 'music', 'flowers', 'decor', 'transportation', 'planning'
];

const VendorProfileEdit: React.FC = () => {
  const { user, profile, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<VendorProfileData>({
    business_name: '',
    category: '',
    description: '',
    services: [''],
    location: { city: '', state: '', address: '' },
    pricing: { min: 0, max: 0, unit: 'per event' },
    verified: false,
    availability: true,
  });

  useEffect(() => {
    if (profile?.role !== 'vendor') {
      navigate('/dashboard/client');
      return;
    }
    fetchVendorProfile();
  }, [user?.id, profile?.role]);

  const fetchVendorProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          id: data.id,
          business_name: data.business_name || '',
          category: data.category || '',
          description: data.description || '',
          services: data.services || [''],
          location: data.location || { city: '', state: '', address: '' },
          pricing: data.pricing || { min: 0, max: 0, unit: 'per event' },
          profile_image: data.profile_image,
          verified: data.verified || false,
          availability: data.availability ?? true,
        });
      }
    } catch (err) {
      console.error('Error fetching vendor profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handlePricingChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value }
    }));
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData(prev => ({ ...prev, services: [...prev.services, ''] }));
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, services: newServices }));
    }
  };

  const handleCurrencyChange = async (currency: 'USD' | 'NGN') => {
    if (profile) {
      try {
        await updateProfile({ currency });
      } catch (error) {
        console.error('Failed to update currency preference:', error);
      }
    }
  };

  const validateForm = () => {
    if (!formData.business_name.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.services.filter(s => s.trim()).length === 0) {
      setError('At least one service is required');
      return false;
    }
    if (!formData.location.city.trim() || !formData.location.state.trim()) {
      setError('City and state are required');
      return false;
    }
    if (formData.pricing.min <= 0 || formData.pricing.max <= 0) {
      setError('Valid pricing is required');
      return false;
    }
    if (formData.pricing.min > formData.pricing.max) {
      setError('Minimum price cannot be greater than maximum price');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      const profileData = {
        user_id: user?.id,
        business_name: formData.business_name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        services: formData.services.filter(s => s.trim()),
        location: formData.location,
        pricing: formData.pricing,
        profile_image: formData.profile_image,
        availability: formData.availability,
      };

      if (formData.id) {
        // Update existing profile
        const { error } = await supabase
          .from('vendor_profiles')
          .update(profileData)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('vendor_profiles')
          .insert(profileData)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setFormData(prev => ({ ...prev, id: data.id }));
        }
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('vendor_profiles')
        .delete()
        .eq('id', formData.id);

      if (error) throw error;

      navigate('/dashboard/vendor');
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete profile. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard/vendor"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Vendor Profile</h1>
              <p className="text-gray-600 mt-2">Update your business information and services</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to={`/vendor-preview/${user?.id}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Profile
                </Button>
              </Link>
              
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex justify-center">
                <ImageUpload
                  currentImage={formData.profile_image}
                  onImageChange={(url) => handleInputChange('profile_image', url)}
                  size="lg"
                />
              </div>

              <Input
                label="Business Name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Enter your business name"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your business and what makes you unique..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Services */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Services Offered</h2>
            
            <div className="space-y-3">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    placeholder="Enter a service you offer"
                    className="flex-1"
                  />
                  {formData.services.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button variant="outline" onClick={addService}>
                Add Service
              </Button>
            </div>
          </Card>

          {/* Location */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="City"
                value={formData.location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                placeholder="Enter your city"
                required
              />

              <Input
                label="State"
                value={formData.location.state}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                placeholder="Enter your state"
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Address (Optional)"
                  value={formData.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  placeholder="Enter your business address"
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pricing</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Currency:</span>
                <CurrencySelector
                  value={profile?.currency || 'USD'}
                  onChange={handleCurrencyChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label={`Minimum Price (${profile?.currency || 'USD'})`}
                type="number"
                value={formData.pricing.min}
                onChange={(e) => handlePricingChange('min', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                required
              />

              <Input
                label={`Maximum Price (${profile?.currency || 'USD'})`}
                type="number"
                value={formData.pricing.max}
                onChange={(e) => handlePricingChange('max', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                required
              />

              <Input
                label="Pricing Unit"
                value={formData.pricing.unit}
                onChange={(e) => handlePricingChange('unit', e.target.value)}
                placeholder="per event, per hour, etc."
                required
              />
            </div>
          </Card>

          {/* Settings */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availability"
                  checked={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="availability" className="ml-3 text-sm text-gray-700">
                  Available for new bookings
                </label>
              </div>

              {formData.verified && (
                <div className="flex items-center text-emerald-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Your profile is verified</span>
                </div>
              )}
            </div>
          </Card>

          {/* Danger Zone */}
          {formData.id && (
            <Card className="border-red-200">
              <h2 className="text-xl font-semibold text-red-900 mb-6">Danger Zone</h2>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-900 mb-2">Delete Profile</h3>
                <p className="text-red-700 mb-4">
                  This will permanently delete your vendor profile. This action cannot be undone.
                </p>
                
                {!showDeleteConfirm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Profile
                  </Button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <span className="text-red-700 font-medium">Are you sure?</span>
                    <Button
                      onClick={handleDelete}
                      loading={saving}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileEdit;