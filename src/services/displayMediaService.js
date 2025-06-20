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

export const getMediaById = async (id) => {
  try {
    const response = await api.get(`/display-media/${id}`);
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

// New function to upload photos
export const uploadPhoto = async (
  slug,
  photoBlob,
  text = "",
  mode = "mosaic"
) => {
  try {
    const formData = new FormData();
    formData.append("image", photoBlob, "photo.jpg"); 
    formData.append("text", text);
    formData.append("mode", mode);

    const response = await api.post(`/display-media/upload/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateDisplayMedia = async (id, data) => {
  try {
    const formData = new FormData();

    // Append image if provided
    if (data.image) {
      formData.append("image", data.image);
    }

    // Append text if provided
    if (data.text !== undefined) {
      formData.append("text", data.text);
    }

    const response = await api.put(`/display-media/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteDisplayMedia = async (id) => {
  try {
    const response = await api.delete(`/display-media/${id}`);
    return response.data;
  } catch (err) {
    handleError(err);
  }
};
