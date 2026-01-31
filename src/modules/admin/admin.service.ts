import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
  const allUser = await prisma.user.findMany({
    include: {
      providerProfile: true,
    },
  });
  return allUser;
};

export const adminServices = {
  getAllUser,
};
