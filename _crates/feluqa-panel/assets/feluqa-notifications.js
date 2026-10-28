(() => {
  "use strict";

  const dismiss = (notification) => {
    if (notification.dataset.dismissed === "true") return;
    notification.dataset.dismissed = "true";
    notification.classList.add("");
    window.setTimeout(() => notification.remove(), 320);
  };

  const initialize = (root = document) => {
    root.querySelectorAll("[data-feluqa-notification]").forEach((notification) => {
      if (notification.dataset.initialized === "true") return;
      notification.dataset.initialized = "true";
      const duration = notification.dataset.duration;
      if (duration !== "persistent") {
        const milliseconds = Number.parseInt(duration, 10);
        if (Number.isFinite(milliseconds) && milliseconds > 0) {
          window.setTimeout(() => dismiss(notification), milliseconds);
        }
      }
      notification.classList.remove("");
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const dismissButton = target.closest("[data-dismiss-notification]");
    if (dismissButton) {
      const notification = dismissButton.closest("[data-feluqa-notification]");
      if (notification) dismiss(notification);
      return;
    }
    const action = target.closest("[data-feluqa-notification-action]");
    if (action) {
      action.dispatchEvent(new CustomEvent("feluqa:notification-action", {
        bubbles: true,
        detail: {
          action: action.dataset.feluqaNotificationAction,
          permission: action.dataset.permission,
        },
      }));
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initialize(), { once: true });
  } else {
    initialize();
  }

  document.addEventListener("feluqa:notifications-rendered", (event) => initialize(event.target));
})();
