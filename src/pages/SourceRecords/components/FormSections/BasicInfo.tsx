import React from 'react';
import { FormInput } from '../../../../components/FormInput';
import { FormSelect } from '../../../../components/FormSelect';
import { SourceRecord } from '../../../../types';

const pickupPoints = [
  { value: 'A', label: 'Point A (100-300)' },
  { value: 'B', label: 'Point B (400-600)' },
  { value: 'C', label: 'Point C (700-900)' },
  { value: 'D', label: 'Point D (1000-1200)' },
] as const;

interface BasicInfoProps {
  formData: Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'>>>;
  errors: Record<string, string>;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData, errors }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Date"
          type="date"
          value={formData.date}
          onChange={(value) => setFormData({ ...formData, date: value as string })}
          error={errors.date}
          required
        />

        <FormSelect
          label="Pickup Point"
          value={formData.pickupPoint}
          onChange={(value) => setFormData({ ...formData, pickupPoint: value as any })}
          options={pickupPoints}
          error={errors.pickupPoint}
          required
        />

        <FormInput
          label="Farmer ID"
          type="text"
          value={formData.farmerId}
          onChange={(value) => setFormData({ ...formData, farmerId: value as string })}
          error={errors.farmerId}
          required
          placeholder="Farmer identification"
        />

        <FormInput
          label="Quantity (kg)"
          type="number"
          value={formData.quantitySold}
          onChange={(value) => setFormData({ ...formData, quantitySold: value as number })}
          error={errors.quantitySold}
          required
          placeholder="Weight in kilograms"
        />

        <FormInput
          label="Price per kg"
          type="number"
          value={formData.itemPrice}
          onChange={(value) => setFormData({ ...formData, itemPrice: value as number })}
          error={errors.itemPrice}
          required
          placeholder="Price per kilogram"
        />

        <FormInput
          label="Payment Methods"
          type="text"
          value={formData.paymentMethods?.join(', ') || ''}
          onChange={(value) => {
            const methods = (value as string).split(',').map(m => m.trim()).filter(Boolean);
            setFormData({ ...formData, paymentMethods: methods as any });
          }}
          placeholder="Cash, M-Pesa, Bank"
        />
      </div>
    </div>
  );
};
