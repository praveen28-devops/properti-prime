import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomCard, Room } from "@/components/RoomCard";
import { AddRoomForm } from "@/components/AddRoomForm";
import { useRooms, useCreateRoom, useDeleteRoom } from "@/hooks/useRooms";
import { Plus, Loader2, AlertCircle, Hotel } from "lucide-react";

interface RoomManagementProps {
  propertyId: string;
  propertyTitle: string;
}

export const RoomManagement = ({ propertyId, propertyTitle }: RoomManagementProps) => {
  const { data: rooms = [], isLoading, error, isError } = useRooms(propertyId);
  const createRoomMutation = useCreateRoom();
  const deleteRoomMutation = useDeleteRoom();
  
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleCreateRoom = async (roomData: any) => {
    try {
      await createRoomMutation.mutateAsync(roomData);
      setIsAddRoomOpen(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    // TODO: Implement edit room functionality
  };

  const handleDeleteRoom = async (room: Room) => {
    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}? This action cannot be undone.`)) {
      try {
        await deleteRoomMutation.mutateAsync({
          id: room.id,
          propertyId: room.propertyId
        });
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  const handleViewRoomDetails = (room: Room) => {
    // TODO: Implement room details modal
    console.log('View room details:', room);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hotel className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Room Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage rooms for {propertyTitle}
                </p>
              </div>
            </div>
            <Button onClick={() => setIsAddRoomOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Loading Rooms...</h3>
                <p className="text-muted-foreground">Please wait while we fetch the room data.</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Failed to Load Rooms</h3>
                <p className="text-muted-foreground">
                  {error?.message || 'Unable to fetch room data. Please try again.'}
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Rooms Grid */}
          {!isLoading && !isError && (
            rooms.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onEdit={handleEditRoom}
                      onDelete={handleDeleteRoom}
                      onViewDetails={handleViewRoomDetails}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Hotel className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No Rooms Found</h3>
                  <p className="text-muted-foreground">
                    This property doesn't have any rooms yet. Add the first room to get started.
                  </p>
                  <Button 
                    onClick={() => setIsAddRoomOpen(true)}
                    variant="default"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Room
                  </Button>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Add Room Form */}
      <AddRoomForm
        propertyId={propertyId}
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onSubmit={handleCreateRoom}
      />
    </div>
  );
};
