import {
  URL_FRONTEND_DEV,
  URL_BACKEND_DEV,
  URL_FRONTEND_PROD,
  URL_BACKEND_PROD,
} from "./constants.js";

export function identifyProtocol() {
  let urlBackend;
  let urlFrontend;
  if (location.protocol == "https:") {
    urlBackend = URL_BACKEND_PROD;
    urlFrontend = URL_FRONTEND_PROD;
  }

  urlBackend = URL_BACKEND_DEV;
  urlFrontend = URL_FRONTEND_DEV;
  return { urlBackend, urlFrontend };
}
