import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, CreateRatePlanRequest } from '@/services/api';
import { RatePlan } from '@/components/RatePlan';
import { toast } from 'sonner';

// Query keys
const RATE_PLAN_QUERY_KEYS = {
  ratePlans: (propertyId: string) => ['ratePlans', propertyId] as const,
  ratePlan: (id: string) => ['ratePlan', id] as const,
};

// Fetch rate plans for a property
export const useRatePlans = (propertyId: string) => {
  return useQuery({
    queryKey: RATE_PLAN_QUERY_KEYS.ratePlans(propertyId),
    queryFn: () => apiService.getRatePlans(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Fetch single rate plan
export const useRatePlan = (id: string) => {
  return useQuery({
    queryKey: RATE_PLAN_QUERY_KEYS.ratePlan(id),
    queryFn: () => apiService.getRatePlan(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Create rate plan mutation
export const useCreateRatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratePlanData: CreateRatePlanRequest) => 
      apiService.createRatePlan(ratePlanData),
    onSuccess: (newRatePlan) => {
      // Invalidate and refetch rate plans list for the property
      queryClient.invalidateQueries({ 
        queryKey: RATE_PLAN_QUERY_KEYS.ratePlans(newRatePlan.propertyId) 
      });
      // Show success message
      toast.success('Rate plan created successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to create rate plan: ${error.message}`);
    },
  });
};

// Update rate plan mutation
export const useUpdateRatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRatePlanRequest> }) => 
      apiService.updateRatePlan(id, data),
    onSuccess: (updatedRatePlan) => {
      // Invalidate and refetch rate plans list for the property
      queryClient.invalidateQueries({ 
        queryKey: RATE_PLAN_QUERY_KEYS.ratePlans(updatedRatePlan.propertyId) 
      });
      // Update the specific rate plan in cache
      queryClient.setQueryData(RATE_PLAN_QUERY_KEYS.ratePlan(updatedRatePlan.id), updatedRatePlan);
      // Show success message
      toast.success('Rate plan updated successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to update rate plan: ${error.message}`);
    },
  });
};

// Delete rate plan mutation
export const useDeleteRatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) => 
      apiService.deleteRatePlan(id),
    onSuccess: (_, { id, propertyId }) => {
      // Invalidate and refetch rate plans list for the property
      queryClient.invalidateQueries({ 
        queryKey: RATE_PLAN_QUERY_KEYS.ratePlans(propertyId) 
      });
      // Remove the specific rate plan from cache
      queryClient.removeQueries({ queryKey: RATE_PLAN_QUERY_KEYS.ratePlan(id) });
      // Show success message
      toast.success('Rate plan deleted successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to delete rate plan: ${error.message}`);
    },
  });
};

// Toggle rate plan active status
export const useToggleRatePlanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive, propertyId }: { id: string; isActive: boolean; propertyId: string }) => 
      apiService.updateRatePlan(id, { isActive }),
    onSuccess: (updatedRatePlan) => {
      // Invalidate and refetch rate plans list for the property
      queryClient.invalidateQueries({ 
        queryKey: RATE_PLAN_QUERY_KEYS.ratePlans(updatedRatePlan.propertyId) 
      });
      // Update the specific rate plan in cache
      queryClient.setQueryData(RATE_PLAN_QUERY_KEYS.ratePlan(updatedRatePlan.id), updatedRatePlan);
      // Show success message
      toast.success(`Rate plan ${updatedRatePlan.isActive ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to update rate plan status: ${error.message}`);
    },
  });
};
