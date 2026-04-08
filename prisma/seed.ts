import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@medistore.com";
const ADMIN_PASSWORD = "admin123456";

async function seedAdmin() {
  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  // Use better-auth's server-side API to create the user (handles password hashing)
  const result = await auth.api.signUpEmail({
    body: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  });

  if (!result?.user?.id) {
    console.error("Failed to create admin user via auth API.");
    process.exit(1);
  }

  // Update role to ADMIN and mark email as verified
  await prisma.user.update({
    where: { id: result.user.id },
    data: {
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log(`Admin user seeded successfully!`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
}

seedAdmin()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
