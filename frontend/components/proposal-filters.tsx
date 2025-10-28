'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  FilterIcon, 
  XIcon, 
  CheckIcon,
  GridIcon,
  ListIcon
} from 'lucide-react';
import { 
  PROPOSAL_CATEGORIES, 
  getCategoryStats, 
  type ProposalCategory 
} from '@/lib/proposal-categories';

interface ProposalFiltersProps {
  proposals: any[];
  activeProposals: any[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  statusFilter: 'all' | 'active' | 'passed' | 'rejected' | 'expired';
  onStatusChange: (status: 'all' | 'active' | 'passed' | 'rejected' | 'expired') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProposalFilters({
  proposals,
  activeProposals,
  selectedCategories,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange
}: ProposalFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryStats = getCategoryStats(proposals);
  const activeCategoryStats = getCategoryStats(activeProposals);
  
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };
  
  const clearAllFilters = () => {
    onCategoryChange([]);
    onStatusChange('all');
  };
  
  const hasActiveFilters = selectedCategories.length > 0 || statusFilter !== 'all';
  
  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/10"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge className="ml-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
                {selectedCategories.length + (statusFilter !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <XIcon className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? 
              "bg-white/20 backdrop-blur-sm text-white border-white/30" : 
              "text-white/60 hover:text-white hover:bg-white/10"
            }
          >
            <GridIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? 
              "bg-white/20 backdrop-blur-sm text-white border-white/30" : 
              "text-white/60 hover:text-white hover:bg-white/10"
            }
          >
            <ListIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {statusFilter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 cursor-pointer hover:bg-white/20 transition-all"
              onClick={() => onStatusChange('all')}
            >
              Status: {statusFilter}
              <XIcon className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {selectedCategories.map(categoryId => {
            const category = PROPOSAL_CATEGORIES.find(cat => cat.id === categoryId);
            return (
              <Badge 
                key={categoryId}
                variant="secondary" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => toggleCategory(categoryId)}
              >
                {category?.icon} {category?.name}
                <XIcon className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
      
      {/* Expandable Filters */}
      {showFilters && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 space-y-6">
          
          {/* Status Filter */}
          <div>
            <h4 className="text-white font-medium mb-3">Status</h4>
            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'passed', 'rejected', 'expired'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusChange(status as any)}
                  className={statusFilter === status ? 
                    'bg-white/20 backdrop-blur-sm text-white border-white/30' : 
                    'bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10'
                  }
                >
                  {status === 'all' ? 'All Proposals' : status.charAt(0).toUpperCase() + status.slice(1)}
                  <Badge className="ml-2 bg-white/20 backdrop-blur-sm border-white/30">
                    {status === 'all' ? proposals.length : 
                     status === 'active' ? activeProposals.length :
                     proposals.filter(p => p.status === status).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <h4 className="text-white font-medium mb-3">Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PROPOSAL_CATEGORIES.map(category => {
                const isSelected = selectedCategories.includes(category.id);
                const totalCount = categoryStats[category.id] || 0;
                const activeCount = activeCategoryStats[category.id] || 0;
                
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    onClick={() => toggleCategory(category.id)}
                    className={`relative h-auto p-4 flex flex-col items-center text-center space-y-2 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-white/20 backdrop-blur-sm text-white border-white/40 shadow-lg' 
                        : 'bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10'
                    }`}
                    disabled={totalCount === 0}
                  >
                    {isSelected && (
                      <CheckIcon className="absolute top-2 right-2 w-4 h-4" />
                    )}
                    <div className="text-2xl">{category.icon}</div>
                    <div className="text-xs font-medium leading-tight">
                      {category.name}
                    </div>
                    <div className="flex gap-1 text-xs">
                      <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-xs px-1">
                        {totalCount}
                      </Badge>
                      {activeCount > 0 && (
                        <Badge className="bg-white/30 backdrop-blur-sm border-white/40 text-white text-xs px-1">
                          {activeCount} active
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}