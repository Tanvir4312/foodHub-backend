import { prisma } from "../../lib/prisma";

const updateCustomerProfile = async (
  id: string,
  payload: {
    image?: string;
    name?: string;
    phone_number?: string;
  } = {},
) => {
  return await prisma.user.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.image && { image: payload.image }),
      ...(payload.phone_number && { phone_number: payload.phone_number }),
    },
  });
};

export const customerservices = {
  updateCustomerProfile,
};
