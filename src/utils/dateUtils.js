export const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
  
    return new Date(dateString).toLocaleString("en-US", {
      ...defaultOptions,
      ...options,
    });
  };
  