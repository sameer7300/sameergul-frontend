export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string | null;
  role?: string;
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  order: number;
}

export interface PriceModifier {
  id: number;
  name: string;
  description: string;
  modifier_type: 'multiplier' | 'fixed' | 'percentage';
  value: number;
  is_active: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  base_price: number;
}

export interface CreateHiringRequest {
  title: string;
  description: string;
  requirements?: string;
  service_type: number;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  name?: string;
  email?: string;
  budget?: number;
}

export interface HiringRequest {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  service_type: ServiceType;
  service: Service;
  status: 'pending' | 'priced' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
  status_display?: string;
  priority: 'low' | 'medium' | 'high';
  priority_display?: string;
  quoted_price?: number;
  price?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  name?: string;
  email?: string;
  ticket_number: string;
  user?: User;
}

export interface FormInputs extends Omit<CreateHiringRequest, 'service_type'> {
  service_type: string;
  budget: number;
  attachments?: FileList;
}
