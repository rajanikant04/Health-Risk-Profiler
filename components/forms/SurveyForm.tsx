'use client';

import { useState } from 'react';
import { SurveyResponse, SurveyFormProps } from '@/types';
import { Button, Input, Select, Card, Alert } from '@/components/ui/BasicComponents';

const EXERCISE_OPTIONS = [
  { value: 'never', label: 'Never - No regular physical activity' },
  { value: 'rarely', label: 'Rarely - Light activity less than once per week' },
  { value: 'sometimes', label: 'Sometimes - Moderate activity 1-2 times per week' },
  { value: 'regularly', label: 'Regularly - Regular activity 3-4 times per week' },
  { value: 'daily', label: 'Daily - Daily physical activity' }
];

const DIET_OPTIONS = [
  { value: 'poor', label: 'Poor - High processed foods, low fruits/vegetables' },
  { value: 'fair', label: 'Fair - Some processed foods, moderate nutrition' },
  { value: 'good', label: 'Good - Balanced diet with regular fruits/vegetables' },
  { value: 'excellent', label: 'Excellent - Optimal nutrition with minimal processed foods' }
];

const ALCOHOL_OPTIONS = [
  { value: 'never', label: 'Never - No alcohol consumption' },
  { value: 'rarely', label: 'Rarely - Occasional social drinking' },
  { value: 'socially', label: 'Socially - Regular social drinking' },
  { value: 'regularly', label: 'Regularly - Regular weekly consumption' },
  { value: 'daily', label: 'Daily - Daily alcohol consumption' }
];

const STRESS_OPTIONS = [
  { value: 'low', label: 'Low - Well-managed stress levels' },
  { value: 'moderate', label: 'Moderate - Manageable stress with occasional peaks' },
  { value: 'high', label: 'High - Frequently high stress levels' },
  { value: 'very_high', label: 'Very High - Chronic high stress affecting daily life' }
];

const CHOLESTEROL_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'borderline', label: 'Borderline High' },
  { value: 'high', label: 'High' }
];

export function SurveyForm({ onSubmit, initialData = {}, isLoading = false }: SurveyFormProps) {
  const [formData, setFormData] = useState<Partial<SurveyResponse>>({
    age: initialData.age || undefined,
    smoker: initialData.smoker || undefined,
    exercise: initialData.exercise || '',
    diet: initialData.diet || '',
    alcohol: initialData.alcohol || '',
    sleep: initialData.sleep || undefined,
    stress: initialData.stress || '',
    weight: initialData.weight || undefined,
    height: initialData.height || undefined,
    bloodPressure: initialData.bloodPressure || '',
    cholesterol: initialData.cholesterol || '',
    diabetes: initialData.diabetes,
    medicalHistory: initialData.medicalHistory || [],
    familyHistory: initialData.familyHistory || []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [medicalCondition, setMedicalCondition] = useState('');
  const [familyCondition, setFamilyCondition] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === 'number') {
      processedValue = value ? Number(value) : undefined;
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addMedicalCondition = () => {
    if (medicalCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...(prev.medicalHistory || []), medicalCondition.trim()]
      }));
      setMedicalCondition('');
    }
  };

  const removeMedicalCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory?.filter((_, i) => i !== index) || []
    }));
  };

  const addFamilyCondition = () => {
    if (familyCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        familyHistory: [...(prev.familyHistory || []), familyCondition.trim()]
      }));
      setFamilyCondition('');
    }
  };

  const removeFamilyCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: prev.familyHistory?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Core field validation - only require the most essential fields
    const age = Number(formData.age);
    if (!formData.age || isNaN(age) || age < 1 || age > 120) {
      newErrors.age = 'Please enter a valid age between 1 and 120';
    }

    if (formData.smoker === undefined) {
      newErrors.smoker = 'Please specify smoking status';
    }

    // Make exercise and diet optional for now to test form submission
    // if (!formData.exercise) {
    //   newErrors.exercise = 'Please select exercise frequency';
    // }

    // if (!formData.diet) {
    //   newErrors.diet = 'Please select diet quality';
    // }

    // Optional field validation
    if (formData.sleep && (formData.sleep < 1 || formData.sleep > 24)) {
      newErrors.sleep = 'Sleep hours must be between 1 and 24';
    }

    if (formData.weight && (formData.weight < 20 || formData.weight > 500)) {
      newErrors.weight = 'Weight must be between 20 and 500 kg';
    }

    if (formData.height && (formData.height < 50 || formData.height > 300)) {
      newErrors.height = 'Height must be between 50 and 300 cm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Ensure we have at least the basic required data
      const submissionData = {
        ...formData,
        age: Number(formData.age),
        exercise: formData.exercise || 'sometimes', // Default fallback
        diet: formData.diet || 'fair' // Default fallback
      };
      onSubmit(submissionData as SurveyResponse);
    }
  };

  const completedFields = Object.values(formData).filter(value => 
    value !== '' && value !== undefined && value !== null
  ).length;
  const totalFields = 14; // Total number of form fields
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  return (
    <Card title="Health Survey" className="text-gray-900">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900">Survey Completion</span>
          <span className="text-sm text-gray-700">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert type="error" className="mb-6">
          Please correct the following errors before submitting:
          <ul className="mt-2 list-disc list-inside">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age || ''}
            onChange={handleInputChange}
            label="Age"
            placeholder="Enter your age"
            required
            error={errors.age}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Do you smoke? <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-900">
                <input
                  type="radio"
                  name="smoker"
                  value="true"
                  checked={formData.smoker === true}
                  onChange={(e) => setFormData(prev => ({ ...prev, smoker: true }))}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center text-gray-900">
                <input
                  type="radio"
                  name="smoker"
                  value="false"
                  checked={formData.smoker === false}
                  onChange={(e) => setFormData(prev => ({ ...prev, smoker: false }))}
                  className="mr-2"
                />
                No
              </label>
            </div>
            {errors.smoker && <p className="mt-1 text-sm text-red-600">{errors.smoker}</p>}
          </div>
        </div>

        {/* Lifestyle Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="exercise"
            name="exercise"
            value={formData.exercise || ''}
            onChange={handleInputChange}
            options={EXERCISE_OPTIONS}
            label="Exercise Frequency"
            error={errors.exercise}
          />

          <Select
            id="diet"
            name="diet"
            value={formData.diet || ''}
            onChange={handleInputChange}
            options={DIET_OPTIONS}
            label="Diet Quality"
            error={errors.diet}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="alcohol"
            name="alcohol"
            value={formData.alcohol || ''}
            onChange={handleInputChange}
            options={ALCOHOL_OPTIONS}
            label="Alcohol Consumption"
          />

          <Select
            id="stress"
            name="stress"
            value={formData.stress || ''}
            onChange={handleInputChange}
            options={STRESS_OPTIONS}
            label="Stress Level"
          />
        </div>

        {/* Physical Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="sleep"
            name="sleep"
            type="number"
            value={formData.sleep || ''}
            onChange={handleInputChange}
            label="Sleep Hours"
            placeholder="Hours per night"
            error={errors.sleep}
          />

          <Input
            id="weight"
            name="weight"
            type="number"
            value={formData.weight || ''}
            onChange={handleInputChange}
            label="Weight (kg)"
            placeholder="Weight in kg"
            error={errors.weight}
          />

          <Input
            id="height"
            name="height"
            type="number"
            value={formData.height || ''}
            onChange={handleInputChange}
            label="Height (cm)"
            placeholder="Height in cm"
            error={errors.height}
          />
        </div>

        {/* Medical Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="bloodPressure"
            name="bloodPressure"
            type="text"
            value={formData.bloodPressure || ''}
            onChange={handleInputChange}
            label="Blood Pressure"
            placeholder="e.g., 120/80"
          />

          <Select
            id="cholesterol"
            name="cholesterol"
            value={formData.cholesterol || ''}
            onChange={handleInputChange}
            options={CHOLESTEROL_OPTIONS}
            label="Cholesterol Level"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Do you have diabetes?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center text-gray-900">
              <input
                type="radio"
                name="diabetes"
                value="true"
                checked={formData.diabetes === true}
                onChange={(e) => setFormData(prev => ({ ...prev, diabetes: true }))}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center text-gray-900">
              <input
                type="radio"
                name="diabetes"
                value="false"
                checked={formData.diabetes === false}
                onChange={(e) => setFormData(prev => ({ ...prev, diabetes: false }))}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Medical History
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={medicalCondition}
              onChange={(e) => setMedicalCondition(e.target.value)}
              placeholder="Add medical condition"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-2 bg-white text-gray-900"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalCondition())}
            />
            <Button type="button" onClick={addMedicalCondition} size="sm">
              Add
            </Button>
          </div>
          {formData.medicalHistory && formData.medicalHistory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.medicalHistory.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeMedicalCondition(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Family History */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Family Medical History
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={familyCondition}
              onChange={(e) => setFamilyCondition(e.target.value)}
              placeholder="Add family medical condition"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-2 bg-white text-gray-900"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFamilyCondition())}
            />
            <Button type="button" onClick={addFamilyCondition} size="sm">
              Add
            </Button>
          </div>
          {formData.familyHistory && formData.familyHistory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.familyHistory.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeFamilyCondition(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="submit" loading={isLoading} size="lg">
            {isLoading ? 'Analyzing...' : 'Analyze Health Risk'}
          </Button>
        </div>
      </form>
    </Card>
  );
}