import React from 'react';
import { FormInput } from '../../../components/FormInput';
import { FormSelect } from '../../../components/FormSelect';
import { SourceRecord } from '../../../types';
import { formatCurrency } from '../../../utils/helpers';

const pickupPoints = [
  { value: 'A', label: 'Point A (100-300)' },
  { value: 'B', label: 'Point B (400-600)' },
  { value: 'C', label: 'Point C (700-900)' },
  { value: 'D', label: 'Point D (1000-1200)' },
] as const;

interface SourceRecordFormProps {
  formData: Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'>;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  user: any;
}

export const SourceRecordForm: React.FC<SourceRecordFormProps> = ({
  formData,
  setFormData,
  errors,
  user,
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
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
        </div>
      </div>

      {/* Driver & Vehicle Info */}
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

      {/* Packaging Info */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Packaging Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormInput
            label="Basins"
            type="number"
            value={formData.packaging.basins}
            onChange={(value) => setFormData({
              ...formData,
              packaging: { ...formData.packaging, basins: value as number }
            })}
            placeholder="Number of basins"
          />

          <FormInput
            label="Sacks"
            type="number"
            value={formData.packaging.sacks}
            onChange={(value) => setFormData({
              ...formData,
              packaging: { ...formData.packaging, sacks: value as number }
            })}
            placeholder="Number of sacks"
          />

          <FormInput
            label="Boxes"
            type="number"
            value={formData.packaging.boxes}
            onChange={(value) => setFormData({
              ...formData,
              packaging: { ...formData.packaging, boxes: value as number }
            })}
            placeholder="Number of boxes"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Basin Cost (each)"
            type="number"
            value={formData.packagingCosts.basinCost}
            onChange={(value) => setFormData({
              ...formData,
              packagingCosts: { ...formData.packagingCosts, basinCost: value as number }
            })}
            placeholder="Cost per basin"
          />

          <FormInput
            label="Sack Cost (each)"
            type="number"
            value={formData.packagingCosts.sackCost}
            onChange={(value) => setFormData({
              ...formData,
              packagingCosts: { ...formData.packagingCosts, sackCost: value as number }
            })}
            placeholder="Cost per sack"
          />

          <FormInput
            label="Box Cost (each)"
            type="number"
            value={formData.packagingCosts.boxCost}
            onChange={(value) => setFormData({
              ...formData,
              packagingCosts: { ...formData.packagingCosts, boxCost: value as number }
            })}
            placeholder="Cost per box"
          />
        </div>
      </div>

      {/* Data Entry Info */}
      <div>
        <FormInput
          label="Entered By"
          type="text"
          value={formData.assignedBy || user?.name || ''}
          onChange={(value) => setFormData({ ...formData, assignedBy: value as string })}
          error={errors.assignedBy}
          required
          placeholder="Person entering this data"
        />
      </div>

      {/* Auto-calculated totals */}
      {(formData.quantitySold > 0 && formData.itemPrice > 0) || formData.packaging.basins > 0 || formData.packaging.sacks > 0 || formData.packaging.boxes > 0 ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
          {formData.quantitySold > 0 && formData.itemPrice > 0 && (
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Goods Cost:</strong> {formatCurrency(formData.quantitySold * formData.itemPrice)}
            </p>
          )}
          
          <div className="text-sm text-green-800 dark:text-green-200">
            <strong>Packaging Cost:</strong>
            <div className="ml-4 space-y-1">
              {formData.packaging.basins > 0 && (
                <div>Basins: {formData.packaging.basins} × {formatCurrency(formData.packagingCosts.basinCost)} = {formatCurrency(formData.packaging.basins * formData.packagingCosts.basinCost)}</div>
              )}
              {formData.packaging.sacks > 0 && (
                <div>Sacks: {formData.packaging.sacks} × {formatCurrency(formData.packagingCosts.sackCost)} = {formatCurrency(formData.packaging.sacks * formData.packagingCosts.sackCost)}</div>
              )}
              {formData.packaging.boxes > 0 && (
                <div>Boxes: {formData.packaging.boxes} × {formatCurrency(formData.packagingCosts.boxCost)} = {formatCurrency(formData.packaging.boxes * formData.packagingCosts.boxCost)}</div>
              )}
              <div className="font-bold border-t pt-1 mt-1">
                Total Packaging: {formatCurrency(
                  (formData.packaging.basins * formData.packagingCosts.basinCost) +
                  (formData.packaging.sacks * formData.packagingCosts.sackCost) +
                  (formData.packaging.boxes * formData.packagingCosts.boxCost)
                )}
              </div>
            </div>
          </div>
          
          <div className="text-sm font-bold text-green-800 dark:text-green-200 border-t pt-2">
            <strong>Grand Total:</strong> {formatCurrency(
              (formData.quantitySold * formData.itemPrice) +
              (formData.packaging.basins * formData.packagingCosts.basinCost) +
              (formData.packaging.sacks * formData.packagingCosts.sackCost) +
              (formData.packaging.boxes * formData.packagingCosts.boxCost)
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
