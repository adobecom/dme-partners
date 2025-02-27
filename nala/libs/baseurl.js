/* eslint-disable */
import pkg from 'axios';

const { head } = pkg;
export async function isBranchURLValid(url, includeAuthorization = false) {
  const headers = includeAuthorization ? { Authorization: `token ${process.env.MILO_AEM_API_KEY}` } : {};
  const response = await head(url, { headers });
  try {
    const response = await head(url);
    if (response.status === 200) {
      console.info(`\nURL (${url}) returned a 200 status code. It is valid.`);
      return true;
    } else {
      console.info(`\nURL (${url}) returned a non-200 status code (${response.status}). It is invalid.`);
      return false;
    }
  } catch (error) {
    console.info(`\nError checking URL (${url}): returned a non-200 status code (${response.status})`);
    return false;
  }
}
