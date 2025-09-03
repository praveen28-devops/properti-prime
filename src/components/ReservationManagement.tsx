import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, CreditCard, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Reservation } from "@/components/BookingEngine";

interface ReservationCardProps {
  reservation: Reservation;
  onView?: (reservation: Reservation) => void;
  onEdit?: (reservation: Reservation) => void;
  onCancel?: (reservation: Reservation) => void;
}

const ReservationCard = ({ reservation, onView, onEdit, onCancel }: ReservationCardProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      "checked-in": "bg-green-500",
      "checked-out": "bg-gray-500",
      cancelled: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-orange-500",
      paid: "bg-green-500",
      refunded: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="group bg-card-gradient shadow-card hover:shadow-elevated transition-smooth border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-card-foreground">
              {reservation.guestName}
            </h3>
            <Badge 
              variant="outline" 
              className={`text-white ${getStatusColor(reservation.status)}`}
            >
              {reservation.status.replace('-', ' ')}
            </Badge>
          </div>
          <Badge 
            variant="outline"
            className={`text-white ${getPaymentStatusColor(reservation.paymentStatus)}`}
          >
            {reservation.paymentStatus}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Reservation ID: {reservation.id.slice(0, 8)}...
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Check-in</p>
              <p className="text-muted-foreground">{formatDate(reservation.checkIn)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Check-out</p>
              <p className="text-muted-foreground">{formatDate(reservation.checkOut)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Guests</p>
              <p className="text-muted-foreground">
                {reservation.adults} adults, {reservation.children} children
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Total Amount</p>
              <p className="text-muted-foreground font-semibold">
                {reservation.currency} {reservation.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium">Duration: {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</p>
          <p className="text-muted-foreground">Room ID: {reservation.roomId}</p>
        </div>

        {reservation.specialRequests && (
          <div className="text-sm">
            <p className="font-medium">Special Requests:</p>
            <p className="text-muted-foreground">{reservation.specialRequests}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button 
              onClick={() => onView(reservation)}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
          {onEdit && reservation.status !== 'cancelled' && (
            <Button 
              onClick={() => onEdit(reservation)}
              size="sm"
              variant="outline"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onCancel && reservation.status !== 'cancelled' && reservation.status !== 'checked-out' && (
            <Button 
              onClick={() => onCancel(reservation)}
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ReservationManagementProps {
  propertyId: string;
  propertyTitle: string;
}

export const ReservationManagement = ({ propertyId, propertyTitle }: ReservationManagementProps) => {
  const [reservations] = useState<Reservation[]>([]); // Will be populated from API
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || reservation.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleViewReservation = (reservation: Reservation) => {
    console.log('View reservation:', reservation);
    // TODO: Implement reservation details modal
  };

  const handleEditReservation = (reservation: Reservation) => {
    console.log('Edit reservation:', reservation);
    // TODO: Implement edit reservation functionality
  };

  const handleCancelReservation = (reservation: Reservation) => {
    if (window.confirm(`Are you sure you want to cancel the reservation for ${reservation.guestName}?`)) {
      console.log('Cancel reservation:', reservation);
      // TODO: Implement cancel reservation functionality
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Reservation Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage bookings and reservations for {propertyTitle}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by guest name, email, or reservation ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reservations Grid */}
          {filteredReservations.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredReservations.length} reservation{filteredReservations.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onView={handleViewReservation}
                    onEdit={handleEditReservation}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Reservations Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || paymentFilter !== "all" 
                    ? "No reservations match your current filters. Try adjusting your search criteria."
                    : "This property doesn't have any reservations yet. Bookings will appear here once guests make reservations."
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
