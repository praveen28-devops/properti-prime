import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  Filter,
  RefreshCw
} from "lucide-react";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  availability: {
    roomId: string;
    roomNumber: string;
    roomType: string;
    status: "available" | "occupied" | "maintenance" | "blocked";
    rate?: number;
    guestName?: string;
    checkIn?: boolean;
    checkOut?: boolean;
  }[];
}

interface AvailabilityCalendarProps {
  propertyId: string;
  propertyTitle: string;
}

export const AvailabilityCalendar = ({ propertyId, propertyTitle }: AvailabilityCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"month" | "week">("month");
  const [roomFilter, setRoomFilter] = useState("all");

  // Mock room data
  const rooms = [
    { id: "1", number: "101", type: "Standard" },
    { id: "2", number: "102", type: "Standard" },
    { id: "3", number: "201", type: "Deluxe" },
    { id: "4", number: "202", type: "Deluxe" },
    { id: "5", number: "301", type: "Suite" },
  ];

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      // Mock availability data
      const availability = rooms.map(room => {
        const dayOfMonth = date.getDate();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        let status: "available" | "occupied" | "maintenance" | "blocked" = "available";
        let rate = 150 + Math.random() * 100;
        let guestName: string | undefined;
        let checkIn = false;
        let checkOut = false;
        
        // Simulate some bookings
        if (dayOfMonth % 7 === parseInt(room.id) % 7 && dayOfMonth > 5) {
          status = "occupied";
          guestName = `Guest ${room.number}`;
          if (dayOfMonth % 14 === parseInt(room.id) % 7) checkIn = true;
          if ((dayOfMonth + 2) % 14 === parseInt(room.id) % 7) checkOut = true;
        } else if (dayOfMonth % 15 === 3 && room.id === "3") {
          status = "maintenance";
        } else if (isWeekend && Math.random() > 0.7) {
          status = "blocked";
        }
        
        if (isWeekend) rate *= 1.2;
        
        return {
          roomId: room.id,
          roomNumber: room.number,
          roomType: room.type,
          status,
          rate: status === "available" ? Math.round(rate) : undefined,
          guestName,
          checkIn,
          checkOut
        };
      });
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        availability
      });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-green-500",
      occupied: "bg-blue-500",
      maintenance: "bg-orange-500",
      blocked: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: "Available",
      occupied: "Occupied",
      maintenance: "Maintenance",
      blocked: "Blocked"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filteredRooms = roomFilter === "all" ? rooms : rooms.filter(room => room.type === roomFilter);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Availability Calendar</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Room availability and booking overview for {propertyTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
              {["available", "occupied", "maintenance", "blocked"].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                  <span className="text-sm">{getStatusLabel(status)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-8 bg-muted">
              <div className="p-3 font-medium text-center border-r">Room</div>
              {dayNames.map((day) => (
                <div key={day} className="p-3 font-medium text-center border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            {filteredRooms.map((room) => (
              <div key={room.id} className="grid grid-cols-8 border-t">
                <div className="p-3 bg-muted/50 border-r font-medium">
                  <div className="text-sm font-semibold">{room.number}</div>
                  <div className="text-xs text-muted-foreground">{room.type}</div>
                </div>
                
                {calendarDays.slice(0, 7).map((day, dayIndex) => {
                  const roomAvailability = day.availability.find(a => a.roomId === room.id);
                  if (!roomAvailability) return null;

                  return (
                    <div
                      key={dayIndex}
                      className={`p-1 border-r last:border-r-0 min-h-[60px] relative ${
                        !day.isCurrentMonth ? 'bg-muted/20' : ''
                      } ${day.isToday ? 'bg-blue-50' : ''}`}
                    >
                      <div className="text-xs text-center mb-1">
                        {day.date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className={`w-full text-xs text-white ${getStatusColor(roomAvailability.status)}`}
                        >
                          {roomAvailability.status === "available" && roomAvailability.rate
                            ? `$${roomAvailability.rate}`
                            : getStatusLabel(roomAvailability.status)
                          }
                        </Badge>
                        
                        {roomAvailability.guestName && (
                          <div className="text-xs text-center truncate">
                            {roomAvailability.guestName}
                          </div>
                        )}
                        
                        {roomAvailability.checkIn && (
                          <Badge variant="outline" className="w-full text-xs bg-green-100">
                            Check-in
                          </Badge>
                        )}
                        
                        {roomAvailability.checkOut && (
                          <Badge variant="outline" className="w-full text-xs bg-orange-100">
                            Check-out
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((calendarDays.slice(0, 7).reduce((acc, day) => 
                      acc + day.availability.filter(a => a.status === "available").length, 0
                    ) / (filteredRooms.length * 7)) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((calendarDays.slice(0, 7).reduce((acc, day) => 
                      acc + day.availability.filter(a => a.status === "occupied").length, 0
                    ) / (filteredRooms.length * 7)) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Occupied</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {calendarDays.slice(0, 7).reduce((acc, day) => 
                      acc + day.availability.filter(a => a.status === "maintenance").length, 0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    $
                    {Math.round(
                      calendarDays.slice(0, 7).reduce((acc, day) => 
                        acc + day.availability
                          .filter(a => a.status === "available" && a.rate)
                          .reduce((sum, a) => sum + (a.rate || 0), 0), 0
                      ) / calendarDays.slice(0, 7).reduce((acc, day) => 
                        acc + day.availability.filter(a => a.status === "available" && a.rate).length, 0
                      ) || 0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
