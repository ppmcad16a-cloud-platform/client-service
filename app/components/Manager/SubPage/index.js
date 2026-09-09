/**
 *
 * SubPage
 *
 */

import React from 'react';

import Button from '../../Common/Button';

// Generic dashboard sub-page shell: a title bar with an optional single
// action button (e.g. "Add Product"), wrapping whatever `children` the
// specific page renders.
const SubPage = props => {
  const { title, actionTitle, handleAction, children } = props;

  return (
    <div className='sub-page'>
      <div className='subpage-header'>
        <h3 className='mb-0'>{title}</h3>
        {actionTitle && (
          <div className='action'>
            <Button
              variant='none'
              size='sm'
              text={actionTitle}
              onClick={handleAction}
            />
          </div>
        )}
      </div>
      <div className='subpage-body'>{children}</div>
    </div>
  );
};

export default SubPage;
