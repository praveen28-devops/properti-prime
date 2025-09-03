import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { X, Calendar, DollarSign } from "lucide-react";

interface AddRatePlanFormProps {
  propertyId: string;
  roomId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (ratePlanData: any) => void;
}

export const AddRatePlanForm = ({ propertyId, roomId, isOpen, onClose, onSubmit }: AddRatePlanFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseRate: 100,
    currency: "USD",
    rateType: "nightly" as const,
    seasonType: "standard" as const,
    validFrom: "",
    validTo: "",
    minimumStay: 1,
    maximumStay: "",
    advanceBookingDays: 0,
    cancellationPolicy: "flexible" as const,
    isActive: true,
    // Restrictions
    weekendSurcharge: "",
    minimumOccupancy: "",
    maximumOccupancy: "",
    // Discounts
    earlyBirdDiscount: "",
    lastMinuteDiscount: "",
    extendedStayDiscount: "",
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ratePlanData = {
      propertyId,
      roomId,
      name: formData.name,
      description: formData.description,
      baseRate: formData.baseRate,
      currency: formData.currency,
      rateType: formData.rateType,
      seasonType: formData.seasonType,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      minimumStay: formData.minimumStay,
      maximumStay: formData.maximumStay ? parseInt(formData.maximumStay) : undefined,
      advanceBookingDays: formData.advanceBookingDays,
      cancellationPolicy: formData.cancellationPolicy,
      isActive: formData.isActive,
      restrictions: {
        weekendSurcharge: formData.weekendSurcharge ? parseFloat(formData.weekendSurcharge) : undefined,
        minimumOccupancy: formData.minimumOccupancy ? parseInt(formData.minimumOccupancy) : undefined,
        maximumOccupancy: formData.maximumOccupancy ? parseInt(formData.maximumOccupancy) : undefined,
      },
      discounts: {
        earlyBird: formData.earlyBirdDiscount ? parseFloat(formData.earlyBirdDiscount) : undefined,
        lastMinute: formData.lastMinuteDiscount ? parseFloat(formData.lastMinuteDiscount) : undefined,
        extendedStay: formData.extendedStayDiscount ? parseFloat(formData.extendedStayDiscount) : undefined,
      }
    };

    onSubmit?.(ratePlanData);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      baseRate: 100,
      currency: "USD",
      rateType: "nightly",
      seasonType: "standard",
      validFrom: "",
      validTo: "",
      minimumStay: 1,
      maximumStay: "",
      advanceBookingDays: 0,
      cancellationPolicy: "flexible",
      isActive: true,
      weekendSurcharge: "",
      minimumOccupancy: "",
      maximumOccupancy: "",
      earlyBirdDiscount: "",
      lastMinuteDiscount: "",
      extendedStayDiscount: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-primary" />
              <CardTitle>Create Rate Plan</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rate Plan Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Summer Special, Weekend Rate"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seasonType">Season Type *</Label>
                    <Select
                      value={formData.seasonType}
                      onValueChange={(value) => handleInputChange('seasonType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="peak">Peak Season</SelectItem>
                        <SelectItem value="off-peak">Off-Peak</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe this rate plan and its benefits"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseRate">Base Rate *</Label>
                    <Input
                      id="baseRate"
                      type="number"
                      value={formData.baseRate}
                      onChange={(e) => handleInputChange('baseRate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleInputChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rateType">Rate Type</Label>
                    <Select
                      value={formData.rateType}
                      onValueChange={(value) => handleInputChange('rateType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nightly">Per Night</SelectItem>
                        <SelectItem value="weekly">Per Week</SelectItem>
                        <SelectItem value="monthly">Per Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekendSurcharge">Weekend Surcharge (optional)</Label>
                  <Input
                    id="weekendSurcharge"
                    type="number"
                    value={formData.weekendSurcharge}
                    onChange={(e) => handleInputChange('weekendSurcharge', e.target.value)}
                    placeholder="Additional charge for weekends"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <Separator />

              {/* Validity Period */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Validity Period
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Valid From *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => handleInputChange('validFrom', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validTo">Valid To *</Label>
                    <Input
                      id="validTo"
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => handleInputChange('validTo', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stay Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Stay Requirements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumStay">Minimum Stay (nights) *</Label>
                    <Input
                      id="minimumStay"
                      type="number"
                      value={formData.minimumStay}
                      onChange={(e) => handleInputChange('minimumStay', parseInt(e.target.value) || 1)}
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maximumStay">Maximum Stay (nights)</Label>
                    <Input
                      id="maximumStay"
                      type="number"
                      value={formData.maximumStay}
                      onChange={(e) => handleInputChange('maximumStay', e.target.value)}
                      placeholder="No limit if empty"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advanceBookingDays">Advance Booking (days)</Label>
                    <Input
                      id="advanceBookingDays"
                      type="number"
                      value={formData.advanceBookingDays}
                      onChange={(e) => handleInputChange('advanceBookingDays', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOccupancy">Minimum Occupancy</Label>
                    <Input
                      id="minimumOccupancy"
                      type="number"
                      value={formData.minimumOccupancy}
                      onChange={(e) => handleInputChange('minimumOccupancy', e.target.value)}
                      placeholder="Minimum guests required"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maximumOccupancy">Maximum Occupancy</Label>
                    <Input
                      id="maximumOccupancy"
                      type="number"
                      value={formData.maximumOccupancy}
                      onChange={(e) => handleInputChange('maximumOccupancy', e.target.value)}
                      placeholder="Maximum guests allowed"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Discounts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Discounts (%)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="earlyBirdDiscount">Early Bird Discount</Label>
                    <Input
                      id="earlyBirdDiscount"
                      type="number"
                      value={formData.earlyBirdDiscount}
                      onChange={(e) => handleInputChange('earlyBirdDiscount', e.target.value)}
                      placeholder="% off for early bookings"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastMinuteDiscount">Last Minute Discount</Label>
                    <Input
                      id="lastMinuteDiscount"
                      type="number"
                      value={formData.lastMinuteDiscount}
                      onChange={(e) => handleInputChange('lastMinuteDiscount', e.target.value)}
                      placeholder="% off for last minute bookings"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extendedStayDiscount">Extended Stay Discount</Label>
                    <Input
                      id="extendedStayDiscount"
                      type="number"
                      value={formData.extendedStayDiscount}
                      onChange={(e) => handleInputChange('extendedStayDiscount', e.target.value)}
                      placeholder="% off for long stays"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Policies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Policies</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                    <Select
                      value={formData.cancellationPolicy}
                      onValueChange={(value) => handleInputChange('cancellationPolicy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="strict">Strict</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active Rate Plan</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Create Rate Plan
                </Button>
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
