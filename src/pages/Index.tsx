import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PropertyCard, Property } from "@/components/PropertyCard";
import { SearchFilters, FilterOptions } from "@/components/SearchFilters";
import { PropertyModal } from "@/components/PropertyModal";
import { AddPropertyForm } from "@/components/AddPropertyForm";
import { mockProperties } from "@/data/mockProperties";
import { Plus, Home } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    propertyType: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "any",
    bathrooms: "any",
  });

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Property type filter
      if (filters.propertyType !== "all" && property.propertyType !== filters.propertyType) {
        return false;
      }

      // Price filter
      if (filters.minPrice && property.price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms !== "any") {
        const minBedrooms = parseInt(filters.bedrooms);
        if (property.bedrooms < minBedrooms) return false;
      }

      // Bathrooms filter
      if (filters.bathrooms !== "any") {
        const minBathrooms = parseInt(filters.bathrooms);
        if (property.bathrooms < minBathrooms) return false;
      }

      return true;
    });
  }, [properties, filters]);

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handlePropertyAdded = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        
        <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Home className="h-12 w-12" />
            <h1 className="text-5xl md:text-6xl font-bold">PropertyPrime</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover your perfect property with our comprehensive real estate platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero"
              size="lg"
              onClick={() => setIsAddFormOpen(true)}
              className="text-lg px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Property
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 bg-background/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Browse Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-8">
        {/* Search and Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredProperties.length}
        />

        {/* Add Property Button - Mobile */}
        <div className="md:hidden">
          <Button 
            onClick={() => setIsAddFormOpen(true)}
            className="w-full"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Property
          </Button>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Home className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">No Properties Found</h3>
              <p className="text-muted-foreground">
                No properties match your current search criteria. Try adjusting your filters or add a new property.
              </p>
              <Button 
                onClick={() => setIsAddFormOpen(true)}
                variant="default"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Property
              </Button>
            </div>
          </div>
        )}

        {/* Floating Add Button - Desktop */}
        <div className="hidden md:block">
          <Button
            onClick={() => setIsAddFormOpen(true)}
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-elevated"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </main>

      {/* Modals */}
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <AddPropertyForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </div>
  );
};

export default Index;