import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Edit, Trash2, TrendingUp, Users } from "lucide-react";

export interface RatePlan {
  id: string;
  propertyId: string;
  roomId?: string;
  name: string;
  description: string;
  baseRate: number;
  currency: string;
  rateType: "nightly" | "weekly" | "monthly";
  seasonType: "standard" | "peak" | "off-peak" | "holiday";
  validFrom: string;
  validTo: string;
  minimumStay: number;
  maximumStay?: number;
  advanceBookingDays: number;
  cancellationPolicy: "flexible" | "moderate" | "strict";
  isActive: boolean;
  restrictions: {
    weekendSurcharge?: number;
    minimumOccupancy?: number;
    maximumOccupancy?: number;
    blackoutDates?: string[];
  };
  discounts: {
    earlyBird?: number;
    lastMinute?: number;
    extendedStay?: number;
  };
}

interface RatePlanCardProps {
  ratePlan: RatePlan;
  onEdit?: (ratePlan: RatePlan) => void;
  onDelete?: (ratePlan: RatePlan) => void;
  onToggleActive?: (ratePlan: RatePlan) => void;
}

export const RatePlanCard = ({ ratePlan, onEdit, onDelete, onToggleActive }: RatePlanCardProps) => {
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeasonColor = (seasonType: string) => {
    const colors = {
      standard: "bg-blue-500",
      peak: "bg-red-500",
      "off-peak": "bg-green-500",
      holiday: "bg-purple-500"
    };
    return colors[seasonType as keyof typeof colors] || "bg-gray-500";
  };

  const getRateTypeLabel = (rateType: string) => {
    const labels = {
      nightly: "Per Night",
      weekly: "Per Week",
      monthly: "Per Month"
    };
    return labels[rateType as keyof typeof labels] || rateType;
  };

  return (
    <Card className={`group bg-card-gradient shadow-card hover:shadow-elevated transition-smooth border-border overflow-hidden animate-fade-in ${!ratePlan.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-card-foreground">
              {ratePlan.name}
            </h3>
            <Badge 
              variant="outline" 
              className={`text-white ${getSeasonColor(ratePlan.seasonType)}`}
            >
              {ratePlan.seasonType}
            </Badge>
          </div>
          <Badge 
            variant={ratePlan.isActive ? "default" : "secondary"}
            className={ratePlan.isActive ? "bg-green-500" : "bg-gray-500"}
          >
            {ratePlan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {ratePlan.description && (
          <p className="text-sm text-muted-foreground">
            {ratePlan.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-1 text-primary font-bold text-2xl">
          <DollarSign className="h-6 w-6" />
          <span>{formatPrice(ratePlan.baseRate, ratePlan.currency)}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {getRateTypeLabel(ratePlan.rateType)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Valid Period</p>
              <p className="text-muted-foreground">
                {formatDate(ratePlan.validFrom)} - {formatDate(ratePlan.validTo)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Stay Requirements</p>
              <p className="text-muted-foreground">
                {ratePlan.minimumStay} night{ratePlan.minimumStay !== 1 ? 's' : ''} min
                {ratePlan.maximumStay && `, ${ratePlan.maximumStay} max`}
              </p>
            </div>
          </div>
        </div>

        {/* Discounts */}
        {(ratePlan.discounts.earlyBird || ratePlan.discounts.lastMinute || ratePlan.discounts.extendedStay) && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Available Discounts:</p>
            <div className="flex flex-wrap gap-1">
              {ratePlan.discounts.earlyBird && (
                <Badge variant="outline" className="text-xs">
                  Early Bird: {ratePlan.discounts.earlyBird}% off
                </Badge>
              )}
              {ratePlan.discounts.lastMinute && (
                <Badge variant="outline" className="text-xs">
                  Last Minute: {ratePlan.discounts.lastMinute}% off
                </Badge>
              )}
              {ratePlan.discounts.extendedStay && (
                <Badge variant="outline" className="text-xs">
                  Extended Stay: {ratePlan.discounts.extendedStay}% off
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Restrictions */}
        {ratePlan.restrictions.weekendSurcharge && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <span className="text-muted-foreground">
              Weekend surcharge: {formatPrice(ratePlan.restrictions.weekendSurcharge, ratePlan.currency)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Cancellation: {ratePlan.cancellationPolicy}</span>
          <span>Book {ratePlan.advanceBookingDays} days ahead</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            onClick={() => onToggleActive?.(ratePlan)}
            className="flex-1"
            variant={ratePlan.isActive ? "outline" : "default"}
          >
            {ratePlan.isActive ? "Deactivate" : "Activate"}
          </Button>
          {onEdit && (
            <Button 
              onClick={() => onEdit(ratePlan)}
              size="sm"
              variant="outline"
              className="px-3"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(ratePlan)}
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
