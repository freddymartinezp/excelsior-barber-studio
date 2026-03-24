import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    name: "Haircut",
    slug: "haircut",
    description: "Classic or modern cut tailored to your style. Includes wash and finish.",
    price: 3000,
    durationMinutes: 30,
  },
  {
    name: "Skin Fade",
    slug: "skin-fade",
    description: "Precision skin fade with clean lines and seamless blending.",
    price: 3500,
    durationMinutes: 45,
  },
  {
    name: "Haircut + Beard Trim",
    slug: "haircut-beard-trim",
    description: "Full haircut paired with a shaped and defined beard trim.",
    price: 4500,
    durationMinutes: 45,
  },
  {
    name: "Beard Shape Up",
    slug: "beard-shape-up",
    description: "Clean lines, sharp edges, and a sculpted beard profile.",
    price: 2000,
    durationMinutes: 20,
  },
  {
    name: "Full Shave",
    slug: "full-shave",
    description: "Traditional straight-razor shave with hot towel treatment.",
    price: 4000,
    durationMinutes: 45,
  },
  {
    name: "Hair Design / Line Art",
    slug: "hair-design",
    description: "Custom hair designs and line art by our specialty artists.",
    price: 5000,
    durationMinutes: 60,
  },
  {
    name: "Kids Cut (Under 12)",
    slug: "kids-cut",
    description: "Precision cuts for the young kings. Same quality, kid-friendly experience.",
    price: 2000,
    durationMinutes: 30,
  },
];

const barbers = [
  {
    name: "Gabriel Cutz",
    slug: "gabriel-cutz",
    bio: "8 years in the game, Gabriel is known for his clean skin fades and sharp line work. He brings precision and energy to every chair.",
    specialties: "Skin Fades,Line Art,Classic Cuts",
    photo: "/barbers/gabriel-cutz.jpg",
  },
  {
    name: "Barber 2",
    slug: "barber-2",
    bio: "Barber 2 specializes in textured cuts and modern styles. His attention to detail and client-first approach make him a top request at the shop.",
    specialties: "Textured Cuts,Beard Shaping,Modern Styles",
    photo: "https://placehold.co/400x500/0D1117/C41E3A?text=Barber+2",
  },
  {
    name: "Barber 3",
    slug: "barber-3",
    bio: "With a background in traditional barbering and a love for contemporary design, Barber 3 delivers clean, confident looks every time.",
    specialties: "Traditional Cuts,Hair Design,Fades",
    photo: "https://placehold.co/400x500/0D1117/C41E3A?text=Barber+3",
  },
  {
    name: "Barber 4",
    slug: "barber-4",
    bio: "Barber 4 is the beard specialist. Whether it's a full sculpt or a tight shape-up, he transforms your beard into a statement.",
    specialties: "Beard Sculpting,Shape Ups,Straight Razor Shaves",
    photo: "https://placehold.co/400x500/0D1117/C41E3A?text=Barber+4",
  },
];

async function main() {
  console.log("🌱 Seeding Excelsior Barber Studio database...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.barberService.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.timeOff.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();

  // Create services
  const createdServices = await Promise.all(
    services.map((s) =>
      prisma.service.create({ data: s })
    )
  );
  console.log(`✅ Created ${createdServices.length} services`);

  // Create barbers with availability rules and service links
  for (const barberData of barbers) {
    const barber = await prisma.barber.create({
      data: {
        ...barberData,
        // Mon-Sun availability 9am-7pm
        availabilityRules: {
          create: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "19:00",
          })),
        },
        // Link to all services
        services: {
          create: createdServices.map((s) => ({
            serviceId: s.id,
          })),
        },
      },
    });
    console.log(`✅ Created barber: ${barber.name}`);
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
