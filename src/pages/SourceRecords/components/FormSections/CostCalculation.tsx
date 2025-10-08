import React from 'react';
import { formatCurrency } from '../../../../../utils/helpers';

interface CostCalculationProps {
  formData: any;
}

export const CostCalculation: React.FC<CostCalculationProps> = ({ formData }) => {
  const goodsCost = (formData.quantitySold || 0) * (formData.itemPrice || 0);
  const packagingCost = 
    ((formData.packaging?.basins || 0) * (formData.packagingCosts?.basinCost || 0)) +
    ((formData.packaging?.sacks || 0) * (formData.packagingCosts?.sackCost || 0)) +
    ((formData.packaging?.boxes || 0) * (formData.packagingCosts?.boxCost || 0));
  
  const grandTotal = goodsCost + packagingCost;

  if (goodsCost === 0 && packagingCost === 0) return null;

  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
      {goodsCost > 0 && (
        <p className="text-sm text-green-800 dark:text-green-200">
          <strong>Goods Cost:</strong> {formatCurrency(goodsCost)}
        </p>
      )}
      
      {packagingCost > 0 && (
        <div className="text-sm text-green-800 dark:text-green-200">
          <strong>Packaging Cost:</strong>
          <div className="ml-4 space-y-1">
            {(formData.packaging?.basins?.basins || 0) > 0 && (
              <div>Basins: {formData.packaging.basins} × {formatCurrency(formData.packagingCosts?.basinCost || 0)} = {formatCurrency((formData.packaging.basins * (formData.packagingCosts?.basinCost || 0)))}</div>
            )}
            {(formData.packaging?.sacks || 0) > 0 && (
              <div>Sacks: {formData.packaging.sacks} × {formatCurrency(formData.packagingCosts?.sackCost || 0)} = {formatCurrency((formData.packaging.sacks * (formData.packagingCosts?.sackCost || 0)))}</div>
            )}
            {(formData.packaging?.boxes || 0) > 0 && (
              <div>Boxes: {formData.packaging.boxes} × {formatCurrency(formData.packagingCosts?.boxCost || 0)} = {formatCurrency((formData.packaging.boxes * (formData.packagingCosts?.boxCost || 0)))}</div>
            )}
            <div className="font-bold border-t pt-1 mt-1">
              Total Packaging: {formatCurrency(packagingCost)}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm font-bold text-green-800 dark:text-green-200 border-t pt-2">
        <strong>Grand Total:</strong> {formatCurrency(grandTotal)}
      </div>
    </div>
  );
};
