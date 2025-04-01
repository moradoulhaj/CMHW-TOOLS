import axiosInstance from "./axiosInstance";

// Fetch all entities
export const fetchEntities = async () => {
  try {
    const response = await axiosInstance.get("/dep"); // Adjust endpoint if needed
    return response.data;
  } catch (error) {
    console.error("Error fetching entities:", error);
    throw error;
  }
};

// Fetch details for a specific entity
export const fetchEntityId = async (entityId) => {
  try {
    const response = await axiosInstance.get(`/dep/${entityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entity details:", error);
    throw error;
  }
};

// Update multiple session statuses
export const updateSessionStatuses = async (sessionsStatus) => {
  try {
    const response = await axiosInstance.put(
      "/session/updateMultipleStatus",
      sessionsStatus
    ); // Adjust the endpoint if needed
    return response.data;
  } catch (error) {
    console.error("Error updating session statuses:", error);
    throw error;
  }
};
//Update entity time drops

export const updateEntity = async (entityId, entityInfos) => {
  try {
    const response = await axiosInstance.put(`/dep/${entityId}`, entityInfos);
    return response.data;
  } catch (error) {
    console.error("Error updating session statuses:", error);
    throw error;
  }
};
// Fetch sessions by ID entity

export const fetchSessions = async (entityId) => {
  try {
    const response = await axiosInstance.get(`/session/getByDepId/${entityId}`);
    return response.data;
  } catch (error) {
    console.error("Error updating session statuses:", error);
    throw error;
  }
};

// to delete session

export const deleteSession = async (sessionId) => {
  try {
    const response = await axiosInstance.delete(`/session/delete/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error updating session statuses:", error);
    throw error;
  }
};


// to create session

export const createSession = async (sessionData) => {
  try {
    const response = await axiosInstance.post(`/session/create`,sessionData);
    return response.data;
  } catch (error) {
    console.error("Error creating session :", error);
    throw error;
  }
};


// to update session

export const updateSession = async (sessionId,sessionData) => {
  try {
    const response = await axiosInstance.put(`/session/update/${sessionId}`,sessionData);
    return response.data;
  } catch (error) {
    console.error("Error updating session :", error);
    throw error;
  }
};
