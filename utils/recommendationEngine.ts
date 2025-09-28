import { 
  RiskAssessment, 
  Recommendation, 
  FinalRecommendations, 
  HealthFactor 
} from '@/types';
import { MEDICAL_DISCLAIMER, RECOMMENDATION_CATEGORIES } from '@/lib/constants';

// Evidence-based recommendation database
const RECOMMENDATION_DATABASE = {
  smoking: [
    {
      id: 'smoking-001',
      category: 'lifestyle' as const,
      priority: 'high' as const,
      title: 'Quit Smoking Program',
      description: 'Enroll in a comprehensive smoking cessation program with professional support',
      action_items: [
        'Set a quit date within the next 2 weeks',
        'Consult your doctor about nicotine replacement therapy',
        'Join a smoking cessation support group',
        'Download a quit-smoking app for daily motivation',
        'Remove all smoking triggers from your environment'
      ],
      timeline: '0-3 months for initial cessation, ongoing support',
      evidence_level: 'Strong evidence from multiple randomized controlled trials'
    },
    {
      id: 'smoking-002',
      category: 'medical' as const,
      priority: 'high' as const,
      title: 'Medical Consultation for Smoking Cessation',
      description: 'Seek professional medical guidance for personalized quit-smoking strategies',
      action_items: [
        'Schedule appointment with primary care physician',
        'Discuss prescription cessation aids (varenicline, bupropion)',
        'Get lung function assessment',
        'Create personalized quit plan with healthcare provider'
      ],
      timeline: 'Within 1-2 weeks',
      evidence_level: 'Clinical practice guidelines recommendation'
    }
  ],

  'poor diet': [
    {
      id: 'diet-001',
      category: 'diet' as const,
      priority: 'high' as const,
      title: 'Mediterranean Diet Adoption',
      description: 'Transition to a Mediterranean-style eating pattern proven to reduce cardiovascular risk',
      action_items: [
        'Increase daily vegetable servings to 5-7 portions',
        'Replace refined grains with whole grains',
        'Include fish 2-3 times per week',
        'Use olive oil as primary cooking fat',
        'Limit processed foods and added sugars to <10% of calories'
      ],
      timeline: '2-3 months for gradual transition',
      evidence_level: 'Strong evidence from Mediterranean diet studies'
    },
    {
      id: 'diet-002',
      category: 'diet' as const,
      priority: 'medium' as const,
      title: 'Sugar Reduction Strategy',
      description: 'Systematically reduce added sugar intake to improve metabolic health',
      action_items: [
        'Eliminate sugar-sweetened beverages',
        'Read nutrition labels to identify hidden sugars',
        'Replace sugary snacks with fruits and nuts',
        'Gradually reduce sugar in coffee/tea',
        'Choose unsweetened alternatives when available'
      ],
      timeline: '4-6 weeks for taste adaptation',
      evidence_level: 'WHO and dietary guidelines consensus'
    }
  ],

  'low exercise': [
    {
      id: 'exercise-001',
      category: 'exercise' as const,
      priority: 'high' as const,
      title: 'Progressive Exercise Program',
      description: 'Build up to recommended 150 minutes of moderate activity per week',
      action_items: [
        'Start with 10-minute daily walks',
        'Increase walking duration by 5 minutes weekly',
        'Add 2 days of strength training per week',
        'Include flexibility exercises 3 times per week',
        'Track progress with activity monitor or app'
      ],
      timeline: '8-12 weeks to reach target activity level',
      evidence_level: 'Physical Activity Guidelines for Americans'
    },
    {
      id: 'exercise-002',
      category: 'exercise' as const,
      priority: 'medium' as const,
      title: 'Sedentary Behavior Reduction',
      description: 'Break up prolonged sitting with regular movement throughout the day',
      action_items: [
        'Set hourly reminders to stand and move for 2-3 minutes',
        'Use standing desk for part of workday if possible',
        'Take stairs instead of elevators when available',
        'Park farther away or get off transit one stop early',
        'Do bodyweight exercises during TV commercial breaks'
      ],
      timeline: 'Immediate implementation, habit formation in 3-4 weeks',
      evidence_level: 'Emerging evidence on sedentary behavior risks'
    }
  ],

  'high stress': [
    {
      id: 'stress-001',
      category: 'lifestyle' as const,
      priority: 'high' as const,
      title: 'Stress Management Techniques',
      description: 'Learn and practice evidence-based stress reduction methods',
      action_items: [
        'Practice daily mindfulness meditation (10-20 minutes)',
        'Learn deep breathing exercises for acute stress',
        'Establish regular sleep schedule',
        'Identify and modify stress triggers where possible',
        'Consider cognitive behavioral therapy if stress is severe'
      ],
      timeline: '4-8 weeks to develop consistent practice',
      evidence_level: 'Strong evidence for mindfulness-based interventions'
    },
    {
      id: 'stress-002',
      category: 'lifestyle' as const,
      priority: 'medium' as const,
      title: 'Work-Life Balance Optimization',
      description: 'Create boundaries and strategies to manage work-related stress',
      action_items: [
        'Set clear work hours and stick to them',
        'Practice saying no to non-essential commitments',
        'Schedule regular breaks during work day',
        'Develop hobbies and activities outside of work',
        'Consider discussing workload with supervisor if needed'
      ],
      timeline: '2-4 weeks to implement changes',
      evidence_level: 'Occupational health research findings'
    }
  ],

  'poor sleep': [
    {
      id: 'sleep-001',
      category: 'lifestyle' as const,
      priority: 'high' as const,
      title: 'Sleep Hygiene Improvement',
      description: 'Establish healthy sleep habits to improve sleep quality and duration',
      action_items: [
        'Maintain consistent bedtime and wake time',
        'Create dark, cool, quiet sleep environment',
        'Avoid screens 1 hour before bedtime',
        'Limit caffeine after 2 PM',
        'Establish relaxing bedtime routine'
      ],
      timeline: '2-4 weeks for sleep pattern adjustment',
      evidence_level: 'Sleep medicine clinical practice guidelines'
    }
  ],

  'excessive alcohol': [
    {
      id: 'alcohol-001',
      category: 'lifestyle' as const,
      priority: 'high' as const,
      title: 'Alcohol Reduction Plan',
      description: 'Reduce alcohol consumption to recommended guidelines',
      action_items: [
        'Track current alcohol intake for one week',
        'Set specific reduction goals (e.g., alcohol-free days)',
        'Replace alcoholic drinks with non-alcoholic alternatives',
        'Avoid high-risk situations and triggers',
        'Seek support from friends, family, or support groups'
      ],
      timeline: '4-8 weeks for gradual reduction',
      evidence_level: 'Public health guidelines and clinical evidence'
    }
  ],

  'abnormal weight': [
    {
      id: 'weight-001',
      category: 'lifestyle' as const,
      priority: 'high' as const,
      title: 'Sustainable Weight Management',
      description: 'Achieve and maintain healthy weight through lifestyle changes',
      action_items: [
        'Create modest caloric deficit of 300-500 calories per day',
        'Focus on whole foods and portion control',
        'Combine dietary changes with increased physical activity',
        'Track weight weekly, not daily',
        'Consider working with registered dietitian'
      ],
      timeline: '3-6 months for initial weight loss, ongoing maintenance',
      evidence_level: 'Evidence-based weight management guidelines'
    }
  ],

  'advanced age': [
    {
      id: 'age-001',
      category: 'medical' as const,
      priority: 'medium' as const,
      title: 'Age-Appropriate Health Screening',
      description: 'Stay current with recommended health screenings for your age group',
      action_items: [
        'Schedule annual physical examination',
        'Get age-appropriate cancer screenings',
        'Monitor blood pressure, cholesterol, and blood sugar',
        'Discuss bone density screening with healthcare provider',
        'Stay up to date with recommended vaccinations'
      ],
      timeline: 'Ongoing, schedule annually',
      evidence_level: 'Preventive care guidelines by age'
    }
  ],

  'medical history': [
    {
      id: 'medical-001',
      category: 'medical' as const,
      priority: 'high' as const,
      title: 'Chronic Disease Management',
      description: 'Optimize management of existing health conditions',
      action_items: [
        'Maintain regular follow-up appointments',
        'Take medications as prescribed',
        'Monitor relevant health metrics at home',
        'Communicate changes in symptoms promptly',
        'Consider specialized care if needed'
      ],
      timeline: 'Ongoing disease management',
      evidence_level: 'Disease-specific clinical guidelines'
    }
  ]
};

/**
 * Generate personalized recommendations based on risk assessment
 */
export function generateRecommendations(
  riskAssessment: RiskAssessment,
  userPreferences?: {
    focus_areas?: string[];
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    time_commitment?: 'low' | 'medium' | 'high';
  }
): FinalRecommendations {
  const recommendations: Recommendation[] = [];
  const factors = riskAssessment.contributing_factors;
  
  // Group factors by type for targeted recommendations
  const factorGroups = groupFactorsByType(factors);
  
  // Generate recommendations for each factor group
  Object.entries(factorGroups).forEach(([factorType, factorList]) => {
    const factorRecommendations = getRecommendationsForFactor(factorType, factorList, userPreferences);
    recommendations.push(...factorRecommendations);
  });

  // Add general recommendations based on risk level
  if (riskAssessment.risk_level === 'high') {
    recommendations.push(getGeneralHighRiskRecommendation());
  }

  // Sort recommendations by priority and factor severity
  const sortedRecommendations = prioritizeRecommendations(recommendations, factors);
  
  // Limit to top 6-8 recommendations to avoid overwhelming the user
  const finalRecommendations = sortedRecommendations.slice(0, 8);

  return {
    risk_level: riskAssessment.risk_level,
    factors: riskAssessment.rationale,
    recommendations: finalRecommendations,
    status: 'ok',
    disclaimer: MEDICAL_DISCLAIMER
  };
}

/**
 * Group health factors by type for targeted recommendations
 */
function groupFactorsByType(factors: HealthFactor[]): { [key: string]: HealthFactor[] } {
  const groups: { [key: string]: HealthFactor[] } = {};
  
  factors.forEach(factor => {
    const factorType = identifyFactorType(factor);
    if (!groups[factorType]) {
      groups[factorType] = [];
    }
    groups[factorType].push(factor);
  });
  
  return groups;
}

/**
 * Identify the type of health factor for recommendation matching
 */
function identifyFactorType(factor: HealthFactor): string {
  const name = factor.name.toLowerCase();
  
  if (name.includes('smoking')) return 'smoking';
  if (name.includes('diet') || name.includes('nutrition')) return 'poor diet';
  if (name.includes('exercise') || name.includes('physical') || name.includes('inactivity')) return 'low exercise';
  if (name.includes('stress') || name.includes('anxiety')) return 'high stress';
  if (name.includes('sleep')) return 'poor sleep';
  if (name.includes('alcohol')) return 'excessive alcohol';
  if (name.includes('weight') || name.includes('bmi') || name.includes('obesity')) return 'abnormal weight';
  if (name.includes('age')) return 'advanced age';
  if (name.includes('medical') || name.includes('condition')) return 'medical history';
  
  return 'general';
}

/**
 * Get specific recommendations for a factor type
 */
function getRecommendationsForFactor(
  factorType: string, 
  factors: HealthFactor[],
  userPreferences?: {
    focus_areas?: string[];
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    time_commitment?: 'low' | 'medium' | 'high';
  }
): Recommendation[] {
  const baseRecommendations = RECOMMENDATION_DATABASE[factorType as keyof typeof RECOMMENDATION_DATABASE] || [];
  
  if (baseRecommendations.length === 0) {
    return [generateGenericRecommendation(factorType, factors[0])];
  }
  
  // Customize recommendations based on user preferences
  return baseRecommendations.map(rec => customizeRecommendation(rec, factors, userPreferences));
}

/**
 * Customize a recommendation based on user preferences and factor severity
 */
function customizeRecommendation(
  recommendation: Recommendation,
  factors: HealthFactor[],
  userPreferences?: {
    focus_areas?: string[];
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    time_commitment?: 'low' | 'medium' | 'high';
  }
): Recommendation {
  let customized = { ...recommendation };
  
  // Adjust based on factor severity
  const highSeverityFactor = factors.find(f => f.severity === 'high');
  if (highSeverityFactor && customized.priority !== 'high') {
    customized.priority = 'high';
  }
  
  // Adjust action items based on difficulty level
  if (userPreferences?.difficulty_level === 'beginner') {
    customized.action_items = simplifyActionItems(customized.action_items);
    customized.timeline = extendTimeline(customized.timeline);
  } else if (userPreferences?.difficulty_level === 'advanced') {
    customized.action_items = enhanceActionItems(customized.action_items);
  }
  
  // Adjust based on time commitment
  if (userPreferences?.time_commitment === 'low') {
    customized.action_items = customized.action_items.slice(0, 3); // Limit to top 3 actions
  }
  
  return customized;
}

/**
 * Generate a generic recommendation for factors not in the database
 */
function generateGenericRecommendation(factorType: string, factor: HealthFactor): Recommendation {
  return {
    id: `generic-${factorType}`,
    category: 'lifestyle',
    priority: factor.severity === 'high' ? 'high' : 'medium',
    title: `Address ${factor.name}`,
    description: `Take steps to improve ${factor.name.toLowerCase()} to reduce health risk`,
    action_items: [
      'Consult with healthcare provider about this risk factor',
      'Research evidence-based approaches for improvement',
      'Set specific, measurable goals for improvement',
      'Track progress regularly'
    ],
    timeline: '2-4 weeks to develop action plan',
    evidence_level: 'General health promotion guidelines'
  };
}

/**
 * Get general recommendation for high-risk individuals
 */
function getGeneralHighRiskRecommendation(): Recommendation {
  return {
    id: 'general-high-risk',
    category: 'medical',
    priority: 'high',
    title: 'Comprehensive Health Assessment',
    description: 'Schedule a comprehensive health evaluation to address multiple risk factors',
    action_items: [
      'Schedule appointment with primary care physician within 2 weeks',
      'Prepare list of all current medications and supplements',
      'Bring complete family health history',
      'Discuss creating a personalized risk reduction plan',
      'Consider referral to specialists if needed'
    ],
    timeline: 'Within 2-4 weeks',
    evidence_level: 'Clinical practice guidelines for high-risk patients'
  };
}

/**
 * Prioritize recommendations based on factor severity and evidence strength
 */
function prioritizeRecommendations(recommendations: Recommendation[], factors: HealthFactor[]): Recommendation[] {
  return recommendations.sort((a, b) => {
    // Priority order: high > medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    // Category order: medical > lifestyle > diet > exercise  
    const categoryOrder = { medical: 4, lifestyle: 3, diet: 2, exercise: 1 };
    return (categoryOrder[b.category] || 0) - (categoryOrder[a.category] || 0);
  });
}

/**
 * Simplify action items for beginner difficulty level
 */
function simplifyActionItems(actionItems: string[]): string[] {
  return actionItems.map(item => {
    // Make items more specific and actionable for beginners
    return item
      .replace(/(\d+-\d+)\s*(minutes|hours)/g, (match, range) => {
        const numbers = range.split('-').map(Number);
        return `${numbers[0]} ${match.includes('hour') ? 'hours' : 'minutes'}`;
      })
      .replace(/gradually/gi, 'slowly over several weeks');
  });
}

/**
 * Enhance action items for advanced difficulty level
 */
function enhanceActionItems(actionItems: string[]): string[] {
  return [
    ...actionItems,
    'Track detailed metrics and progress indicators',
    'Research latest evidence and best practices',
    'Consider advanced techniques or interventions'
  ];
}

/**
 * Extend timeline for beginner difficulty level
 */
function extendTimeline(timeline: string): string {
  return timeline.replace(/(\d+)-(\d+)\s*(weeks?|months?)/g, (match, start, end, unit) => {
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    return `${startNum + 1}-${endNum + 2} ${unit}`;
  });
}

/**
 * Generate recommendation summary for quick overview
 */
export function generateRecommendationSummary(recommendations: Recommendation[]): {
  high_priority_count: number;
  primary_focus_areas: string[];
  estimated_timeline: string;
  key_actions: string[];
} {
  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
  
  const focusAreas = [...new Set(recommendations.map(r => r.category))];
  
  // Extract key immediate actions
  const keyActions = recommendations
    .filter(r => r.priority === 'high')
    .slice(0, 3)
    .map(r => r.action_items[0]);
  
  return {
    high_priority_count: highPriorityCount,
    primary_focus_areas: focusAreas,
    estimated_timeline: '2-12 weeks for initial changes, 3-6 months for sustained improvement',
    key_actions: keyActions
  };
}