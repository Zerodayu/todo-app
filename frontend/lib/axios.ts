import axios from 'axios';

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

export const instance = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  headers: {'x-api-key': apiKey}
});