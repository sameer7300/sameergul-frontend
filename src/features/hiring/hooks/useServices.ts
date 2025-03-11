import { useGetServiceTypesQuery } from '../../../services/hiringApi';
import type { ServiceType } from '../types';

export function useServices() {
  const {
    data: services = [],
    isLoading,
    error,
    refetch,
  } = useGetServiceTypesQuery();

  const activeServices = services.filter(
    (service: ServiceType) => service.is_active
  );

  return {
    services: activeServices,
    isLoading,
    error,
    refetch,
  };
}
