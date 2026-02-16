// lib/mixpanel.ts
import mixpanel from "mixpanel-browser";

const isProd = process.env.NODE_ENV === "production";
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let isInitialized = false;

export const initMixpanel = () => {
  if (typeof window === "undefined") return;

  if (!MIXPANEL_TOKEN) {
    console.warn("Mixpanel token missing");
    return;
  }

  if (isInitialized) return;

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: !isProd,
  });

  isInitialized = true;
};


export const trackEvent = (
  event: string,
  properties?: Record<string, any>
) => {
  try {
    if (typeof window === "undefined") return;
    if (!isInitialized) return;

    mixpanel.track(event, properties);
  } catch (err) {
    console.warn("Mixpanel track failed:", err);
  }
};

export const identifyUser = (
  userIdOrEmail?: string,
  props?: Record<string, any>
) => {
  try {
    if (typeof window === "undefined") return;
    if (!isInitialized) return;
    if (!userIdOrEmail) return;

    const storedId = localStorage.getItem("mixpanel_identified");

    if (storedId === userIdOrEmail) return;

    mixpanel.identify(userIdOrEmail);

    if (props) {
      mixpanel.people.set(props);
    }

    localStorage.setItem("mixpanel_identified", userIdOrEmail);
  } catch (err) {
    console.warn("Mixpanel identify failed:", err);
  }
};
