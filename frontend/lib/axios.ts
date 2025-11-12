import axios from 'axios';

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {'x-api-key': apiKey}
});