import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
  };

  try {
    const response = await axios(reqConfig);
    return response;
  } catch (error) {
    // ✅ ALWAYS throw error so frontend catch() works
    throw error;
  }
};

export default commonAPI;
