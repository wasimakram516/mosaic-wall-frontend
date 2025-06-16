import api from "./api";

const handleError = (err) => {
  throw (
    err.response?.data?.message || err.message || "An unknown error occurred"
  );
};

export const getDisplayMedia = async () => {
  try {
    const response = await api.get("/display-media");
    return response.data;
  } catch (err) {
    handleError(err);
  }
};
