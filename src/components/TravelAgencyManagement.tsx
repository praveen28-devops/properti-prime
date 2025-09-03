import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin,
  Plus,
  Edit,
  Eye,
  Star,
  Calendar,
  FileText,
  Search
} from "lucide-react";

interface TravelAgency {
  id: string;
  name: string;
  type: "retail" | "online" | "corporate" | "wholesale";
  status: "active" | "inactive" | "pending" | "suspended";
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
  };
  businessInfo: {
    registrationNumber: string;
    taxId: string;
    iataNumber?: string;
    establishedYear: number;
  };
  commissionStructure: {
    baseRate: number;
    tieredRates: Array<{
      threshold: number;
      rate: number;
    }>;
    paymentTerms: "immediate" | "net_15" | "net_30" | "net_45";
  };
  performance: {
    bookingsThisMonth: number;
    bookingsLastMonth: number;
    totalRevenue: number;
    averageBookingValue: number;
    cancellationRate: number;
  };
  preferences: {
    preferredRoomTypes: string[];
    specialRates: boolean;
    exclusiveDeals: boolean;
    marketingSupport: boolean;
  };
  contracts: Array<{
    id: string;
    type: "standard" | "preferred" | "exclusive";
    startDate: string;
    endDate: string;
    status: "active" | "expired" | "pending";
  }>;
  notes: string;
  createdAt: string;
  lastBooking: string;
}

export const TravelAgencyManagement = () => {
  const [agencies, setAgencies] = useState<TravelAgency[]>([
    {
      id: "ta-001",
      name: "Global Travel Solutions",
      type: "corporate",
      status: "active",
      contactInfo: {
        primaryContact: "Sarah Johnson",
        email: "sarah@globaltravelsolutions.com",
        phone: "+1-555-0123",
        address: "123 Business Ave, New York, NY 10001",
        website: "www.globaltravelsolutions.com"
      },
      businessInfo: {
        registrationNumber: "GTS-2019-001",
        taxId: "12-3456789",
        iataNumber: "12345678",
        establishedYear: 2019
      },
      commissionStructure: {
        baseRate: 12,
        tieredRates: [
          { threshold: 50000, rate: 14 },
          { threshold: 100000, rate: 16 }
        ],
        paymentTerms: "net_30"
      },
      performance: {
        bookingsThisMonth: 45,
        bookingsLastMonth: 38,
        totalRevenue: 125000,
        averageBookingValue: 2780,
        cancellationRate: 8.5
      },
      preferences: {
        preferredRoomTypes: ["suite", "deluxe"],
        specialRates: true,
        exclusiveDeals: true,
        marketingSupport: true
      },
      contracts: [
        {
          id: "contract-001",
          type: "preferred",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          status: "active"
        }
      ],
      notes: "High-volume corporate client with excellent payment history.",
      createdAt: "2024-01-15",
      lastBooking: "2024-03-02"
    },
    {
      id: "ta-002",
      name: "Premium Events & Travel",
      type: "retail",
      status: "active",
      contactInfo: {
        primaryContact: "Michael Chen",
        email: "michael@premiumtravel.com",
        phone: "+1-555-0456",
        address: "456 Event Plaza, Los Angeles, CA 90210",
        website: "www.premiumtravel.com"
      },
      businessInfo: {
        registrationNumber: "PET-2020-002",
        taxId: "98-7654321",
        establishedYear: 2020
      },
      commissionStructure: {
        baseRate: 15,
        tieredRates: [
          { threshold: 25000, rate: 17 },
          { threshold: 75000, rate: 19 }
        ],
        paymentTerms: "net_15"
      },
      performance: {
        bookingsThisMonth: 28,
        bookingsLastMonth: 32,
        totalRevenue: 89000,
        averageBookingValue: 3180,
        cancellationRate: 12.3
      },
      preferences: {
        preferredRoomTypes: ["suite", "presidential"],
        specialRates: true,
        exclusiveDeals: false,
        marketingSupport: true
      },
      contracts: [
        {
          id: "contract-002",
          type: "standard",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          status: "active"
        }
      ],
      notes: "Specializes in luxury events and high-end travel packages.",
      createdAt: "2024-02-01",
      lastBooking: "2024-03-01"
    }
  ]);

  const [selectedAgency, setSelectedAgency] = useState<TravelAgency | null>(null);
  const [isAddingAgency, setIsAddingAgency] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.contactInfo.primaryContact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || agency.status === filterStatus;
    const matchesType = filterType === "all" || agency.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      pending: "bg-yellow-500",
      suspended: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      retail: Building2,
      online: Users,
      corporate: Building2,
      wholesale: TrendingUp
    };
    return icons[type as keyof typeof icons] || Building2;
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const totalAgencies = agencies.length;
  const activeAgencies = agencies.filter(a => a.status === "active").length;
  const totalBookings = agencies.reduce((sum, a) => sum + a.performance.bookingsThisMonth, 0);
  const totalRevenue = agencies.reduce((sum, a) => sum + a.performance.totalRevenue, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Travel Agency Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage travel agency partnerships and commissions
                </p>
              </div>
            </div>
            <Button onClick={() => setIsAddingAgency(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Agency
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Agencies</p>
                    <p className="text-2xl font-bold">{totalAgencies}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Agencies</p>
                    <p className="text-2xl font-bold">{activeAgencies}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Bookings</p>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agency List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgencies.map((agency) => {
              const TypeIcon = getTypeIcon(agency.type);
              const bookingGrowth = calculateGrowth(
                agency.performance.bookingsThisMonth,
                agency.performance.bookingsLastMonth
              );

              return (
                <Card key={agency.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TypeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{agency.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-white ${getStatusColor(agency.status)}`}
                            >
                              {agency.status.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary">
                              {agency.type.toUpperCase()}
                            </Badge>
                            {agency.preferences.specialRates && (
                              <Badge variant="outline">
                                <Star className="h-3 w-3 mr-1" />
                                Preferred
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{agency.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{agency.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{agency.contactInfo.primaryContact}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <p className="font-semibold">{agency.commissionStructure.baseRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Terms</p>
                        <p className="font-semibold">
                          {agency.commissionStructure.paymentTerms.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Bookings</p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{agency.performance.bookingsThisMonth}</p>
                          {bookingGrowth !== 0 && (
                            <Badge 
                              variant={bookingGrowth > 0 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {bookingGrowth > 0 ? '+' : ''}{bookingGrowth.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="font-semibold">${agency.performance.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAgency(agency)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Contract
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Agency Details Modal */}
      {selectedAgency && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedAgency.name} - Details</CardTitle>
              <Button variant="outline" onClick={() => setSelectedAgency(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Primary Contact:</strong> {selectedAgency.contactInfo.primaryContact}</div>
                  <div><strong>Email:</strong> {selectedAgency.contactInfo.email}</div>
                  <div><strong>Phone:</strong> {selectedAgency.contactInfo.phone}</div>
                  <div><strong>Address:</strong> {selectedAgency.contactInfo.address}</div>
                  {selectedAgency.contactInfo.website && (
                    <div><strong>Website:</strong> {selectedAgency.contactInfo.website}</div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Business Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Registration:</strong> {selectedAgency.businessInfo.registrationNumber}</div>
                  <div><strong>Tax ID:</strong> {selectedAgency.businessInfo.taxId}</div>
                  {selectedAgency.businessInfo.iataNumber && (
                    <div><strong>IATA Number:</strong> {selectedAgency.businessInfo.iataNumber}</div>
                  )}
                  <div><strong>Established:</strong> {selectedAgency.businessInfo.establishedYear}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Commission Structure</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Base Rate:</strong> {selectedAgency.commissionStructure.baseRate}%</div>
                  <div><strong>Payment Terms:</strong> {selectedAgency.commissionStructure.paymentTerms}</div>
                  {selectedAgency.commissionStructure.tieredRates.length > 0 && (
                    <div>
                      <strong>Tiered Rates:</strong>
                      <ul className="ml-4 mt-1">
                        {selectedAgency.commissionStructure.tieredRates.map((tier, index) => (
                          <li key={index}>
                            ${tier.threshold.toLocaleString()}+ → {tier.rate}%
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>This Month:</strong> {selectedAgency.performance.bookingsThisMonth} bookings</div>
                  <div><strong>Last Month:</strong> {selectedAgency.performance.bookingsLastMonth} bookings</div>
                  <div><strong>Average Booking:</strong> ${selectedAgency.performance.averageBookingValue.toLocaleString()}</div>
                  <div><strong>Cancellation Rate:</strong> {selectedAgency.performance.cancellationRate}%</div>
                </div>
              </div>
            </div>

            {selectedAgency.notes && (
              <div>
                <h4 className="font-semibold mb-3">Notes</h4>
                <p className="text-sm text-muted-foreground">{selectedAgency.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
