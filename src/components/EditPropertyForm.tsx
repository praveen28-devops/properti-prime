import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProperty } from "@/hooks/useProperties";
import { Property } from "@/components/PropertyCard";
import { CreatePropertyRequest } from "@/services/api";

interface EditPropertyFormProps {
  property: Property;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditPropertyForm = ({ property, onSuccess, onCancel }: EditPropertyFormProps) => {
  const [formData, setFormData] = useState<CreatePropertyRequest>({
    title: property.title,
    price: property.price,
    location: property.address,
    type: property.propertyType as any,
    beds: property.bedrooms,
    baths: property.bathrooms,
    imageUrl: property.imageUrl || "",
    priceType: property.priceType,
    squareFeet: property.squareFeet,
    description: property.description,
    contactPhone: property.contactPhone || "",
    contactEmail: property.contactEmail || "",
  });

  const updatePropertyMutation = useUpdateProperty();

  const handleInputChange = (field: keyof CreatePropertyRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updatePropertyMutation.mutateAsync({
        id: property.id,
        data: formData
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter property title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter property location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beds">Bedrooms</Label>
              <Input
                id="beds"
                type="number"
                value={formData.beds}
                onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
                placeholder="Number of bedrooms"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baths">Bathrooms</Label>
              <Input
                id="baths"
                type="number"
                step="0.5"
                value={formData.baths}
                onChange={(e) => handleInputChange('baths', parseFloat(e.target.value) || 0)}
                placeholder="Number of bathrooms"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFeet">Square Feet</Label>
              <Input
                id="squareFeet"
                type="number"
                value={formData.squareFeet}
                onChange={(e) => handleInputChange('squareFeet', parseInt(e.target.value) || 0)}
                placeholder="Property size in sq ft"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceType">Price Type</Label>
              <Select
                value={formData.priceType}
                onValueChange={(value) => handleInputChange('priceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nightly">Nightly Rate</SelectItem>
                  <SelectItem value="rent">Monthly Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="Enter image URL"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter property description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter contact phone"
                type="tel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Enter contact email"
                type="email"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={updatePropertyMutation.isPending}
              className="flex-1"
            >
              {updatePropertyMutation.isPending ? "Updating..." : "Update Property"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
