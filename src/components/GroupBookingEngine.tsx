import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  CreditCard,
  Plus,
  Minus,
  FileText,
  Clock
} from "lucide-react";

interface GroupBookingRequest {
  groupName: string;
  groupType: "corporate" | "wedding" | "conference" | "leisure" | "sports" | "education";
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  organization: {
    name: string;
    type: "travel_agency" | "corporate" | "event_planner" | "direct";
    taxId?: string;
    address: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    flexibility: number; // days
  };
  requirements: {
    totalGuests: number;
    rooms: Array<{
      roomType: string;
      quantity: number;
      occupancy: number;
    }>;
    specialRequests: string;
    amenitiesRequired: string[];
    budgetRange: {
      min: number;
      max: number;
    };
  };
  services: {
    catering: boolean;
    transportation: boolean;
    eventSpace: boolean;
    audioVisual: boolean;
    concierge: boolean;
  };
  paymentTerms: {
    depositPercentage: number;
    paymentSchedule: "immediate" | "30_days" | "60_days" | "custom";
    cancellationPolicy: string;
  };
}

interface TravelAgency {
  id: string;
  name: string;
  type: "retail" | "online" | "corporate" | "wholesale";
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  commissionRate: number;
  status: "active" | "inactive" | "pending";
  bookingsThisMonth: number;
  totalRevenue: number;
  preferredRates: boolean;
}

interface GroupBookingEngineProps {
  propertyId: string;
  onSubmit: (booking: GroupBookingRequest) => void;
  onClose: () => void;
}

export const GroupBookingEngine = ({ propertyId, onSubmit, onClose }: GroupBookingEngineProps) => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<GroupBookingRequest>({
    groupName: "",
    groupType: "corporate",
    contactPerson: {
      name: "",
      email: "",
      phone: "",
      title: ""
    },
    organization: {
      name: "",
      type: "direct",
      address: ""
    },
    dates: {
      checkIn: "",
      checkOut: "",
      flexibility: 0
    },
    requirements: {
      totalGuests: 10,
      rooms: [{ roomType: "double", quantity: 5, occupancy: 2 }],
      specialRequests: "",
      amenitiesRequired: [],
      budgetRange: { min: 100, max: 300 }
    },
    services: {
      catering: false,
      transportation: false,
      eventSpace: false,
      audioVisual: false,
      concierge: false
    },
    paymentTerms: {
      depositPercentage: 25,
      paymentSchedule: "30_days",
      cancellationPolicy: "standard"
    }
  });

  const [travelAgencies] = useState<TravelAgency[]>([
    {
      id: "ta-001",
      name: "Global Travel Solutions",
      type: "corporate",
      contactInfo: {
        email: "bookings@globaltravelsolutions.com",
        phone: "+1-555-0123",
        address: "123 Business Ave, New York, NY 10001"
      },
      commissionRate: 12,
      status: "active",
      bookingsThisMonth: 45,
      totalRevenue: 125000,
      preferredRates: true
    },
    {
      id: "ta-002",
      name: "Premium Events & Travel",
      type: "retail",
      contactInfo: {
        email: "events@premiumtravel.com",
        phone: "+1-555-0456",
        address: "456 Event Plaza, Los Angeles, CA 90210"
      },
      commissionRate: 15,
      status: "active",
      bookingsThisMonth: 28,
      totalRevenue: 89000,
      preferredRates: true
    }
  ]);

  const updateBooking = (field: string, value: any) => {
    setBooking(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: keyof GroupBookingRequest, field: string, value: any) => {
    setBooking(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const addRoom = () => {
    setBooking(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        rooms: [...prev.requirements.rooms, { roomType: "double", quantity: 1, occupancy: 2 }]
      }
    }));
  };

  const removeRoom = (index: number) => {
    setBooking(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        rooms: prev.requirements.rooms.filter((_, i) => i !== index)
      }
    }));
  };

  const updateRoom = (index: number, field: string, value: any) => {
    setBooking(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        rooms: prev.requirements.rooms.map((room, i) => 
          i === index ? { ...room, [field]: value } : room
        )
      }
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Group Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="groupName">Group Name *</Label>
            <Input
              id="groupName"
              value={booking.groupName}
              onChange={(e) => updateBooking("groupName", e.target.value)}
              placeholder="Annual Sales Conference 2024"
            />
          </div>
          <div>
            <Label htmlFor="groupType">Group Type *</Label>
            <Select value={booking.groupType} onValueChange={(value) => updateBooking("groupType", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="leisure">Leisure</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Person</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactName">Full Name *</Label>
            <Input
              id="contactName"
              value={booking.contactPerson.name}
              onChange={(e) => updateNestedField("contactPerson", "name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contactTitle">Title</Label>
            <Input
              id="contactTitle"
              value={booking.contactPerson.title}
              onChange={(e) => updateNestedField("contactPerson", "title", e.target.value)}
              placeholder="Event Coordinator"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={booking.contactPerson.email}
              onChange={(e) => updateNestedField("contactPerson", "email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contactPhone">Phone *</Label>
            <Input
              id="contactPhone"
              value={booking.contactPerson.phone}
              onChange={(e) => updateNestedField("contactPerson", "phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Organization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={booking.organization.name}
              onChange={(e) => updateNestedField("organization", "name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="orgType">Organization Type</Label>
            <Select 
              value={booking.organization.type} 
              onValueChange={(value) => updateNestedField("organization", "type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Client</SelectItem>
                <SelectItem value="travel_agency">Travel Agency</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="event_planner">Event Planner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="orgAddress">Address</Label>
            <Textarea
              id="orgAddress"
              value={booking.organization.address}
              onChange={(e) => updateNestedField("organization", "address", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Dates & Flexibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="checkIn">Check-in Date *</Label>
            <Input
              id="checkIn"
              type="date"
              value={booking.dates.checkIn}
              onChange={(e) => updateNestedField("dates", "checkIn", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="checkOut">Check-out Date *</Label>
            <Input
              id="checkOut"
              type="date"
              value={booking.dates.checkOut}
              onChange={(e) => updateNestedField("dates", "checkOut", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="flexibility">Date Flexibility (days)</Label>
            <Input
              id="flexibility"
              type="number"
              min="0"
              max="30"
              value={booking.dates.flexibility}
              onChange={(e) => updateNestedField("dates", "flexibility", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Room Requirements</h3>
        <div className="mb-4">
          <Label htmlFor="totalGuests">Total Guests *</Label>
          <Input
            id="totalGuests"
            type="number"
            min="1"
            value={booking.requirements.totalGuests}
            onChange={(e) => updateNestedField("requirements", "totalGuests", parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Room Breakdown</h4>
            <Button type="button" variant="outline" size="sm" onClick={addRoom}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room Type
            </Button>
          </div>

          {booking.requirements.rooms.map((room, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Room Type</Label>
                    <Select 
                      value={room.roomType} 
                      onValueChange={(value) => updateRoom(index, "roomType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="presidential">Presidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={room.quantity}
                      onChange={(e) => updateRoom(index, "quantity", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Occupancy per Room</Label>
                    <Input
                      type="number"
                      min="1"
                      max="4"
                      value={room.occupancy}
                      onChange={(e) => updateRoom(index, "occupancy", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    {booking.requirements.rooms.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeRoom(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="budgetMin">Budget Range (per night)</Label>
            <div className="flex gap-2">
              <Input
                id="budgetMin"
                type="number"
                placeholder="Min"
                value={booking.requirements.budgetRange.min}
                onChange={(e) => setBooking(prev => ({
          ...prev,
          requirements: {
            ...prev.requirements,
            budgetRange: {
              ...prev.requirements.budgetRange,
              min: parseInt(e.target.value)
            }
          }
        }))} />
              <Input
                type="number"
                placeholder="Max"
                value={booking.requirements.budgetRange.max}
                onChange={(e) => setBooking(prev => ({
                  ...prev,
                  requirements: {
                    ...prev.requirements,
                    budgetRange: {
                      ...prev.requirements.budgetRange,
                      max: parseInt(e.target.value)
                    }
                  }
                }))}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea
            id="specialRequests"
            value={booking.requirements.specialRequests}
            onChange={(e) => updateNestedField("requirements", "specialRequests", e.target.value)}
            placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(booking.services).map(([service, enabled]) => (
            <div key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={service}
                checked={enabled}
                onChange={(e) => updateNestedField("services", service, e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={service} className="capitalize">
                {service.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="deposit">Deposit Percentage</Label>
            <Input
              id="deposit"
              type="number"
              min="0"
              max="100"
              value={booking.paymentTerms.depositPercentage}
              onChange={(e) => updateNestedField("paymentTerms", "depositPercentage", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="paymentSchedule">Payment Schedule</Label>
            <Select 
              value={booking.paymentTerms.paymentSchedule} 
              onValueChange={(value) => updateNestedField("paymentTerms", "paymentSchedule", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="30_days">Net 30 Days</SelectItem>
                <SelectItem value="60_days">Net 60 Days</SelectItem>
                <SelectItem value="custom">Custom Terms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Group Name:</span>
                <span className="font-medium">{booking.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Guests:</span>
                <span className="font-medium">{booking.requirements.totalGuests}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Rooms:</span>
                <span className="font-medium">
                  {booking.requirements.rooms.reduce((sum, room) => sum + room.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span className="font-medium">{booking.dates.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span className="font-medium">{booking.dates.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget Range:</span>
                <span className="font-medium">
                  ${booking.requirements.budgetRange.min} - ${booking.requirements.budgetRange.max} per night
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSubmit(booking);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Group Booking Request</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Step {step} of 3: {step === 1 ? "Group & Contact Info" : step === 2 ? "Requirements" : "Services & Summary"}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            <Clock className="h-4 w-4 mr-1" />
            Draft
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex justify-between pt-6">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <FileText className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
