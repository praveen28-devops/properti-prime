import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, CreateReservationRequest } from '@/services/api';
import { Reservation } from '@/components/BookingEngine';
import { toast } from 'sonner';

// Query keys
const RESERVATION_QUERY_KEYS = {
  reservations: (propertyId: string) => ['reservations', propertyId] as const,
  reservation: (id: string) => ['reservation', id] as const,
};

// Fetch reservations for a property
export const useReservations = (propertyId: string) => {
  return useQuery({
    queryKey: RESERVATION_QUERY_KEYS.reservations(propertyId),
    queryFn: () => apiService.getReservations(propertyId),
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Fetch single reservation
export const useReservation = (id: string) => {
  return useQuery({
    queryKey: RESERVATION_QUERY_KEYS.reservation(id),
    queryFn: () => apiService.getReservation(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

// Create reservation mutation
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationData: CreateReservationRequest) => 
      apiService.createReservation(reservationData),
    onSuccess: (newReservation) => {
      // Invalidate and refetch reservations list for the property
      queryClient.invalidateQueries({ 
        queryKey: RESERVATION_QUERY_KEYS.reservations(newReservation.propertyId) 
      });
      // Show success message
      toast.success('Reservation created successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to create reservation: ${error.message}`);
    },
  });
};

// Update reservation mutation
export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReservationRequest> }) => 
      apiService.updateReservation(id, data),
    onSuccess: (updatedReservation) => {
      // Invalidate and refetch reservations list for the property
      queryClient.invalidateQueries({ 
        queryKey: RESERVATION_QUERY_KEYS.reservations(updatedReservation.propertyId) 
      });
      // Update the specific reservation in cache
      queryClient.setQueryData(RESERVATION_QUERY_KEYS.reservation(updatedReservation.id), updatedReservation);
      // Show success message
      toast.success('Reservation updated successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to update reservation: ${error.message}`);
    },
  });
};

// Cancel reservation mutation
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) => 
      apiService.cancelReservation(id),
    onSuccess: (_, { id, propertyId }) => {
      // Invalidate and refetch reservations list for the property
      queryClient.invalidateQueries({ 
        queryKey: RESERVATION_QUERY_KEYS.reservations(propertyId) 
      });
      // Remove the specific reservation from cache
      queryClient.removeQueries({ queryKey: RESERVATION_QUERY_KEYS.reservation(id) });
      // Show success message
      toast.success('Reservation cancelled successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to cancel reservation: ${error.message}`);
    },
  });
};
