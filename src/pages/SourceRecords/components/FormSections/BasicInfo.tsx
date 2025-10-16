import React from 'react';
import { FormInput } from '../../../../components/FormInput';
import { FormSelect } from '../../../../components/FormSelect';
import { SourceRecord } from '../../../../types';

const pickupStations = [
  { value: 'ST001', label: 'Embu Town Station' },
  { value: 'ST002', label: 'Mecca Station' },
  { value: 'ST003', label: 'Ena Station' },
  { value: 'ST004', label: 'Ugweri Station' },
];

const areaCodes = [
  { value: 'AC001', label: 'Embu Area' },
  { value: 'AC002', label: 'Mecca Area' },
  { value: 'AC003', label: 'Ena Area' },
  { value: 'AC004', label: 'Ugweri Area' },
];

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
          label="Pickup Station"
          value={formData.pickupStationCode}
          onChange={(value) => setFormData({ ...formData, pickupStationCode: value as string })}
          options={pickupStations}
          error={errors.pickupStationCode}
          required
        />

        <FormSelect
          label="Area Code"
          value={formData.areaCode}
          onChange={(value) => setFormData({ ...formData, areaCode: value as string })}
          options={areaCodes}
          error={errors.areaCode}
          required
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
          label="Drop-off Point"
          type="text"
          value={formData.dropOffPoint}
          onChange={(value) => setFormData({ ...formData, dropOffPoint: value as string })}
          error={errors.dropOffPoint}
          required
          placeholder="Destination location"
        />

        <FormInput
          label="Estimated Delivery Time"
          type="text"
          value={formData.estimatedDeliveryTime}
          onChange={(value) => setFormData({ ...formData, estimatedDeliveryTime: value as string })}
          error={errors.estimatedDeliveryTime}
          placeholder="e.g., 2-3 hours"
        />
      </div>
    </div>
  );
};
