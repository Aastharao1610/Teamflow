import prisma from "./lib/prisma";

async function main() {
  await prisma.$connect();
  console.log("Prisma connected successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
