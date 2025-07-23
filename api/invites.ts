import axiosInstance from "@/lib/axiosInstance";

export const sendInviteSMS = async (
  eventGroupId: string,
  contacts: { guestName: string; phoneNumber: string }[]
) => {
  try {
    const response = await axiosInstance.post("/invite-sms", {
      eventGroupId,
      contacts,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendInviteWhatsApp = async (
  eventGroupId: string,
  // phoneNumbers: string[],
    contacts: { guestName: string; phoneNumber: string }[]
) => {
  try {
    const response = await axiosInstance.post("/invite-whatsapp", {
      eventGroupId,
      contacts,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendInviteBoth = async (
  eventGroupId: string,
  // phoneNumbers: string[]
  contacts: { guestName: string; phoneNumber: string }[]
) => {
  try {
    const response = await axiosInstance.post("/invite-both", {
      eventGroupId,
      contacts,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};











// import axiosInstance from "@/lib/axiosInstance";

// export const sendInviteSMS = async (eventGroupId: string, phoneNumbers: string[]) => {
//   try {
//     const response = await axiosInstance.post("/invite-sms", { eventGroupId, phoneNumbers });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendInviteWhatsApp = async (eventGroupId: string, phoneNumbers: string[]) => {
//   try {
//     const response = await axiosInstance.post("/invite-whatsapp", { eventGroupId, phoneNumbers });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendInviteBoth = async (eventGroupId: string, phoneNumbers: string[]) => {
//   try {
//     const response = await axiosInstance.post("/invite-both", { eventGroupId, phoneNumbers });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
