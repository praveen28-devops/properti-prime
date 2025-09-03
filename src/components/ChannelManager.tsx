import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  Settings, 
  Wifi, 
  WifiOff, 
  Calendar, 
  Users, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  type: "ota" | "gds" | "metasearch" | "direct";
  logo: string;
  isConnected: boolean;
  isActive: boolean;
  commission: number;
  lastSync: string;
  bookingsToday: number;
  revenue: number;
  settings: {
    minimumStay: number;
    maximumStay: number;
    closeDays: string[];
    cancellationPolicy: string;
    rateModifier: number;
    inventoryAllocation: number;
  };
}

interface ChannelManagerProps {
  propertyId: string;
  propertyTitle: string;
}

export const ChannelManager = ({ propertyId, propertyTitle }: ChannelManagerProps) => {
  const [channels] = useState<Channel[]>([
    {
      id: "booking-com",
      name: "Booking.com",
      type: "ota",
      logo: "https://logos-world.net/wp-content/uploads/2021/08/Booking-Logo.png",
      isConnected: true,
      isActive: true,
      commission: 15,
      lastSync: "2024-03-03T14:30:00Z",
      bookingsToday: 12,
      revenue: 3240,
      settings: {
        minimumStay: 1,
        maximumStay: 30,
        closeDays: [],
        cancellationPolicy: "flexible",
        rateModifier: 1.0,
        inventoryAllocation: 80
      }
    },
    {
      id: "expedia",
      name: "Expedia",
      type: "ota",
      logo: "https://logos-world.net/wp-content/uploads/2021/02/Expedia-Logo.png",
      isConnected: true,
      isActive: true,
      commission: 18,
      lastSync: "2024-03-03T14:25:00Z",
      bookingsToday: 8,
      revenue: 2160,
      settings: {
        minimumStay: 2,
        maximumStay: 21,
        closeDays: ["2024-12-25", "2024-12-31"],
        cancellationPolicy: "moderate",
        rateModifier: 1.05,
        inventoryAllocation: 70
      }
    },
    {
      id: "amadeus",
      name: "Amadeus GDS",
      type: "gds",
      logo: "https://amadeus.com/images/logo.png",
      isConnected: false,
      isActive: false,
      commission: 10,
      lastSync: "",
      bookingsToday: 0,
      revenue: 0,
      settings: {
        minimumStay: 1,
        maximumStay: 14,
        closeDays: [],
        cancellationPolicy: "strict",
        rateModifier: 0.95,
        inventoryAllocation: 50
      }
    },
    {
      id: "agoda",
      name: "Agoda",
      type: "ota",
      logo: "https://logos-world.net/wp-content/uploads/2021/02/Agoda-Logo.png",
      isConnected: true,
      isActive: false,
      commission: 16,
      lastSync: "2024-03-03T13:45:00Z",
      bookingsToday: 0,
      revenue: 0,
      settings: {
        minimumStay: 1,
        maximumStay: 28,
        closeDays: [],
        cancellationPolicy: "flexible",
        rateModifier: 1.02,
        inventoryAllocation: 60
      }
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const getChannelTypeColor = (type: string) => {
    const colors = {
      ota: "bg-blue-500",
      gds: "bg-purple-500",
      metasearch: "bg-green-500",
      direct: "bg-orange-500"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const getConnectionStatus = (channel: Channel) => {
    if (!channel.isConnected) return { icon: WifiOff, color: "text-red-500", text: "Disconnected" };
    if (!channel.isActive) return { icon: Clock, color: "text-yellow-500", text: "Inactive" };
    return { icon: CheckCircle, color: "text-green-500", text: "Active" };
  };

  const formatLastSync = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const totalBookings = channels.reduce((sum, channel) => sum + channel.bookingsToday, 0);
  const totalRevenue = channels.reduce((sum, channel) => sum + channel.revenue, 0);
  const activeChannels = channels.filter(channel => channel.isConnected && channel.isActive).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Channel Manager</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage distribution channels for {propertyTitle}
                </p>
              </div>
            </div>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Global Settings
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
                    <p className="text-sm text-muted-foreground">Active Channels</p>
                    <p className="text-2xl font-bold">{activeChannels}</p>
                  </div>
                  <Wifi className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Bookings</p>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Commission</p>
                    <p className="text-2xl font-bold">
                      {Math.round(channels.reduce((sum, ch) => sum + ch.commission, 0) / channels.length)}%
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {channels.map((channel) => {
              const status = getConnectionStatus(channel);
              const StatusIcon = status.icon;

              return (
                <Card key={channel.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg p-2 border">
                          <img 
                            src={channel.logo} 
                            alt={channel.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{channel.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-white ${getChannelTypeColor(channel.type)}`}
                            >
                              {channel.type.toUpperCase()}
                            </Badge>
                            <div className={`flex items-center gap-1 text-sm ${status.color}`}>
                              <StatusIcon className="h-4 w-4" />
                              <span>{status.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={channel.isActive && channel.isConnected}
                        disabled={!channel.isConnected}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Commission</p>
                        <p className="font-semibold">{channel.commission}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Sync</p>
                        <p className="font-semibold">{formatLastSync(channel.lastSync)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Today's Bookings</p>
                        <p className="font-semibold">{channel.bookingsToday}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-semibold">${channel.revenue.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {channel.isConnected ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedChannel(channel)}
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          className="flex-1"
                        >
                          <Wifi className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Channel Configuration Modal */}
      {selectedChannel && (
        <Card>
          <CardHeader>
            <CardTitle>Channel Settings - {selectedChannel.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minStay">Minimum Stay (nights)</Label>
                  <Input 
                    id="minStay"
                    type="number" 
                    value={selectedChannel.settings.minimumStay}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxStay">Maximum Stay (nights)</Label>
                  <Input 
                    id="maxStay"
                    type="number" 
                    value={selectedChannel.settings.maximumStay}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="rateModifier">Rate Modifier</Label>
                  <Input 
                    id="rateModifier"
                    type="number" 
                    step="0.01"
                    value={selectedChannel.settings.rateModifier}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="inventory">Inventory Allocation (%)</Label>
                  <Input 
                    id="inventory"
                    type="number" 
                    value={selectedChannel.settings.inventoryAllocation}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="cancellation">Cancellation Policy</Label>
                  <Select value={selectedChannel.settings.cancellationPolicy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                      <SelectItem value="super_strict">Super Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label>Close Days</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Select dates when this channel should be closed for bookings
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedChannel.settings.closeDays.map((date, index) => (
                  <Badge key={index} variant="secondary">
                    {new Date(date).toLocaleDateString()}
                    <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0">
                      ×
                    </Button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Close Day
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedChannel(null)}>
                Cancel
              </Button>
              <Button>
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
