import { prisma } from "../../lib/prisma";

const getOwnUserData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include : {
        providerProfile : true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const userServices = {
  getOwnUserData,
};
