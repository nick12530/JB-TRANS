import React from 'react';
import { Modal } from '../../../../components/Modal';
import { FormInput } from '../../../../components/FormInput';
import { BasicInfo } from './FormSections/BasicInfo';
import { DriverVehicleInfo } from './FormSections/DriverVehicleInfo';
import { PackagingInfo } from './FormSections/PackagingInfo';
import { CostCalculation } from './FormSections/CostCalculation';
import { SourceRecord } from '../../../../types';

interface SourceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<SourceRecord, 'id' | 'totalCost' | 'totalPackagingCost'>>>;
  errors: Record<string, string>;
  editingRecord: SourceRecord | null;
  user: any;
}

export const SourceRecordModal: React.FC<SourceRecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors,
  editingRecord,
  user,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRecord ? 'Edit Source Record' : 'Add Source Record'}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <BasicInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <DriverVehicleInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <PackagingInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

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

        <CostCalculation formData={formData} />

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editingRecord ? 'Update Record' : 'Add Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
