import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGetServiceTypesQuery, useCreateHiringRequestMutation, useGetHiringRequestsQuery } from '../../services/hiringApi';
import type { CreateHiringRequest } from '../../services/hiringApi';
import { useAuth } from '../../context/AuthContext';

interface FormInputs extends CreateHiringRequest {
  attachments?: FileList;
}

const AUTH_TOKEN_KEY = 'authToken';

export default function RequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const serviceId = location.state?.serviceId;
  const { data: services } = useGetServiceTypesQuery();
  const { refetch: refetchRequests } = useGetHiringRequestsQuery(undefined);
  const [createRequest] = useCreateHiringRequestMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      service_type: serviceId?.toString() || '',
      priority: 'medium',
      email: user?.email || '',
      name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
    },
    mode: 'onChange',
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setValue('email', user.email || '');
      setValue('name', `${user.first_name || ''} ${user.last_name || ''}`.trim());
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormInputs) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const requestData: CreateHiringRequest = {
        service_type: data.service_type,
        title: data.title.trim(),
        description: data.description.trim(),
        requirements: data.requirements?.trim() || '',
        priority: data.priority as 'low' | 'medium' | 'high',
        name: data.name?.trim() || '',
        email: data.email?.trim() || '',
      };

      // Add optional fields if they have values
      if (data.deadline) {
        requestData.deadline = new Date(data.deadline).toISOString().split('T')[0];
      }

      console.log('Submitting request data:', requestData);
      const response = await createRequest(requestData).unwrap();
      console.log('Created request:', response);
      
      // Store email for anonymous requests
      if (!isAuthenticated && requestData.email) {
        localStorage.setItem('userEmail', requestData.email);
      }
      
      // Navigate to the requests list and wait a bit for the API to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/hiring/requests', { 
        replace: true,
        state: { 
          message: 'Request created successfully!',
          type: 'success'
        }
      });

      // Refetch the requests list
      await refetchRequests();
    } catch (err: any) {
      console.error('Error creating request:', err);
      setError(
        err?.data?.error || 
        err?.data?.detail || 
        err?.data?.message || 
        'Failed to create request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Request</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-400 rounded text-red-700">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Service Type */}
              <div>
                <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
                  Service Type *
                </label>
                <select
                  id="service_type"
                  {...register('service_type', { required: 'Please select a service type' })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a service</option>
                  {services?.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - Starting at ${service.base_price}
                    </option>
                  ))}
                </select>
                {errors.service_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.service_type.message}</p>
                )}
              </div>

              {/* Anonymous User Fields */}
              {!isAuthenticated && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: 'Name is required for anonymous requests' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required for anonymous requests',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Specific Requirements *
                </label>
                <textarea
                  id="requirements"
                  rows={4}
                  {...register('requirements', { required: 'Requirements are required' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    min="0"
                    step="0.01"
                    {...register('budget', {
                      min: { value: 0, message: 'Budget cannot be negative' },
                      valueAsNumber: true
                    })}
                    className="mt-1 block w-full pl-7 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Preferred Deadline (Optional)
                </label>
                <Controller
                  control={control}
                  name="deadline"
                  rules={{
                    validate: (value) => {
                      if (!value) return true;
                      return new Date(value) > new Date() || 'Deadline cannot be in the past';
                    }
                  }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      minDate={new Date()}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholderText="Select a deadline"
                    />
                  )}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority Level *
                </label>
                <select
                  id="priority"
                  {...register('priority', { required: 'Priority is required' })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="low">Low - Standard timeline</option>
                  <option value="medium">Medium - Moderate urgency</option>
                  <option value="high">High - Urgent delivery</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Request'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
