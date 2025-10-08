import React from 'react';
import { FormInput } from '../../../../../components/FormInput';
import { formatCurrency } from '../../../../../utils/helpers';

interface PackagingInfoProps {
  formData: any;
  setFormData: any;
  errors: Record<string, string>;
}

export const PackagingInfo: React.FC<PackagingInfoProps> = ({ formData, setFormData, errors }) => {
  const totalPackagingCost = 
    (formData.packaging?.basins || 0) * (formData.packagingCosts?.basinCost || 0) +
    (formData.packaging?.sacks || 0) * (formData.packagingCosts?.sackCost || 0) +
    (formData.packaging?.boxes || 0) * (formData.packagingCosts?.boxCost || 0);

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Packaging Details</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FormInput
          label="Basins"
          type="number"
          value={formData.packaging?.basins || 0}
          onChange={(value) => setFormData({
            ...formData,
            packaging: { ...formData.packaging, basins: value as number }
          })}
          placeholder="Number of basins"
        />

        <FormInput
          label="Sacks"
          type="number"
          value={formData.packaging?.sacks || 0}
          onChange={(value) => setFormData({
            ...formData,
            packaging: { ...formData.packaging, sacks: value as number }
          })}
          placeholder="Number of sacks"
        />

        <FormInput
          label="Boxes"
          type="number"
          value={formData.packaging?.boxes || 0}
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
          value={formData.packagingCosts?.basinCost || 0}
          onChange={(value) => setFormData({
            ...formData,
            packagingCosts: { ...formData.packagingCosts, basinCost: value as number }
          })}
          placeholder="Cost per basin"
        />

        <FormInput
          label="Sack Cost (each)"
          type="number"
          value={formData.packagingCosts?.sackCost || 0}
          onChange={(value) => setFormData({
            ...formData,
            packagingCosts: { ...formData.packagingCosts, sackCost: value as number }
          })}
          placeholder="Cost per sack"
        />

        <FormInput
          label="Box Cost (each)"
          type="number"
          value={formData.packagingCosts?.boxCost || 0}
          onChange={(value) => setFormData({
            ...formData,
            packagingCosts: { ...formData.packagingCosts, boxCost: value as number }
          })}
          placeholder="Cost per box"
        />
      </div>

      {/* Packaging Cost Summary */}
      {totalPackagingCost > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Total Packaging Cost:</strong> {formatCurrency(totalPackagingCost)}
          </div>
        </div>
      )}
    </div>
  );
};
