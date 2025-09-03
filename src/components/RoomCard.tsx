import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, Edit, Trash2, DollarSign, Ruler } from "lucide-react";

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  roomType: "single" | "double" | "suite" | "deluxe" | "presidential";
  capacity: number;
  baseRate: number;
  amenities: string[];
  floor: number;
  size: number;
  description: string;
  images: string[];
  isAvailable?: boolean;
}

interface RoomCardProps {
  room: Room;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onViewDetails?: (room: Room) => void;
}

export const RoomCard = ({ room, onEdit, onDelete, onViewDetails }: RoomCardProps) => {
  const getRoomTypeLabel = (type: string) => {
    const labels = {
      single: "Single Room",
      double: "Double Room",
      suite: "Suite",
      deluxe: "Deluxe Room",
      presidential: "Presidential Suite"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="group bg-card-gradient shadow-card hover:shadow-elevated transition-smooth border-border overflow-hidden animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-card-foreground">
              Room {room.roomNumber}
            </h3>
            <Badge variant="outline" className="text-xs">
              Floor {room.floor}
            </Badge>
          </div>
          <Badge 
            variant={room.isAvailable !== false ? "default" : "secondary"}
            className={room.isAvailable !== false ? "bg-green-500" : "bg-red-500"}
          >
            {room.isAvailable !== false ? "Available" : "Occupied"}
          </Badge>
        </div>
        <Badge variant="secondary" className="w-fit">
          {getRoomTypeLabel(room.roomType)}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-primary font-bold text-xl">
          <DollarSign className="h-5 w-5" />
          <span>{formatPrice(room.baseRate)}/night</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>{room.size} sqft</span>
          </div>
        </div>

        {room.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateDescription(room.description)}
          </p>
        )}

        {room.amenities.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Amenities:</p>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {room.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{room.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          {onViewDetails && (
            <Button 
              onClick={() => onViewDetails(room)}
              className="flex-1"
              variant="default"
            >
              View Details
            </Button>
          )}
          {onEdit && (
            <Button 
              onClick={() => onEdit(room)}
              size="sm"
              variant="outline"
              className="px-3"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(room)}
              size="sm"
              variant="outline"
              className="px-3 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
