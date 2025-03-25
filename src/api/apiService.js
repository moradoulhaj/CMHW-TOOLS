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
    const response = await axiosInstance.put("/session/updateMultipleStatus", sessionsStatus); // Adjust the endpoint if needed
    return response.data;
  } catch (error) {
    console.error("Error updating session statuses:", error);
    throw error;
  }
};
//Update entity time drops 

export const updateEntity = async (entityId , entityInfos) => {
  try {
    const response = await axiosInstance.put(`/dep/${entityId}`, entityInfos); 
    return response.data;
  } catch (error) {
    console.error("Error updating session statuses:", error);
    throw error;
  }
};