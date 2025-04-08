import * as yup from 'yup';

const envSchema = yup.object().shape({
  BASE_API_URL: yup.string().url().required(),
});

const env = envSchema.cast({
  BASE_API_URL: import.meta.env.VITE_API_URL,
});

export default env;
