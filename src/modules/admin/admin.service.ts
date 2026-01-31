import { UserStatus } from "../../enum/userStatus";
import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
  const allUser = await prisma.user.findMany({
    include: {
      providerProfile: true,
    },
  });
  return allUser;
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  console.log("id", id, "status", status);
  const updateUser = await prisma.user.update({
    where: { id },
    data: { status },
  });
  return updateUser;
};

export const adminServices = {
  getAllUser,
  updateUserStatus,
};
