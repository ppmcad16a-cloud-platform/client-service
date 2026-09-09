import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MerchantList from 'app/components/Manager/MerchantList';
import { MERCHANT_STATUS } from 'app/constants';

const baseMerchant = {
  _id: '1',
  business: 'Acme Co',
  brandName: 'Acme',
  name: 'Jane Doe',
  phoneNumber: '1234567890',
  created: '2024-01-01T00:00:00.000Z'
};

const renderIt = merchant =>
  render(
    <MerchantList
      merchants={[merchant]}
      approveMerchant={vi.fn()}
      rejectMerchant={vi.fn()}
      deleteMerchant={vi.fn()}
      disableMerchant={vi.fn()}
    />
  );

it('shows N/A when the merchant has no email', () => {
  renderIt({ ...baseMerchant, email: '', status: MERCHANT_STATUS.Waiting_Approval });
  expect(screen.getByText('N/A')).toBeInTheDocument();
});

it('shows the email when present', () => {
  renderIt({ ...baseMerchant, email: 'jane@example.com', status: MERCHANT_STATUS.Waiting_Approval });
  expect(screen.getByText('jane@example.com')).toBeInTheDocument();
});

describe('Approved status', () => {
  it('shows a delete button and a disable-merchant popover when active', () => {
    const deleteMerchant = vi.fn();
    const disableMerchant = vi.fn();
    render(
      <MerchantList
        merchants={[{ ...baseMerchant, status: MERCHANT_STATUS.Approved, isActive: true }]}
        approveMerchant={vi.fn()}
        rejectMerchant={vi.fn()}
        deleteMerchant={deleteMerchant}
        disableMerchant={disableMerchant}
      />
    );

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Disable Merchant')).toBeInTheDocument();

    fireEvent.click(document.getElementById('tooltip-delete-1'));
    expect(deleteMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));
  });

  it('offers to enable a disabled (isActive=false) merchant, and disableMerchant flips the flag', () => {
    const disableMerchant = vi.fn();
    render(
      <MerchantList
        merchants={[{ ...baseMerchant, status: MERCHANT_STATUS.Approved, isActive: false }]}
        approveMerchant={vi.fn()}
        rejectMerchant={vi.fn()}
        deleteMerchant={vi.fn()}
        disableMerchant={disableMerchant}
      />
    );

    expect(screen.getByText('Enable Merchant')).toBeInTheDocument();
  });
});

describe('Rejected status', () => {
  it('shows re-approve and delete actions', () => {
    const approveMerchant = vi.fn();
    const deleteMerchant = vi.fn();
    render(
      <MerchantList
        merchants={[{ ...baseMerchant, status: MERCHANT_STATUS.Rejected }]}
        approveMerchant={approveMerchant}
        rejectMerchant={vi.fn()}
        deleteMerchant={deleteMerchant}
        disableMerchant={vi.fn()}
      />
    );

    fireEvent.click(document.getElementById('tooltip-re-approve-1'));
    expect(approveMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));

    fireEvent.click(document.getElementById('tooltip-delete-1'));
    expect(deleteMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));
  });
});

describe('Waiting_Approval status', () => {
  it('shows approve/reject/delete when an email is present', () => {
    const approveMerchant = vi.fn();
    const rejectMerchant = vi.fn();
    const deleteMerchant = vi.fn();
    render(
      <MerchantList
        merchants={[{ ...baseMerchant, email: 'jane@example.com', status: MERCHANT_STATUS.Waiting_Approval }]}
        approveMerchant={approveMerchant}
        rejectMerchant={rejectMerchant}
        deleteMerchant={deleteMerchant}
        disableMerchant={vi.fn()}
      />
    );

    fireEvent.click(document.getElementById('tooltip-approve-1'));
    expect(approveMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));

    fireEvent.click(document.getElementById('tooltip-reject-1'));
    expect(rejectMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));

    fireEvent.click(document.getElementById('tooltip-delete-1'));
    expect(deleteMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));
  });

  it('shows a call-them hint with only delete when there is no email', () => {
    const deleteMerchant = vi.fn();
    render(
      <MerchantList
        merchants={[{ ...baseMerchant, email: '', status: MERCHANT_STATUS.Waiting_Approval }]}
        approveMerchant={vi.fn()}
        rejectMerchant={vi.fn()}
        deleteMerchant={deleteMerchant}
        disableMerchant={vi.fn()}
      />
    );

    expect(screen.getByText(/Call at/)).toBeInTheDocument();
    fireEvent.click(document.getElementById('tooltip-delete-1'));
    expect(deleteMerchant).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));
  });
});
