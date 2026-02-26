import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Tanvirul Islam",
      email: "tanvirulislam@gmail.com",
      role: UserRole.ADMIN,
      password: "Admin123456",
    };

    // Check user exist in db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User Exist");
    }
    await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:5000",
      },
      body: JSON.stringify(adminData),
    });
  } catch (err) {
    console.log(err);
  }
}
seedAdmin();
