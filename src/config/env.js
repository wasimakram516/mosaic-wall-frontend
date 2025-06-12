const env = {
  server: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  },
  node_env: process.env.NODE_ENV,
};

export default env;
