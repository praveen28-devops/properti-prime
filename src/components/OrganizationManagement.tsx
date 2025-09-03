import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  MapPin,
  Star,
  TrendingUp
} from "lucide-react";

export interface Organization {
  id: string;
  name: string;
  description: string;
  type: "hotel_chain" | "independent" | "management_company" | "franchise";
  address: string;
  phone: string;
  email: string;
  website?: string;
  properties: string[];
  users: string[];
  isActive: boolean;
  createdAt: string;
  settings: {
    currency: string;
    timezone: string;
    language: string;
    features: string[];
  };
}

interface OrganizationCardProps {
  organization: Organization;
  onEdit?: (organization: Organization) => void;
  onDelete?: (organization: Organization) => void;
  onViewProperties?: (organization: Organization) => void;
}

const OrganizationCard = ({ organization, onEdit, onDelete, onViewProperties }: OrganizationCardProps) => {
  const getTypeColor = (type: string) => {
    const colors = {
      hotel_chain: "bg-purple-500",
      independent: "bg-blue-500",
      management_company: "bg-green-500",
      franchise: "bg-orange-500"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      hotel_chain: "Hotel Chain",
      independent: "Independent",
      management_company: "Management Company",
      franchise: "Franchise"
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card className="group bg-card-gradient shadow-card hover:shadow-elevated transition-smooth border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-card-foreground">
              {organization.name}
            </h3>
            <Badge 
              variant="outline" 
              className={`text-white ${getTypeColor(organization.type)}`}
            >
              {getTypeLabel(organization.type)}
            </Badge>
          </div>
          <Badge 
            variant={organization.isActive ? "default" : "secondary"}
            className={organization.isActive ? "bg-green-500" : "bg-gray-500"}
          >
            {organization.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {organization.description && (
          <p className="text-sm text-muted-foreground">
            {organization.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Properties</p>
              <p className="text-muted-foreground">{organization.properties.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Users</p>
              <p className="text-muted-foreground">{organization.users.length}</p>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">Location</p>
          </div>
          <p className="text-muted-foreground">{organization.address}</p>
        </div>

        <div className="text-sm">
          <p className="font-medium mb-2">Features ({organization.settings.features.length})</p>
          <div className="flex flex-wrap gap-1">
            {organization.settings.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature.replace('_', ' ')}
              </Badge>
            ))}
            {organization.settings.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{organization.settings.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onViewProperties && (
            <Button 
              onClick={() => onViewProperties(organization)}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Building2 className="h-4 w-4 mr-2" />
              View Properties
            </Button>
          )}
          {onEdit && (
            <Button 
              onClick={() => onEdit(organization)}
              size="sm"
              variant="outline"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(organization)}
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

export const OrganizationManagement = () => {
  const [organizations] = useState<Organization[]>([
    {
      id: "1",
      name: "PropertyPrime Hotels",
      description: "Premium hotel chain with luxury accommodations",
      type: "hotel_chain",
      address: "123 Business Ave, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "info@propertyprime.com",
      website: "https://propertyprime.com",
      properties: ["prop1", "prop2", "prop3"],
      users: ["user1", "user2", "user3", "user4"],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      settings: {
        currency: "USD",
        timezone: "America/New_York",
        language: "en",
        features: ["multi_property", "advanced_reporting", "channel_manager", "revenue_management"]
      }
    },
    {
      id: "2",
      name: "Boutique Stays",
      description: "Independent boutique hotel collection",
      type: "independent",
      address: "456 Hotel Street, San Francisco, CA 94102",
      phone: "+1 (555) 987-6543",
      email: "hello@boutiquestays.com",
      properties: ["prop4", "prop5"],
      users: ["user5", "user6"],
      isActive: true,
      createdAt: "2024-01-15T00:00:00Z",
      settings: {
        currency: "USD",
        timezone: "America/Los_Angeles",
        language: "en",
        features: ["basic_reporting", "online_booking"]
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || org.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && org.isActive) ||
                         (statusFilter === "inactive" && !org.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEditOrganization = (organization: Organization) => {
    console.log('Edit organization:', organization);
    // TODO: Implement edit organization functionality
  };

  const handleDeleteOrganization = (organization: Organization) => {
    if (window.confirm(`Are you sure you want to delete organization ${organization.name}?`)) {
      console.log('Delete organization:', organization);
      // TODO: Implement delete organization functionality
    }
  };

  const handleViewProperties = (organization: Organization) => {
    console.log('View properties for organization:', organization);
    // TODO: Implement view properties functionality
  };

  const totalProperties = organizations.reduce((sum, org) => sum + org.properties.length, 0);
  const totalUsers = organizations.reduce((sum, org) => sum + org.users.length, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Organizations</p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold">{totalProperties}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((organizations.filter(o => o.isActive).length / organizations.length) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Organization Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage multi-property organizations and their settings
                </p>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Organization Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hotel_chain">Hotel Chain</SelectItem>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="management_company">Management Company</SelectItem>
                  <SelectItem value="franchise">Franchise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Organizations Grid */}
          {filteredOrganizations.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOrganizations.map((organization) => (
                  <OrganizationCard
                    key={organization.id}
                    organization={organization}
                    onEdit={handleEditOrganization}
                    onDelete={handleDeleteOrganization}
                    onViewProperties={handleViewProperties}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Organizations Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                    ? "No organizations match your current filters. Try adjusting your search criteria."
                    : "No organizations have been created yet. Create your first organization to get started."
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
