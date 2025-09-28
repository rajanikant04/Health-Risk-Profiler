'use client';

import { useState } from 'react';
import { Recommendation } from '@/types';
import { Card, Button } from '@/components/ui/BasicComponents';
import { RECOMMENDATION_CATEGORIES } from '@/lib/constants';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

export function RecommendationList({ 
  recommendations, 
  onRecommendationClick 
}: RecommendationListProps) {
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRecommendations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRecommendations(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryInfo = (category: string) => {
    return RECOMMENDATION_CATEGORIES[category.toUpperCase() as keyof typeof RECOMMENDATION_CATEGORIES] || {
      name: category,
      icon: '📋',
      color: '#6B7280',
      description: 'General recommendation'
    };
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const categories = ['all', ...new Set(recommendations.map(rec => rec.category))];

  // Group recommendations by priority
  const groupedRecommendations = filteredRecommendations.reduce((groups, rec) => {
    const priority = rec.priority;
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(rec);
    return groups;
  }, {} as Record<string, Recommendation[]>);

  return (
    <div className="space-y-6">
      <Card title="Personalized Health Recommendations">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All Recommendations' : getCategoryInfo(category).name}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {groupedRecommendations.high?.length || 0}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {groupedRecommendations.medium?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Medium Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {groupedRecommendations.low?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recommendations found for the selected category.
            </div>
          ) : (
            // Sort by priority (high -> medium -> low)
            filteredRecommendations
              .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
              })
              .map((recommendation, index) => {
                const categoryInfo = getCategoryInfo(recommendation.category);
                const isExpanded = expandedRecommendations.has(recommendation.id);
                
                return (
                  <div 
                    key={recommendation.id} 
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow text-gray-900"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: categoryInfo.color }}
                        >
                          {categoryInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {categoryInfo.name}</span>
                            <span>Timeline: {recommendation.timeline}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleExpanded(recommendation.id)}
                      >
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {/* Action Items */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Action Steps:</h5>
                          <ul className="space-y-2">
                            {recommendation.action_items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="text-sm text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Evidence Level */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h6 className="font-medium text-gray-900 mb-1">Evidence Base:</h6>
                          <p className="text-sm text-gray-600">{recommendation.evidence_level}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {onRecommendationClick && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => onRecommendationClick(recommendation)}
                            >
                              Get More Info
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              // Add to calendar or reminder functionality could go here
                              alert('Reminder functionality would be implemented here');
                            }}
                          >
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>

        {/* Quick Action Summary */}
        {filteredRecommendations.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Quick Start Guide:</h4>
            <div className="space-y-2">
              {filteredRecommendations
                .filter(rec => rec.priority === 'high')
                .slice(0, 3)
                .map((rec, index) => (
                  <div key={rec.id} className="flex items-center space-x-2 text-sm text-green-700">
                    <span className="font-semibold">{index + 1}.</span>
                    <span>{rec.action_items[0]}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}