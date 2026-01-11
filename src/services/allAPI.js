import commonAPI from "./commonAPI"
import serverURL from "./serverURL"


// USER APIs

// register API
export const registerAPI = async (userDetails) => {
   return await commonAPI("POST", `${serverURL}/register`, userDetails)
}

// login api
export const loginAPI = async (userDetails) => {
   return await commonAPI("POST", `${serverURL}/login`, userDetails)
}

// google login
export const googleLoginAPI = async (userDetails) => {
   return await commonAPI("POST", `${serverURL}/google/sign-in`, userDetails)
}


// STORE OWNER APIs

// store owner register (with file uploads)
export const storeOwnerRegisterAPI = async (formData) => {
  return await commonAPI("POST", `${serverURL}/store/register`, formData, {})
}

// store owner login
export const storeOwnerLoginAPI = async (userDetails) => {
  return await commonAPI("POST", `${serverURL}/store/login`, userDetails)
}

// update store profile (with optional image upload, requires token)
export const updateStoreProfileAPI = async (formData, token) => {
  return await commonAPI("PUT", `${serverURL}/store/profile`, formData, {
    'Authorization': `Bearer ${token}`
  })
}

// get all stores (public - no auth required)
export const getAllStoresAPI = async () => {
  return await commonAPI("GET", `${serverURL}/stores`, {}, {})
}

// get store by id (public - no auth required, or with token if needed)
export const getStoreByIdAPI = async (storeId, token = null) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
  return await commonAPI("GET", `${serverURL}/store/${storeId}`, {}, headers)
}


// ADMIN APIs 

// dashboard stats
export const dashboardStatsAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${serverURL}/admin/stats`,  
    "",
    reqHeader
  )
}

// pending stores
export const getPendingStoresAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${serverURL}/admin/pending-stores`,  
    "",
    reqHeader
  )
}

// approved stores
export const getApprovedStoresAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${serverURL}/admin/approved-stores`,  
    "",
    reqHeader
  )
}

// approve store
export const approveStoreAPI = async (storeId, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${serverURL}/admin/approve-store/${storeId}`,  
    "",
    reqHeader
  )
}

// reject store
export const rejectStoreAPI = async (storeId, reason, reqHeader) => {
  return await commonAPI(
    "PUT",
    `${serverURL}/admin/reject-store/${storeId}`,  
    { reason },
    reqHeader
  )
}

// delete store
export const deleteStoreAPI = async (storeId, reqHeader) => {
  return await commonAPI(
    "DELETE",
    `${serverURL}/admin/store/${storeId}`,  
    "",
    reqHeader
  )
}

// recent activity
export const recentActivityAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${serverURL}/admin/recent-activity`,  
    "",
    reqHeader
  )
}

// get all stores - admin view
export const getAllStoresAdminAPI = async (reqHeader) => {
  return await commonAPI(
    "GET",
    `${serverURL}/admin/stores`,  
    "",
    reqHeader
  )
}

// get store by id - admin view
export const getStoreByIdAdminAPI = async (storeId, reqHeader) => {
  return await commonAPI(
    "GET",
    `${serverURL}/admin/store/${storeId}`,  
    "",
    reqHeader
  )
}

// get store profile
export const getStoreProfileAPI = async (token) => {
  return await commonAPI("GET", `${serverURL}/store/profile`, {}, {
    'Authorization': `Bearer ${token}`
  })
}

// ORDER APIs

// create order (public - no auth required, or user token if you have user auth)
export const createOrderAPI = async (orderDetails) => {
  return await commonAPI("POST", `${serverURL}/orders/create`, orderDetails, {})
}

// get store orders (requires store owner token)
export const getStoreOrdersAPI = async (token) => {
  return await commonAPI("GET", `${serverURL}/orders/store`, {}, {
    'Authorization': `Bearer ${token}`
  })
}

// update order status (requires store owner token)
export const updateOrderStatusAPI = async (orderId, status, token) => {
  return await commonAPI("PATCH", `${serverURL}/orders/${orderId}/status`, { status }, {
    'Authorization': `Bearer ${token}`
  })
}

// get order by id (requires store owner token)
export const getOrderByIdAPI = async (orderId, token) => {
  return await commonAPI("GET", `${serverURL}/orders/${orderId}`, {}, {
    'Authorization': `Bearer ${token}`
  })
}

// get single store
export const getSingleStoreAPI = (storeId) => {
  return commonAPI("GET", `${serverURL}/store/${storeId}`);
};
;