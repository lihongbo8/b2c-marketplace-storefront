'use client';

import { Button } from '@/components/atoms';
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { ReportListingForm } from '../ReportListingForm/ReportListingForm';

export const ProductReportButton = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        className='label-md'
        variant='tonal'
        onClick={() => setOpenModal(true)}
      >
        举报异常
      </Button>
      {openModal && (
        <Modal
          heading='举报异常'
          onClose={() => setOpenModal(false)}
        >
          <ReportListingForm
            onClose={() => setOpenModal(false)}
          />
        </Modal>
      )}
    </>
  );
};
