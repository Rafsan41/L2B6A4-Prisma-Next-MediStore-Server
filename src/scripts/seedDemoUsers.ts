/**
 * Seeds 3 demo accounts for MediStore:
 *   admin@medistore.com    / admin1234
 *   seller@medistore.com   / seller1234
 *   customer@medistore.com / customer1234
 *
 * Run with the server already started on port 5000:
 *   npx tsx src/scripts/seedDemoUsers.ts
 */

import { prisma } from "../lib/prisma.js";
import { auth } from "../lib/auth.js";

const BASE_URL = "http://localhost:5000";
const ORIGIN   = "http://localhost:3000";

const DEMO_USERS = [
  { name: "Admin Demo",    email: "admin@medistore.com",    password: "admin1234",    role: "ADMIN"    },
  { name: "Seller Demo",   email: "seller@medistore.com",   password: "seller1234",   role: "SELLER"   },
  { name: "Customer Demo", email: "customer@medistore.com", password: "customer1234", role: "CUSTOMER" },
];

async function seedDemoUsers() {
  console.log("🌱 Seeding demo users…\n");

  // Get Better Auth's internal context for password hashing
  const ctx = await (auth as any).$context;

  for (const user of DEMO_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });

    if (existing) {
      // Hash the password using Better Auth's own hash function (correct format)
      const hashedPassword = await ctx.password.hash(user.password);

      // Update the credential account's password directly — no user delete needed
      const updated = await prisma.account.updateMany({
        where: { userId: existing.id, providerId: "credential" },
        data: { password: hashedPassword },
      });

      if (updated.count === 0) {
        // No credential account exists yet — create one via sign-up API
        const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Origin: ORIGIN },
          body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
        });
        if (!res.ok) {
          const txt = await res.text();
          console.error(`❌ Could not create credential account for ${user.email}: ${txt}`);
        }
      }

      // Force-update role, status, emailVerified
      await prisma.user.update({
        where: { email: user.email },
        data: {
          role: user.role as any,
          status: "ACTIVE",
          emailVerified: true,
        },
      });

      console.log(`✅ Reset ${user.role}: ${user.email} / ${user.password}`);
      continue;
    }

    // New user — register via auth API
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error(`❌ Failed to create ${user.role}: ${res.status} — ${txt}`);
      continue;
    }

    // Update role + status + emailVerified in DB directly
    await prisma.user.update({
      where: { email: user.email },
      data: {
        role: user.role as any,
        status: "ACTIVE",
        emailVerified: true,
      },
    });

    console.log(`✅ Created ${user.role}: ${user.email} / ${user.password}`);
  }

  console.log("\n🎉 Done! Demo accounts ready.");
  await prisma.$disconnect();
}

seedDemoUsers().catch((e) => { console.error(e); process.exit(1); });
