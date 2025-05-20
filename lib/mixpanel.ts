// lib/mixpanel.ts
import mixpanel from "mixpanel-browser";

const isProd = process.env.NODE_ENV === "production";

// Optional: enable debug mode in dev
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
    console.log("Initializing Mixpanel with token:", MIXPANEL_TOKEN); 
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: !isProd,
    });
  }else{
    console.warn("mixpanel init failed")
  }
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    mixpanel.track(event, properties);
  }
};

export const identifyUser = (userIdOrEmail?: string, props?: Record<string, any>) => {
  if (typeof window === "undefined" || !userIdOrEmail) return;

  const currentDistinctId = mixpanel.get_distinct_id();
  const storedId = localStorage.getItem("mixpanel_identified");

  if (storedId === userIdOrEmail) {
    // Already identified in this session
    return;
  }

  // Optional: alias if this is the first time seeing this user
  if (currentDistinctId !== userIdOrEmail) {
    mixpanel.alias(userIdOrEmail);
  }

  // Identify and set properties
  mixpanel.identify(userIdOrEmail);

  if (props) {
    mixpanel.people.set(props);
  }

  // Prevent re-identification in the same session
  localStorage.setItem("mixpanel_identified", userIdOrEmail);
};
