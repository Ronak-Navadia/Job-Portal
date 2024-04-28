import * as Yup from 'yup';

export const ApplicationModalSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email().matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please Enter a Valid Email Address').required('Email is required'),
  pan_number: Yup.string()
    .matches(/[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/, 'Please Enter a Valid PAN Number')
    .required('PAN Number is Required'),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Please Enter a Valid 10-Digit Mobile Number').required('Mobile Number is Required'),
  education: Yup.string().required('Education details are required'),
  ctc: Yup.string().required('Current CTC is required'),
  expected_ctc: Yup.string().required('Expected CTC is required'),
  notice_period: Yup.number()
    .integer('Notice period must be an integer')
    .positive('Notice period must be a positive number')
    .max(365, 'Notice period cannot exceed 365 days')
    .required('Notice period is required'),
  total_work_experience: Yup.number()
  .typeError('Total work experience must be a number')
  .required('Total work experience is required')
  .positive('Total work experience must be a positive number'),
  gender: Yup.string().required('Gender is required').oneOf(['male', 'female', 'others'], 'Gender is required'),
  state: Yup.string().required('State is required'),
});
