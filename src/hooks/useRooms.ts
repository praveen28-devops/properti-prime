import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, CreateRoomRequest } from '@/services/api';
import { Room } from '@/components/RoomCard';
import { toast } from 'sonner';

// Query keys
const ROOM_QUERY_KEYS = {
  rooms: (propertyId: string) => ['rooms', propertyId] as const,
  room: (id: string) => ['room', id] as const,
};

// Fetch rooms for a property
export const useRooms = (propertyId: string) => {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.rooms(propertyId),
    queryFn: () => apiService.getRooms(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Fetch single room
export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.room(id),
    queryFn: () => apiService.getRoom(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Create room mutation
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomData: CreateRoomRequest) => 
      apiService.createRoom(roomData),
    onSuccess: (newRoom) => {
      // Invalidate and refetch rooms list for the property
      queryClient.invalidateQueries({ 
        queryKey: ROOM_QUERY_KEYS.rooms(newRoom.propertyId) 
      });
      // Show success message
      toast.success('Room created successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to create room: ${error.message}`);
    },
  });
};

// Update room mutation
export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoomRequest> }) => 
      apiService.updateRoom(id, data),
    onSuccess: (updatedRoom) => {
      // Invalidate and refetch rooms list for the property
      queryClient.invalidateQueries({ 
        queryKey: ROOM_QUERY_KEYS.rooms(updatedRoom.propertyId) 
      });
      // Update the specific room in cache
      queryClient.setQueryData(ROOM_QUERY_KEYS.room(updatedRoom.id), updatedRoom);
      // Show success message
      toast.success('Room updated successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to update room: ${error.message}`);
    },
  });
};

// Delete room mutation
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) => 
      apiService.deleteRoom(id),
    onSuccess: (_, { id, propertyId }) => {
      // Invalidate and refetch rooms list for the property
      queryClient.invalidateQueries({ 
        queryKey: ROOM_QUERY_KEYS.rooms(propertyId) 
      });
      // Remove the specific room from cache
      queryClient.removeQueries({ queryKey: ROOM_QUERY_KEYS.room(id) });
      // Show success message
      toast.success('Room deleted successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(`Failed to delete room: ${error.message}`);
    },
  });
};
