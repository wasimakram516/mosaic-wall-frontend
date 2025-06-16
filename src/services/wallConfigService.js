import api from "./api";

const handleError = (err) => {
  throw (
    err.response?.data?.message || err.message || "An unknown error occurred"
  );
};

export const getWallConfigs = async () => {
  try {
    const response = await api.get("/wall-configs");
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const getWallConfigBySlug = async (slug) => {
  try {
    const response = await api.get(`/wall-configs/slug/${slug}`);
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const createWallConfig = async (data) => {
  try {
    const response = await api.post("/wall-configs", data);
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateWallConfig = async (id, data) => {
  try {
    console.log("Service:", data);
    const response = await api.put(`/wall-configs/${id}`, data);
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteWallConfig = async (id) => {
  try {
    const response = await api.delete(`/wall-configs/${id}`);
    return response.data;
  } catch (err) {
    handleError(err);
  }
};
