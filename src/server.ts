import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connect to the db successfully");

    app.listen(port, () => {
      console.log(`Server is running on port, ${port}`);
    });
  } catch (err) {
    console.log("An error ocured!!", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
