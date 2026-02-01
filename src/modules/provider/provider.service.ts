import { ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createProviderProfile = async (
  data: Omit<ProviderProfile, "user_id">,
  id: string,
) => {
  const result = await prisma.providerProfile.create({
    data: {
      ...data,
      user_id: id,
    },
  });
  return result;
};

export const providerServices = {
  createProviderProfile,
};
