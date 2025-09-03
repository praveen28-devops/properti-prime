import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatePlanCard, RatePlan } from "@/components/RatePlan";
import { AddRatePlanForm } from "@/components/AddRatePlanForm";
import { useRatePlans, useCreateRatePlan, useDeleteRatePlan, useToggleRatePlanStatus } from "@/hooks/useRatePlans";
import { Plus, Loader2, AlertCircle, DollarSign } from "lucide-react";

interface RateManagementProps {
  propertyId: string;
  propertyTitle: string;
}

export const RateManagement = ({ propertyId, propertyTitle }: RateManagementProps) => {
  const { data: ratePlans = [], isLoading, error, isError } = useRatePlans(propertyId);
  const createRatePlanMutation = useCreateRatePlan();
  const deleteRatePlanMutation = useDeleteRatePlan();
  const toggleStatusMutation = useToggleRatePlanStatus();
  
  const [isAddRatePlanOpen, setIsAddRatePlanOpen] = useState(false);
  const [editingRatePlan, setEditingRatePlan] = useState<RatePlan | null>(null);

  const handleCreateRatePlan = async (ratePlanData: any) => {
    try {
      await createRatePlanMutation.mutateAsync(ratePlanData);
      setIsAddRatePlanOpen(false);
    } catch (error) {
      console.error('Failed to create rate plan:', error);
    }
  };

  const handleEditRatePlan = (ratePlan: RatePlan) => {
    setEditingRatePlan(ratePlan);
    // TODO: Implement edit rate plan functionality
  };

  const handleDeleteRatePlan = async (ratePlan: RatePlan) => {
    if (window.confirm(`Are you sure you want to delete the rate plan "${ratePlan.name}"? This action cannot be undone.`)) {
      try {
        await deleteRatePlanMutation.mutateAsync({
          id: ratePlan.id,
          propertyId: ratePlan.propertyId
        });
      } catch (error) {
        console.error('Failed to delete rate plan:', error);
      }
    }
  };

  const handleToggleRatePlanStatus = async (ratePlan: RatePlan) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: ratePlan.id,
        isActive: !ratePlan.isActive,
        propertyId: ratePlan.propertyId
      });
    } catch (error) {
      console.error('Failed to toggle rate plan status:', error);
    }
  };

  // Group rate plans by season type for better organization
  const groupedRatePlans = ratePlans.reduce((acc, ratePlan) => {
    const season = ratePlan.seasonType;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(ratePlan);
    return acc;
  }, {} as Record<string, RatePlan[]>);

  const seasonOrder = ['standard', 'peak', 'off-peak', 'holiday'];
  const sortedSeasons = seasonOrder.filter(season => groupedRatePlans[season]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Rate & Inventory Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage pricing and availability for {propertyTitle}
                </p>
              </div>
            </div>
            <Button onClick={() => setIsAddRatePlanOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rate Plan
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Loading Rate Plans...</h3>
                <p className="text-muted-foreground">Please wait while we fetch the pricing data.</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Failed to Load Rate Plans</h3>
                <p className="text-muted-foreground">
                  {error?.message || 'Unable to fetch rate plan data. Please try again.'}
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Rate Plans by Season */}
          {!isLoading && !isError && (
            ratePlans.length > 0 ? (
              <div className="space-y-8">
                <div className="mb-4 text-sm text-muted-foreground">
                  {ratePlans.length} rate plan{ratePlans.length !== 1 ? 's' : ''} found
                </div>
                
                {sortedSeasons.map((season) => (
                  <div key={season} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold capitalize">
                        {season.replace('-', ' ')} Season
                      </h3>
                      <div className="h-px bg-border flex-1" />
                      <span className="text-sm text-muted-foreground">
                        {groupedRatePlans[season].length} plan{groupedRatePlans[season].length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedRatePlans[season].map((ratePlan) => (
                        <RatePlanCard
                          key={ratePlan.id}
                          ratePlan={ratePlan}
                          onEdit={handleEditRatePlan}
                          onDelete={handleDeleteRatePlan}
                          onToggleActive={handleToggleRatePlanStatus}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No Rate Plans Found</h3>
                  <p className="text-muted-foreground">
                    This property doesn't have any rate plans yet. Create your first rate plan to start managing pricing and inventory.
                  </p>
                  <Button 
                    onClick={() => setIsAddRatePlanOpen(true)}
                    variant="default"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Rate Plan
                  </Button>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Add Rate Plan Form */}
      <AddRatePlanForm
        propertyId={propertyId}
        isOpen={isAddRatePlanOpen}
        onClose={() => setIsAddRatePlanOpen(false)}
        onSubmit={handleCreateRatePlan}
      />
    </div>
  );
};
