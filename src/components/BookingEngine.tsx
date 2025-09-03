import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, CreditCard, Clock } from "lucide-react";

export interface Reservation {
  id: string;
  propertyId: string;
  roomId: string;
  ratePlanId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingEngineProps {
  propertyId: string;
  propertyTitle: string;
}

export const BookingEngine = ({ propertyId, propertyTitle }: BookingEngineProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateStayDuration = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const baseRate = 150; // Mock base rate
    const nights = calculateStayDuration();
    return baseRate * nights;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reservationData = {
      propertyId: propertyId,
      roomId: "room-1", // Mock room ID
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      guestPhone: formData.guestPhone,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      adults: formData.adults,
      children: formData.children,
      totalAmount: calculateTotal(),
      currency: "USD",
      specialRequests: formData.specialRequests,
      paymentMethod: formData.paymentMethod,
    };

    console.log('Booking submitted:', reservationData);
    alert('Booking submitted successfully!');
    resetForm();
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      specialRequests: "",
      paymentMethod: "credit_card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
    });
  };

  const nights = calculateStayDuration();
  const totalAmount = calculateTotal();

  return (
    <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Book Your Stay</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {propertyTitle} - Available Rooms
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step {step} of 3</Badge>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  ×
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Dates and Guests */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select Dates & Guests</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">Check-in Date *</Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="checkOut">Check-out Date *</Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) => handleInputChange('checkOut', e.target.value)}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adults">Adults *</Label>
                        <Select
                          value={formData.adults.toString()}
                          onValueChange={(value) => handleInputChange('adults', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Adult{num !== 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="children">Children</Label>
                        <Select
                          value={formData.children.toString()}
                          onValueChange={(value) => handleInputChange('children', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Child' : 'Children'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    {nights > 0 && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3">Booking Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Room Rate:</span>
                              <span>$150/night</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Guests:</span>
                              <span>{formData.adults + formData.children} total</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <span>Total Amount:</span>
                              <span>${totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setStep(2)}
                      disabled={!formData.checkIn || !formData.checkOut || nights <= 0}
                    >
                      Continue to Guest Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Guest Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Full Name *</Label>
                        <Input
                          id="guestName"
                          value={formData.guestName}
                          onChange={(e) => handleInputChange('guestName', e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestPhone">Phone Number *</Label>
                        <Input
                          id="guestPhone"
                          type="tel"
                          value={formData.guestPhone}
                          onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestEmail">Email Address *</Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        value={formData.guestEmail}
                        onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        placeholder="Any special requests or preferences..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back to Dates
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setStep(3)}
                      disabled={!formData.guestName || !formData.guestEmail || !formData.guestPhone}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.paymentMethod.includes('card') && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="billingAddress">Billing Address *</Label>
                          <Textarea
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                            placeholder="Enter billing address"
                            rows={2}
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* Final Booking Summary */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Final Booking Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Property:</span>
                            <span>{propertyTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Room:</span>
                            <span>Room 101 (Standard)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dates:</span>
                            <span>{formData.checkIn} to {formData.checkOut}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Guests:</span>
                            <span>{formData.adults} adults, {formData.children} children</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back to Guest Info
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Complete Booking
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
    </Card>
  );
};
