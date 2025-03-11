import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../../contexts/AuthContext';
import { useServices } from '../hooks/useServices';
import { useRequest } from '../hooks/useRequest';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  TagIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { CreateHiringRequest } from '../types';
import { FloatingPortal, FloatingFocusManager } from '@floating-ui/react';
import { offset, flip, shift } from '@floating-ui/react';

interface FormInputs {
  service_type: string;
  title: string;
  description: string;
  requirements?: string;
  priority: 'low' | 'medium' | 'high';
  name?: string;
  email?: string;
  deadline: Date | null;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

const Tooltip = ({ text }: { text: string }) => (
  <motion.div
    className="absolute z-20 -top-10 left-1/2 -translate-x-1/2 invisible group-hover:visible bg-gray-900/90 text-white text-xs rounded-md py-1.5 px-2.5 shadow-lg backdrop-blur-sm"
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    {text}
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900/90"></div>
  </motion.div>
);

const FormField = ({
  label,
  icon: Icon,
  tooltip,
  error,
  children,
}: {
  label: string;
  icon: any;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    variants={fadeIn}
    className="group relative"
    whileHover={{ y: -2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    <div className="flex items-center justify-between mb-2">
      <label className="flex items-center text-sm font-medium text-gray-800">
        <Icon className="h-4 w-4 mr-2 text-indigo-600" />
        {label}
      </label>
      {tooltip && (
        <div className="group relative inline-block">
          <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 hover:text-indigo-600 transition-colors duration-200" />
          <Tooltip text={tooltip} />
        </div>
      )}
    </div>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-xs text-red-500 mt-1 flex items-center absolute -bottom-5 left-0"
        >
          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const middleware = [
  offset(5),
  flip({
    fallbackPlacements: ['top', 'bottom'],
  }),
  shift({ padding: 5 }),
];

export default function RequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { services, isLoading: servicesLoading } = useServices();
  const { submitRequest, isSubmitting, error, setError } = useRequest();
  const serviceId = location.state?.serviceId;
  const [charCount, setCharCount] = useState({ description: 0, requirements: 0 });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, dirtyFields },
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      service_type: serviceId?.toString() || '',
      priority: 'medium',
      email: user?.email || '',
      name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
      deadline: null,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      setValue('email', user.email || '');
      setValue('name', `${user.first_name || ''} ${user.last_name || ''}`.trim());
    }
  }, [user, setValue]);

  const watchedFields = watch();
  useEffect(() => {
    if (error) setError(null);
  }, [watchedFields, setError, error]);

  const onSubmit = async (data: FormInputs) => {
    try {
      const requestData: CreateHiringRequest = {
        service_type: parseInt(data.service_type),
        title: data.title.trim(),
        description: data.description.trim(),
        requirements: data.requirements?.trim(),
        priority: data.priority,
        name: data.name?.trim(),
        email: data.email?.trim(),
        deadline: data.deadline ? data.deadline.toISOString().split('T')[0] : undefined
      };

      await submitRequest(requestData);
      navigate('/dashboard/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create request. Please try again.');
      }
    }
  };

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <motion.div className="max-w-2xl mx-auto" variants={fadeIn} initial="initial" animate="animate">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div className="max-w-2xl mx-auto" variants={fadeIn} initial="initial" animate="animate">
        <div className="bg-white rounded-2xl shadow-xl overflow-visible">
          <div className="p-8 relative">
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              New Service Request
            </motion.h2>

            {error && (
              <motion.div
                className="mb-6 p-3 bg-red-50 rounded-lg text-red-600 text-sm flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                label="Service Type"
                icon={TagIcon}
                tooltip="Select your desired service"
                error={errors.service_type?.message}
              >
                <select
                  {...register('service_type', { required: 'Service type is required' })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-sm transition-all duration-200"
                >
                  <option value="">Choose a service</option>
                  {services?.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.base_price}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Request Title"
                icon={DocumentTextIcon}
                tooltip="Give your request a clear title"
                error={errors.title?.message}
              >
                <div className="relative">
                  <input
                    type="text"
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 5, message: 'Minimum 5 characters' },
                    })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-sm transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter request title"
                  />
                  {dirtyFields.title && !errors.title && (
                    <CheckCircleIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </FormField>

              <FormField
                label="Description"
                icon={ClipboardDocumentListIcon}
                tooltip="Describe your needs in detail"
                error={errors.description?.message}
              >
                <div className="relative">
                  <textarea
                    rows={4}
                    {...register('description', {
                      required: 'Description is required',
                      minLength: { value: 20, message: 'Minimum 20 characters' },
                    })}
                    onChange={(e) =>
                      setCharCount((prev) => ({ ...prev, description: e.target.value.length }))
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-sm transition-all duration-200 resize-y placeholder-gray-400"
                    placeholder="Describe your request"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {charCount.description}/500
                  </span>
                </div>
              </FormField>

              <FormField
                label="Requirements"
                icon={ClipboardDocumentListIcon}
                tooltip="List specific requirements"
                error={errors.requirements?.message}
              >
                <div className="relative">
                  <textarea
                    rows={3}
                    {...register('requirements')}
                    onChange={(e) =>
                      setCharCount((prev) => ({ ...prev, requirements: e.target.value.length }))
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-sm transition-all duration-200 resize-y placeholder-gray-400"
                    placeholder="Optional requirements"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {charCount.requirements}/300
                  </span>
                </div>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField label="Priority" icon={ClockIcon} tooltip="Set urgency level">
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-sm transition-all duration-200"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </FormField>

                <FormField label="Deadline" icon={CalendarIcon} tooltip="Set completion date">
                  <Controller<FormInputs>
                    control={control}
                    name="deadline"
                    render={({ field: { value, onChange, ...field } }) => (
                      <div className="relative">
                        <DatePicker
                          {...field}
                          selected={value instanceof Date ? value : null}
                          onChange={(date: Date | null) => onChange(date)}
                          minDate={new Date()}
                          placeholderText="Pick a date"
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-sm transition-all duration-200 placeholder-gray-400"
                          dateFormat="MMM d, yyyy"
                          showPopperArrow={false}
                          popperPlacement="top-end"
                          dropdownMode="select"
                        />
                        <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    )}
                  />
                </FormField>
              </div>

              <motion.div
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium text-sm shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    <motion.span whileHover={{ scale: 1.02 }} transition={{ type: 'spring' }}>
                      Submit Request
                    </motion.span>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}