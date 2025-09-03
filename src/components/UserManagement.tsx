import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX
} from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "manager" | "staff" | "guest";
  organizationId: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: "property" | "room" | "reservation" | "rate" | "report" | "user" | "system";
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
}

const UserCard = ({ user, onEdit, onDelete, onToggleStatus }: UserCardProps) => {
  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: "bg-red-500",
      admin: "bg-purple-500",
      manager: "bg-blue-500",
      staff: "bg-green-500",
      guest: "bg-gray-500"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500";
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Administrator",
      manager: "Manager",
      staff: "Staff",
      guest: "Guest"
    };
    return labels[role as keyof typeof labels] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`group bg-card-gradient shadow-card hover:shadow-elevated transition-smooth border-border overflow-hidden ${!user.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-card-foreground">
              {user.name}
            </h3>
            <Badge 
              variant="outline" 
              className={`text-white ${getRoleColor(user.role)}`}
            >
              {getRoleLabel(user.role)}
            </Badge>
          </div>
          <Badge 
            variant={user.isActive ? "default" : "secondary"}
            className={user.isActive ? "bg-green-500" : "bg-red-500"}
          >
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Created</p>
            <p className="text-muted-foreground">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="font-medium">Last Login</p>
            <p className="text-muted-foreground">
              {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium mb-2">Permissions ({user.permissions.length})</p>
          <div className="flex flex-wrap gap-1">
            {user.permissions.slice(0, 3).map((permission, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {permission.replace('_', ' ')}
              </Badge>
            ))}
            {user.permissions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.permissions.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onToggleStatus?.(user)}
            size="sm"
            variant={user.isActive ? "outline" : "default"}
            className="flex-1"
          >
            {user.isActive ? (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          {onEdit && (
            <Button 
              onClick={() => onEdit(user)}
              size="sm"
              variant="outline"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && user.role !== 'super_admin' && (
            <Button 
              onClick={() => onDelete(user)}
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

interface UserManagementProps {
  organizationId: string;
}

export const UserManagement = ({ organizationId }: UserManagementProps) => {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      organizationId,
      isActive: true,
      permissions: ["property_manage", "room_manage", "reservation_view", "rate_manage"],
      createdAt: "2024-01-15T10:00:00Z",
      lastLogin: "2024-03-01T14:30:00Z"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      organizationId,
      isActive: true,
      permissions: ["reservation_manage", "room_view", "report_view"],
      createdAt: "2024-02-01T09:00:00Z",
      lastLogin: "2024-03-02T11:15:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.isActive) ||
                         (statusFilter === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // TODO: Implement edit user functionality
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      console.log('Delete user:', user);
      // TODO: Implement delete user functionality
    }
  };

  const handleToggleUserStatus = (user: User) => {
    console.log('Toggle user status:', user);
    // TODO: Implement toggle user status functionality
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage users and their access permissions
                </p>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
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

          {/* Users Grid */}
          {filteredUsers.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    onToggleStatus={handleToggleUserStatus}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Users Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || roleFilter !== "all" || statusFilter !== "all" 
                    ? "No users match your current filters. Try adjusting your search criteria."
                    : "No users have been added to this organization yet."
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Role Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure roles and permissions
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Administrator", users: 2, permissions: 15, color: "bg-purple-500" },
              { name: "Manager", users: 5, permissions: 10, color: "bg-blue-500" },
              { name: "Staff", users: 12, permissions: 6, color: "bg-green-500" },
              { name: "Guest", users: 8, permissions: 2, color: "bg-gray-500" }
            ].map((role) => (
              <Card key={role.name} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${role.color} text-white`}>
                      {role.name}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span className="font-medium">{role.users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Permissions:</span>
                      <span className="font-medium">{role.permissions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
