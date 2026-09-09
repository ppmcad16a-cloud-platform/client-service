/**
 *
 * select.js
 * this helper formulate data into select options
 *
 * Converts between the API's { _id, name } shape and react-select's
 * { value, label } shape.
 */

// `from` is accepted but unused — appears to be a leftover debugging
// parameter from call sites that pass a label like 'fetchProduct'.
export const formatSelectOptions = (data, empty = false, from) => {
  let newSelectOptions = [];

  if (data && data.length > 0) {
    data.map(option => {
      let newOption = {};
      newOption.value = option._id;
      newOption.label = option.name;
      newSelectOptions.push(newOption);
    });
  }

  if (empty) {
    const emptyOption = {
      value: 0,
      label: 'No option selected'
    };
    newSelectOptions.unshift(emptyOption);
  }

  return newSelectOptions;
};

// Inverse of formatSelectOptions: pulls just the raw ids back out of a list
// of { value, label } options. (The intermediate `newOption` object is
// built and then only its `_id` is used — result is a plain array of ids,
// not an array of objects.)
export const unformatSelectOptions = data => {
  if (!data) return null;

  let newSelectOptions = [];

  if (data && data.length > 0) {
    data.map(option => {
      let newOption = {};
      newOption._id = option.value;
      newSelectOptions.push(newOption._id);
    });
  }

  return newSelectOptions;
};
