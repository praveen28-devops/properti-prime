import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property } from '@/components/PropertyCard';
import { apiService, CreatePropertyRequest } from '@/services/api';
import { toast } from 'sonner';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => apiService.getProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => apiService.getProperty(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) => 
      apiService.createProperty(propertyData),
    onSuccess: (newProperty) => {
      // Update the properties list cache
      queryClient.setQueryData(['properties'], (oldData: Property[] | undefined) => {
        return oldData ? [...oldData, newProperty] : [newProperty];
      });
      
      // Show success message
      toast.success('Property created successfully!');
    },
    onError: (error: Error) => {
      // Show error message
      toast.error(`Failed to create property: ${error.message}`);
    },
  });
};

export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      await apiService.healthCheck();
      setIsHealthy(true);
    } catch (error) {
      setIsHealthy(false);
      console.error('API health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isHealthy, isChecking, checkHealth };
};
