import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, DollarSign, Edit, Trash2 } from "lucide-react";

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  priceType: "rent" | "sale";
  propertyType: "apartment" | "house" | "condo" | "townhouse";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  imageUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
}

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

export const PropertyCard = ({ property, onViewDetails, onEdit, onDelete }: PropertyCardProps) => {
  const formatPrice = (price: number, type: "rent" | "sale") => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return type === "rent" ? `${formatted}/month` : formatted;
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="group bg-card-gradient shadow-card hover:shadow-elevated transition-smooth border-border overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={property.imageUrl || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground border-border">
            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            {property.priceType === "rent" ? "For Rent" : "For Sale"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{property.address}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-primary font-bold text-xl">
          <DollarSign className="h-5 w-5" />
          <span>{formatPrice(property.price, property.priceType)}</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.squareFeet.toLocaleString()} sqft</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {truncateDescription(property.description)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            onClick={() => onViewDetails(property)}
            className="flex-1"
            variant="default"
          >
            View Details
          </Button>
          {onEdit && (
            <Button 
              onClick={() => onEdit(property)}
              size="sm"
              variant="outline"
              className="px-3"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(property)}
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