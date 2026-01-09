export function getRoute() {
  return window.location.hash || "#/ad/dashboard";
}

export function navigate(hash) {
  if (!hash.startsWith("#/")) hash = "#/" + hash;
  window.location.hash = hash;
}

export function onRouteChange(handler) {
  window.addEventListener("hashchange", handler);
}
