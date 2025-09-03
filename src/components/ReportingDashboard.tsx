import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Percent,
  Download,
  RefreshCw
} from "lucide-react";

interface ReportMetrics {
  totalRevenue: number;
  totalReservations: number;
  occupancyRate: number;
  averageRate: number;
  totalGuests: number;
  cancellationRate: number;
  revenueGrowth: number;
  bookingGrowth: number;
}

interface ReportingDashboardProps {
  propertyId: string;
  propertyTitle: string;
}

export const ReportingDashboard = ({ propertyId, propertyTitle }: ReportingDashboardProps) => {
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  // Mock data - would be fetched from API
  const metrics: ReportMetrics = {
    totalRevenue: 45678.90,
    totalReservations: 127,
    occupancyRate: 78.5,
    averageRate: 185.50,
    totalGuests: 284,
    cancellationRate: 12.3,
    revenueGrowth: 15.2,
    bookingGrowth: 8.7
  };

  const monthlyData = [
    { month: "Jan", revenue: 32000, bookings: 89, occupancy: 72 },
    { month: "Feb", revenue: 38000, bookings: 95, occupancy: 75 },
    { month: "Mar", revenue: 42000, bookings: 108, occupancy: 82 },
    { month: "Apr", revenue: 45000, bookings: 127, occupancy: 78 },
    { month: "May", revenue: 48000, bookings: 134, occupancy: 85 },
    { month: "Jun", revenue: 52000, bookings: 142, occupancy: 88 }
  ];

  const topRooms = [
    { roomNumber: "101", revenue: 8500, bookings: 24, occupancy: 95 },
    { roomNumber: "205", revenue: 7200, bookings: 19, occupancy: 88 },
    { roomNumber: "312", revenue: 6800, bookings: 18, occupancy: 85 },
    { roomNumber: "408", revenue: 6200, bookings: 16, occupancy: 82 },
    { roomNumber: "501", revenue: 5900, bookings: 15, occupancy: 78 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? "↗" : "↘";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Analytics & Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Performance insights for {propertyTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                    <p className={`text-sm ${getGrowthColor(metrics.revenueGrowth)}`}>
                      {getGrowthIcon(metrics.revenueGrowth)} {formatPercent(metrics.revenueGrowth)} vs last period
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{metrics.totalReservations}</p>
                    <p className={`text-sm ${getGrowthColor(metrics.bookingGrowth)}`}>
                      {getGrowthIcon(metrics.bookingGrowth)} {formatPercent(metrics.bookingGrowth)} vs last period
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                    <p className="text-2xl font-bold">{formatPercent(metrics.occupancyRate)}</p>
                    <p className="text-sm text-muted-foreground">
                      Avg Rate: {formatCurrency(metrics.averageRate)}
                    </p>
                  </div>
                  <Percent className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Guests</p>
                    <p className="text-2xl font-bold">{metrics.totalGuests}</p>
                    <p className="text-sm text-muted-foreground">
                      Cancellation: {formatPercent(metrics.cancellationRate)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 text-sm font-medium">{data.month}</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(data.revenue / 60000) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium w-20 text-right">
                        {formatCurrency(data.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Occupancy Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 text-sm font-medium">{data.month}</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${data.occupancy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium w-16 text-right">
                        {formatPercent(data.occupancy)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Rooms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRooms.map((room, index) => (
                  <div key={room.roomNumber} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="w-12 justify-center">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">Room {room.roomNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {room.bookings} bookings • {formatPercent(room.occupancy)} occupancy
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(room.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Revenue Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Occupancy Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Guest Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Performance Trends</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Financial Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Percent className="h-6 w-6" />
                  <span>Rate Analysis</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
