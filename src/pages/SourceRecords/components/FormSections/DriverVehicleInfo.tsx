import React from 'react';
import { FormInput } from '../../../../components/FormInput';

interface DriverVehicleInfoProps {
  formData: any;
  setFormData: any;
  errors: Record<string, string>;
}

export const DriverVehicleInfo: React.FC<DriverVehicleInfoProps> = ({ formData, setFormData, errors }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Driver & Vehicle Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Driver Name"
          type="text"
          value={formData.driverName}
          onChange={(value) => setFormData({ ...formData, driverName: value as string })}
          error={errors.driverName}
          required
          placeholder="Driver full name"
        />

        <FormInput
          label="Driver ID"
          type="text"
          value={formData.driverId}
          onChange={(value) => setFormData({ ...formData, driverId: value as string })}
          error={errors.driverId}
          required
          placeholder="Driver identification"
        />

        <FormInput
          label="Driver Phone"
          type="tel"
          value={formData.driverPhone}
          onChange={(value) => setFormData({ ...formData, driverPhone: value as string })}
          placeholder="Driver phone number"
        />

        <FormInput
          label="Vehicle Registration"
          type="text"
          value={formData.vehicleReg}
          onChange={(value) => setFormData({ ...formData, vehicleReg: value as string })}
          error={errors.vehicleReg}
          required
          placeholder="e.g., KAA 123A"
        />

        <FormInput
          label="Vehicle Make"
          type="text"
          value={formData.vehicleMake || ''}
          onChange={(value) => setFormData({ ...formData, vehicleMake: value as string })}
          placeholder="e.g., Toyota Hiace"
          className="md:col-span-1"
        />
      </div>
    </div>
  );
};
