import { 
  SurveyResponse, 
  HealthFactor, 
  RiskAssessment, 
  ExtractedFactors 
} from '@/types';
import { 
  RISK_SCORING_CONFIG, 
  EXERCISE_LEVELS, 
  DIET_QUALITY, 
  ALCOHOL_CONSUMPTION, 
  STRESS_LEVELS 
} from '@/lib/constants';
import { calculateConfidenceScore } from '@/lib/validation';

/**
 * Extract health risk factors from survey responses
 */
export function extractHealthFactors(answers: SurveyResponse): ExtractedFactors {
  const factors: string[] = [];
  const detailedFactors: HealthFactor[] = [];
  let totalPoints = 0;

  // Age factor
  if (answers.age && answers.age > RISK_SCORING_CONFIG.AGE_FACTOR_THRESHOLD) {
    const agePoints = (answers.age - RISK_SCORING_CONFIG.AGE_FACTOR_THRESHOLD) * RISK_SCORING_CONFIG.AGE_POINTS_PER_YEAR;
    factors.push('advanced age');
    detailedFactors.push({
      name: 'Age Risk Factor',
      category: 'demographic',
      severity: agePoints > 20 ? 'high' : agePoints > 10 ? 'moderate' : 'low',
      points: agePoints,
      description: `Age ${answers.age} increases cardiovascular and metabolic risk`
    });
    totalPoints += agePoints;
  }

  // Smoking factor
  if (answers.smoker === true) {
    factors.push('smoking');
    detailedFactors.push({
      name: 'Smoking',
      category: 'lifestyle',
      severity: 'high',
      points: RISK_SCORING_CONFIG.SMOKING_POINTS,
      description: 'Smoking significantly increases risk of cardiovascular disease, cancer, and respiratory issues'
    });
    totalPoints += RISK_SCORING_CONFIG.SMOKING_POINTS;
  }

  // Exercise factor
  if (answers.exercise && EXERCISE_LEVELS[answers.exercise as keyof typeof EXERCISE_LEVELS]) {
    const exerciseData = EXERCISE_LEVELS[answers.exercise as keyof typeof EXERCISE_LEVELS];
    if (exerciseData.points > 0) {
      factors.push('low exercise');
      detailedFactors.push({
        name: 'Physical Inactivity',
        category: 'lifestyle',
        severity: exerciseData.points >= 12 ? 'high' : exerciseData.points >= 8 ? 'moderate' : 'low',
        points: exerciseData.points,
        description: `${exerciseData.description} - increases risk of obesity, diabetes, and heart disease`
      });
      totalPoints += exerciseData.points;
    }
  }

  // Diet factor
  if (answers.diet) {
    let dietPoints = 0;
    let dietDescription = '';
    let dietSeverity: 'low' | 'moderate' | 'high' = 'low';

    if (typeof answers.diet === 'string') {
      if (DIET_QUALITY[answers.diet as keyof typeof DIET_QUALITY]) {
        const dietData = DIET_QUALITY[answers.diet as keyof typeof DIET_QUALITY];
        dietPoints = dietData.points;
        dietDescription = dietData.description;
      } else {
        // Handle custom diet descriptions
        const lowerDiet = answers.diet.toLowerCase();
        if (lowerDiet.includes('high sugar') || lowerDiet.includes('processed') || lowerDiet.includes('fast food')) {
          dietPoints = RISK_SCORING_CONFIG.POOR_DIET_POINTS;
          dietDescription = 'High sugar and processed food consumption';
        } else if (lowerDiet.includes('vegetables') || lowerDiet.includes('healthy') || lowerDiet.includes('balanced')) {
          dietPoints = 5; // Moderate improvement needed
          dietDescription = 'Generally healthy but could be optimized';
        }
      }
    }

    if (dietPoints > 0) {
      factors.push('poor diet');
      dietSeverity = dietPoints >= 15 ? 'high' : dietPoints >= 8 ? 'moderate' : 'low';
      detailedFactors.push({
        name: 'Poor Diet Quality',
        category: 'lifestyle',
        severity: dietSeverity,
        points: dietPoints,
        description: `${dietDescription} - increases risk of obesity, diabetes, and cardiovascular disease`
      });
      totalPoints += dietPoints;
    }
  }

  // Alcohol factor
  if (answers.alcohol && ALCOHOL_CONSUMPTION[answers.alcohol as keyof typeof ALCOHOL_CONSUMPTION]) {
    const alcoholData = ALCOHOL_CONSUMPTION[answers.alcohol as keyof typeof ALCOHOL_CONSUMPTION];
    if (alcoholData.points > 0) {
      factors.push('excessive alcohol');
      detailedFactors.push({
        name: 'Alcohol Consumption',
        category: 'lifestyle',
        severity: alcoholData.points >= 10 ? 'high' : alcoholData.points >= 5 ? 'moderate' : 'low',
        points: alcoholData.points,
        description: `${alcoholData.description} - increases risk of liver disease, cancer, and cardiovascular issues`
      });
      totalPoints += alcoholData.points;
    }
  }

  // Stress factor
  if (answers.stress && STRESS_LEVELS[answers.stress as keyof typeof STRESS_LEVELS]) {
    const stressData = STRESS_LEVELS[answers.stress as keyof typeof STRESS_LEVELS];
    if (stressData.points > 0) {
      factors.push('high stress');
      detailedFactors.push({
        name: 'Chronic Stress',
        category: 'lifestyle',
        severity: stressData.points >= 12 ? 'high' : stressData.points >= 8 ? 'moderate' : 'low',
        points: stressData.points,
        description: `${stressData.description} - increases risk of cardiovascular disease and mental health issues`
      });
      totalPoints += stressData.points;
    }
  }

  // Sleep factor
  if (answers.sleep) {
    let sleepPoints = 0;
    let sleepDescription = '';
    
    if (answers.sleep < 6) {
      sleepPoints = RISK_SCORING_CONFIG.POOR_SLEEP_POINTS;
      sleepDescription = 'Severely inadequate sleep (less than 6 hours)';
    } else if (answers.sleep < 7) {
      sleepPoints = 5;
      sleepDescription = 'Insufficient sleep (6-7 hours)';
    } else if (answers.sleep > 9) {
      sleepPoints = 3;
      sleepDescription = 'Excessive sleep (more than 9 hours)';
    }

    if (sleepPoints > 0) {
      factors.push('poor sleep');
      detailedFactors.push({
        name: 'Sleep Disruption',
        category: 'lifestyle',
        severity: sleepPoints >= 8 ? 'high' : sleepPoints >= 5 ? 'moderate' : 'low',
        points: sleepPoints,
        description: `${sleepDescription} - affects immune function, metabolism, and cardiovascular health`
      });
      totalPoints += sleepPoints;
    }
  }

  // BMI factor (if weight and height are provided)
  if (answers.weight && answers.height) {
    const heightInMeters = answers.height / 100;
    const bmi = answers.weight / (heightInMeters * heightInMeters);
    let bmiPoints = 0;
    let bmiDescription = '';
    let bmiSeverity: 'low' | 'moderate' | 'high' = 'low';

    if (bmi >= 30) {
      bmiPoints = 15;
      bmiDescription = `Obesity (BMI: ${bmi.toFixed(1)})`;
      bmiSeverity = 'high';
    } else if (bmi >= 25) {
      bmiPoints = 8;
      bmiDescription = `Overweight (BMI: ${bmi.toFixed(1)})`;
      bmiSeverity = 'moderate';
    } else if (bmi < 18.5) {
      bmiPoints = 5;
      bmiDescription = `Underweight (BMI: ${bmi.toFixed(1)})`;
      bmiSeverity = 'moderate';
    }

    if (bmiPoints > 0) {
      factors.push('abnormal weight');
      detailedFactors.push({
        name: 'Weight Risk Factor',
        category: 'medical',
        severity: bmiSeverity,
        points: bmiPoints,
        description: `${bmiDescription} - increases risk of diabetes, cardiovascular disease, and other health issues`
      });
      totalPoints += bmiPoints;
    }
  }

  // Medical history factors
  if (answers.medicalHistory && answers.medicalHistory.length > 0) {
    const medicalPoints = answers.medicalHistory.length * 5; // 5 points per condition
    factors.push('medical history');
    detailedFactors.push({
      name: 'Pre-existing Conditions',
      category: 'medical',
      severity: medicalPoints >= 15 ? 'high' : medicalPoints >= 10 ? 'moderate' : 'low',
      points: medicalPoints,
      description: `${answers.medicalHistory.join(', ')} - existing health conditions increase overall risk profile`
    });
    totalPoints += medicalPoints;
  }

  // Family history factors
  if (answers.familyHistory && answers.familyHistory.length > 0) {
    const familyPoints = answers.familyHistory.length * 3; // 3 points per family condition
    factors.push('family history');
    detailedFactors.push({
      name: 'Genetic Risk Factors',
      category: 'medical',
      severity: familyPoints >= 9 ? 'high' : familyPoints >= 6 ? 'moderate' : 'low',
      points: familyPoints,
      description: `Family history of ${answers.familyHistory.join(', ')} - genetic predisposition increases risk`
    });
    totalPoints += familyPoints;
  }

  // Calculate confidence based on data completeness
  const confidence = calculateConfidenceScore(answers, 1.0);

  return {
    factors,
    confidence,
    detailed_factors: detailedFactors
  };
}

/**
 * Calculate overall risk score and determine risk level
 */
export function calculateRiskScore(answers: SurveyResponse): RiskAssessment {
  const extractedFactors = extractHealthFactors(answers);
  let baseScore = 0;

  // Sum up all factor points
  extractedFactors.detailed_factors.forEach(factor => {
    baseScore += factor.points;
  });

  // Apply interaction multiplier if multiple high-risk factors are present
  const highRiskFactors = extractedFactors.detailed_factors.filter(f => f.severity === 'high');
  if (highRiskFactors.length >= 2) {
    const interactionBonus = baseScore * RISK_SCORING_CONFIG.INTERACTION_MULTIPLIER;
    baseScore += interactionBonus;
  }

  // Cap the score at 100
  const finalScore = Math.min(Math.round(baseScore), 100);

  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high';
  if (finalScore <= RISK_SCORING_CONFIG.RISK_THRESHOLDS.LOW.max) {
    riskLevel = 'low';
  } else if (finalScore <= RISK_SCORING_CONFIG.RISK_THRESHOLDS.MODERATE.max) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }

  // Generate rationale
  const rationale = extractedFactors.factors.slice(0, 3); // Top 3 contributing factors

  return {
    risk_level: riskLevel,
    score: finalScore,
    rationale,
    confidence: extractedFactors.confidence,
    contributing_factors: extractedFactors.detailed_factors
  };
}

/**
 * Get risk level description and recommendations overview
 */
export function getRiskLevelInfo(riskLevel: 'low' | 'moderate' | 'high') {
  const riskInfo = {
    low: {
      description: 'Your current lifestyle choices support good health outcomes',
      urgency: 'Maintain current healthy habits with minor optimizations',
      color: '#10B981',
      icon: '✅'
    },
    moderate: {
      description: 'Some lifestyle factors may increase your health risks over time',
      urgency: 'Consider making gradual improvements to reduce risk factors',
      color: '#F59E0B',
      icon: '⚠️'
    },
    high: {
      description: 'Multiple factors significantly increase your risk of health complications',
      urgency: 'Prioritize immediate lifestyle changes and consult healthcare professionals',
      color: '#EF4444',
      icon: '🚨'
    }
  };

  return riskInfo[riskLevel];
}

/**
 * Analyze factor interactions and compound risks
 */
export function analyzeFactorInteractions(factors: HealthFactor[]): {
  interactions: string[];
  compoundRisk: number;
  recommendations: string[];
} {
  const interactions: string[] = [];
  let compoundRisk = 0;
  const recommendations: string[] = [];

  // Check for smoking + poor diet combination
  const hasSmoking = factors.some(f => f.name.toLowerCase().includes('smoking'));
  const hasPoorDiet = factors.some(f => f.name.toLowerCase().includes('diet'));
  if (hasSmoking && hasPoorDiet) {
    interactions.push('Smoking combined with poor diet significantly increases cardiovascular risk');
    compoundRisk += 10;
    recommendations.push('Priority: Address both smoking cessation and dietary improvements simultaneously');
  }

  // Check for low exercise + weight issues
  const hasInactivity = factors.some(f => f.name.toLowerCase().includes('inactivity'));
  const hasWeightIssue = factors.some(f => f.name.toLowerCase().includes('weight'));
  if (hasInactivity && hasWeightIssue) {
    interactions.push('Physical inactivity and weight issues create a cycle that increases metabolic risk');
    compoundRisk += 8;
    recommendations.push('Start with low-impact exercise to break the inactivity-weight cycle');
  }

  // Check for stress + poor sleep combination
  const hasStress = factors.some(f => f.name.toLowerCase().includes('stress'));
  const hasSleep = factors.some(f => f.name.toLowerCase().includes('sleep'));
  if (hasStress && hasSleep) {
    interactions.push('Chronic stress and poor sleep quality compound each other, affecting overall health');
    compoundRisk += 6;
    recommendations.push('Focus on stress management techniques that improve sleep quality');
  }

  // Check for multiple lifestyle factors
  const lifestyleFactors = factors.filter(f => f.category === 'lifestyle');
  if (lifestyleFactors.length >= 3) {
    interactions.push('Multiple lifestyle risk factors compound to significantly increase overall health risk');
    compoundRisk += lifestyleFactors.length * 2;
    recommendations.push('Consider a comprehensive lifestyle modification approach rather than isolated changes');
  }

  return {
    interactions,
    compoundRisk,
    recommendations
  };
}

/**
 * Generate detailed risk assessment with factor analysis
 */
export function generateDetailedRiskAssessment(answers: SurveyResponse): RiskAssessment & {
  risk_breakdown: {
    lifestyle_score: number;
    medical_score: number;
    demographic_score: number;
  };
  factor_interactions: ReturnType<typeof analyzeFactorInteractions>;
  improvement_potential: number;
} {
  const baseAssessment = calculateRiskScore(answers);
  const factorInteractions = analyzeFactorInteractions(baseAssessment.contributing_factors);

  // Calculate risk breakdown by category
  const riskBreakdown = {
    lifestyle_score: baseAssessment.contributing_factors
      .filter(f => f.category === 'lifestyle')
      .reduce((sum, f) => sum + f.points, 0),
    medical_score: baseAssessment.contributing_factors
      .filter(f => f.category === 'medical')
      .reduce((sum, f) => sum + f.points, 0),
    demographic_score: baseAssessment.contributing_factors
      .filter(f => f.category === 'demographic')
      .reduce((sum, f) => sum + f.points, 0)
  };

  // Calculate improvement potential (how much risk could be reduced by lifestyle changes)
  const improvementPotential = Math.round(
    (riskBreakdown.lifestyle_score / baseAssessment.score) * 100
  );

  return {
    ...baseAssessment,
    score: Math.min(baseAssessment.score + factorInteractions.compoundRisk, 100),
    risk_breakdown: riskBreakdown,
    factor_interactions: factorInteractions,
    improvement_potential: improvementPotential
  };
}