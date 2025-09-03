import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, CreatePropertyRequest } from '@/services/api';
import { Property } from '@/components/PropertyCard';
import { toast } from 'sonner';

// Query keys
const QUERY_KEYS = {
  properties: ['properties'] as const,
  property: (id: string) => ['properties', id] as const,
  health: ['health'] as const,
};

// Fetch all properties
export const useProperties = () => {
  return useQuery({
    queryKey: QUERY_KEYS.properties,
    queryFn: () => apiService.getProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Fetch single property
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.property(id),
    queryFn: () => apiService.getProperty(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Create property mutation
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) => 
      apiService.createProperty(propertyData),
    onSuccess: (newProperty) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.properties });
      // Show success message
      toast.success('Property created successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to create property: ${error.message}`);
    },
  });
};

// Update property mutation
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePropertyRequest> }) => 
      apiService.updateProperty(id, data),
    onSuccess: (updatedProperty) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.properties });
      // Update the specific property in cache
      queryClient.setQueryData(QUERY_KEYS.property(updatedProperty.id), updatedProperty);
      // Show success message
      toast.success('Property updated successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to update property: ${error.message}`);
    },
  });
};

// Delete property mutation
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteProperty(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.properties });
      // Remove the specific property from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.property(deletedId) });
      // Show success message
      toast.success('Property deleted successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to delete property: ${error.message}`);
    },
  });
};

// Health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: () => apiService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

// API health check
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
