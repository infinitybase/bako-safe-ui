import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  description: yup.string().optional(),
});

export default schema;
