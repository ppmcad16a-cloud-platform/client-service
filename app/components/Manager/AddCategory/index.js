/**
 *
 * AddCategory
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';

// New-category form, admin-only. Products can be assigned to the category
// right at creation time via the multi-select (Category owns the
// products-array relationship — see server/models/category.js).
const AddCategory = props => {
  const {
    products,
    categoryFormData,
    formErrors,
    categoryChange,
    addCategory
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addCategory();
  };

  return (
    <div className='add-category'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Name'}
              name={'name'}
              placeholder={'Category Name'}
              value={categoryFormData.name}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Description'}
              name={'description'}
              placeholder={'Category Description'}
              value={categoryFormData.description}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <SelectOption
              error={formErrors['products']}
              label={'Select Products'}
              multi={true}
              value={categoryFormData.products}
              options={products}
              handleSelectChange={value => {
                categoryChange('products', value);
              }}
            />
          </Col>
          <Col xs='12' md='12' className='my-2'>
            <Switch
              id={'active-category'}
              name={'isActive'}
              label={'Active?'}
              checked={categoryFormData.isActive}
              toggleCheckboxChange={value => categoryChange('isActive', value)}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-category-actions'>
          <Button type='submit' text='Add Category' />
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
