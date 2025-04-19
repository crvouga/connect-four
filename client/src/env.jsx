// TODO: put this in an env var
const REACT_APP_BACKEND_BASE_URL =
  "https://crvouga-connect-four.herokuapp.com/";
// process.env.REACT_APP_BACKEND_BASE_URL;

if (!REACT_APP_BACKEND_BASE_URL) {
  throw new Error("process.env.REACT_APP_BACKEND_BASE_URL is undefined");
}

const developmentBackendBaseUrl = "http://localhost:9000";

export const env = {
  REACT_APP_BACKEND_BASE_URL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_BASE_URL
      : developmentBackendBaseUrl,
};
