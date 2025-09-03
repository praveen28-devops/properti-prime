import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Bath, Square, DollarSign, Phone, Mail, X, Hotel, TrendingUp } from "lucide-react";
import { Property } from "./PropertyCard";
import { RoomManagement } from "./RoomManagement";
import { RateManagement } from "./RateManagement";
import { ReportingDashboard } from "./ReportingDashboard";
import { UserManagement } from "./UserManagement";
import { OrganizationManagement } from "./OrganizationManagement";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { ChannelManager } from "./ChannelManager";
import { GroupBookingEngine } from "./GroupBookingEngine";
import { TravelAgencyManagement } from "./TravelAgencyManagement";
import { BookingEngine } from "./BookingEngine";
import { ReservationManagement } from "./ReservationManagement";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyModal = ({ property, isOpen, onClose }: PropertyModalProps) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!property) return null;

  const formatPrice = (price: number, type: "rent" | "sale") => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return type === "rent" ? `${formatted}/month` : formatted;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-card-foreground">
                {property.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Badge>
            <Badge variant={property.priceType === "rent" ? "default" : "accent"}>
              {property.priceType === "rent" ? "For Rent" : "For Sale"}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Property Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={property.imageUrl || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Price and Key Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold text-3xl">
                  <DollarSign className="h-8 w-8" />
                  <span>{formatPrice(property.price, property.priceType)}</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-secondary-foreground font-semibold">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Bedrooms</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-secondary-foreground font-semibold">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Bathrooms</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-secondary-foreground font-semibold">
                      <Square className="h-4 w-4" />
                      <span>{property.squareFeet.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Sq Ft</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {(property.contactPhone || property.contactEmail) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Contact Information</h3>
                  <div className="space-y-3">
                    {property.contactPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">{property.contactPhone}</span>
                      </div>
                    )}
                    {property.contactEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">{property.contactEmail}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button variant="accent" className="w-full">
                        Contact Agent
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-card-foreground">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="mt-6">
            <RoomManagement 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>

          <TabsContent value="rates" className="mt-6">
            <RateManagement 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>

          <TabsContent value="channels" className="mt-6">
            <ChannelManager 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>

          <TabsContent value="booking" className="mt-6">
            <BookingEngine 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>

          <TabsContent value="group" className="mt-6">
            <GroupBookingEngine 
              propertyId={property.id} 
              onSubmit={(booking) => console.log('Group booking submitted:', booking)}
              onClose={() => setActiveTab('details')}
            />
          </TabsContent>

          <TabsContent value="agencies" className="mt-6">
            <TravelAgencyManagement />
          </TabsContent>

          <TabsContent value="reservations" className="mt-6">
            <ReservationManagement 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <AvailabilityCalendar 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportingDashboard 
              propertyId={property.id} 
              propertyTitle={property.title}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};