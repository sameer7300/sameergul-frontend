export interface ServiceType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
}

export interface HiringRequest {
  id: number;
  ticket_number: string;
  service_type: ServiceType;
  title: string;
  description: string;
  requirements?: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  status: 'pending' | 'priced' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
  price?: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface CreateHiringRequest {
  service_type: number;
  title: string;
  description: string;
  requirements?: string;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
  name: string;
  email: string;
}

export interface RequestError {
  message: string;
  field?: string;
}

export interface RequestState {
  isLoading: boolean;
  error: RequestError | null;
  data: HiringRequest | null;
}
