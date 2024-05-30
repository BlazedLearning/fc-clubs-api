import fetch from 'node-fetch';
import { Agent } from 'https';

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const customFetch = (url: string, options?: any) => {
  return fetch(url, { ...options, agent: httpsAgent });
};

export default customFetch;
