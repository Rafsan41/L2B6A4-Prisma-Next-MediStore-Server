/**
 * Seeds 3 demo accounts for MediStore directly via Prisma (no server needed):
 *   admin@medistore.com    / admin1234
 *   seller@medistore.com   / seller1234
 *   customer@medistore.com / customer1234
 *
 * Run from anywhere (server does NOT need to be running):
 *   npx tsx src/scripts/seedDemoUsers.ts
 */

import "dotenv/config"
import { prisma } from "../lib/prisma.js"
import { auth }   from "../lib/auth.js"

const DEMO_USERS = [
  { name: "Admin Demo",    email: "admin@medistore.com",    password: "admin1234",    role: "ADMIN"    },
  { name: "Seller Demo",   email: "seller@medistore.com",   password: "seller1234",   role: "SELLER"   },
  { name: "Customer Demo", email: "customer@medistore.com", password: "customer1234", role: "CUSTOMER" },
]

async function seedDemoUsers() {
  console.log("🌱 Seeding demo users directly into DB…\n")

  const ctx = await (auth as any).$context

  for (const u of DEMO_USERS) {
    const hashedPassword = await ctx.password.hash(u.password)

    const existing = await prisma.user.findUnique({ where: { email: u.email } })

    if (existing) {
      // 1. Update password on existing credential account
      const updated = await prisma.account.updateMany({
        where: { userId: existing.id, providerId: "credential" },
        data:  { password: hashedPassword },
      })

      // 2. If no credential account, create one directly
      if (updated.count === 0) {
        await prisma.account.create({
          data: {
            id:           crypto.randomUUID(),
            userId:       existing.id,
            accountId:    existing.id,
            providerId:   "credential",
            password:     hashedPassword,
            createdAt:    new Date(),
            updatedAt:    new Date(),
          },
        })
      }

      // 3. Force role / status / verified
      await prisma.user.update({
        where: { email: u.email },
        data:  { role: u.role as any, status: "ACTIVE", emailVerified: true },
      })

      console.log(`✅ Reset   ${u.role.padEnd(8)} ${u.email}`)
    } else {
      // Brand-new user — create user + account in one go
      const userId = crypto.randomUUID()

      await prisma.user.create({
        data: {
          id:            userId,
          name:          u.name,
          email:         u.email,
          role:          u.role as any,
          status:        "ACTIVE",
          emailVerified: true,
          createdAt:     new Date(),
          updatedAt:     new Date(),
        },
      })

      await prisma.account.create({
        data: {
          id:         crypto.randomUUID(),
          userId:     userId,
          accountId:  userId,
          providerId: "credential",
          password:   hashedPassword,
          createdAt:  new Date(),
          updatedAt:  new Date(),
        },
      })

      console.log(`✅ Created ${u.role.padEnd(8)} ${u.email}`)
    }
  }

  console.log("\n🎉 Done! Demo accounts ready.")
  await prisma.$disconnect()
}

seedDemoUsers().catch((e) => { console.error(e); process.exit(1) })
