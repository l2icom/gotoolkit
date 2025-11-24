(function () {
  const DEFAULT_WORKER_URL = "https://gotoolkit-share.tranxq.workers.dev";
  const configuredUrl = (window.GO_TOOLKIT_SHARE_API_URL || DEFAULT_WORKER_URL || "").trim().replace(/\/+$/g, "");
  const API_VERSION = "v1";
  const isReady = Boolean(configuredUrl);

  function getShareUrl(collection, token) {
    const encodedCollection = encodeURIComponent(collection);
    const encodedToken = encodeURIComponent(token);
    return `${configuredUrl}/${API_VERSION}/shares/${encodedCollection}/${encodedToken}`;
  }

  function assertReady() {
    if (!isReady) {
      throw new Error("Le service de partage Cloudflare n'est pas configuré.");
    }
  }

  async function fetchSharePayload(collection, token) {
    assertReady();
    const response = await fetch(getShareUrl(collection, token), {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(body || "Accès impossible au partage");
    }
    const data = await response.json();
    return {
      payload: data.payload || null,
      meta: data.meta || null
    };
  }

  async function saveSharePayload(collection, token, payload) {
    assertReady();
    const response = await fetch(getShareUrl(collection, token), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ payload })
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(body || "Impossible de sauvegarder le partage");
    }
    const data = await response.json();
    return data.meta || {};
  }

  window.goToolkitShareWorker = window.goToolkitShareWorker || {
    baseUrl: configuredUrl,
    version: API_VERSION,
    isReady,
    fetchSharePayload,
    saveSharePayload
  };
})();
