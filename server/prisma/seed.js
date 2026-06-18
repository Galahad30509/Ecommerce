const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
  {
    title: 'Minimal Canvas Tote',
    description: 'A sturdy daily tote with clean stitching and roomy storage.',
    price: 590,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Everyday Sneakers',
    description: 'Comfortable sneakers for city walks, work days, and weekends.',
    price: 1890,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Classic Denim Jacket',
    description: 'A timeless layer with durable denim and a relaxed fit.',
    price: 2490,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Desk Ceramic Mug',
    description: 'A balanced ceramic mug for coffee, tea, and late-night coding.',
    price: 320,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Leather Card Holder',
    description: 'Slim card storage with a refined texture and compact profile.',
    price: 790,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Travel Water Bottle',
    description: 'A reusable bottle with a leak-resistant lid and matte finish.',
    price: 650,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  },
];

async function ensureProduct(product) {
  const existing = await prisma.product.findFirst({
    where: { title: product.title },
  });

  if (existing) {
    return prisma.product.update({
      where: { id: existing.id },
      data: { ...product, isDeleted: false },
    });
  }

  return prisma.product.create({ data: product });
}

async function main() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      name: 'Demo User',
      password,
      role: 'USER',
    },
    create: {
      name: 'Demo User',
      email: 'user@example.com',
      password,
      role: 'USER',
    },
  });

  for (const product of products) {
    await ensureProduct(product);
  }

  console.log('Seed complete');
  console.log('Admin: admin@example.com / password123');
  console.log('User: user@example.com / password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
