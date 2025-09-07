import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear organización por defecto
  const organization = await prisma.organization.upsert({
    where: { id: 'default-org' },
    update: {},
    create: {
      id: 'default-org',
      name: 'Asociación Cristiana ArkaOne',
      description: 'Organización matriz para todas las iglesias ArkaOne',
      address: 'Oficina Central, Calle Principal 100',
      phone: '+1234567800',
      email: 'admin@arkaone.org',
      website: 'https://arkaone.org',
    },
  });

  console.log('✅ Organización creada:', organization.name);

  // Crear iglesias de ejemplo
  const church1 = await prisma.church.upsert({
    where: { id: 'church-shalom' },
    update: {},
    create: {
      id: 'church-shalom',
      name: 'Iglesia Shalom',
      address: 'Av. Las Américas, Mérida',
      phone: '+1234567890',
      email: 'contacto@shalom.arkaone.org',
      pastor: 'Pastor Juan Martínez',
      description: 'Iglesia Shalom - Sucursal Mérida',
      organizationId: organization.id,
    },
  });

  const church2 = await prisma.church.upsert({
    where: { id: 'church-fuente' },
    update: {},
    create: {
      id: 'church-fuente',
      name: 'Fuente de Agua Viva',
      address: 'Calle 60, Centro Histórico, Mérida',
      phone: '+1234567891',
      email: 'contacto@fuente.arkaone.org',
      pastor: 'Pastora María López',
      description: 'Iglesia Fuente de Agua Viva - Sucursal Centro',
      organizationId: organization.id,
    },
  });

  console.log('✅ Iglesias creadas:', church1.name, 'y', church2.name);

  // Crear usuario administrador de organización
  const hashedPassword = await bcrypt.hash('changeme', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@arkaone.local' },
    update: {},
    create: {
      email: 'admin@arkaone.local',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'ArkaOne',
      role: 'ADMIN',
      organizationId: organization.id,
      churchId: church1.id, // Iglesia principal por defecto
    },
  });

  // Crear accesos a ambas iglesias para el admin
  await Promise.all([
    prisma.userChurchAccess.upsert({
      where: {
        userId_churchId: {
          userId: adminUser.id,
          churchId: church1.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        churchId: church1.id,
        role: 'ADMIN',
      },
    }),
    prisma.userChurchAccess.upsert({
      where: {
        userId_churchId: {
          userId: adminUser.id,
          churchId: church2.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        churchId: church2.id,
        role: 'ADMIN',
      },
    }),
  ]);

  console.log('✅ Usuario admin creado:', adminUser.email);

  // Crear algunos ministerios de ejemplo para ambas iglesias
  const ministries = await Promise.all([
    // Ministerios para Iglesia Shalom
    prisma.ministry.upsert({
      where: { id: 'worship-ministry-shalom' },
      update: {},
      create: {
        id: 'worship-ministry-shalom',
        name: 'Ministerio de Alabanza',
        description: 'Ministerio encargado de la música y adoración',
        leader: 'Director Musical',
        churchId: church1.id,
      },
    }),
    prisma.ministry.upsert({
      where: { id: 'youth-ministry-shalom' },
      update: {},
      create: {
        id: 'youth-ministry-shalom',
        name: 'Ministerio Juvenil',
        description: 'Ministerio para jóvenes de 13 a 25 años',
        leader: 'Pastor de Jóvenes',
        churchId: church1.id,
      },
    }),
    // Ministerios para Fuente de Agua Viva
    prisma.ministry.upsert({
      where: { id: 'worship-ministry-fuente' },
      update: {},
      create: {
        id: 'worship-ministry-fuente',
        name: 'Ministerio de Alabanza',
        description: 'Ministerio encargado de la música y adoración',
        leader: 'Directora Musical',
        churchId: church2.id,
      },
    }),
    prisma.ministry.upsert({
      where: { id: 'children-ministry-fuente' },
      update: {},
      create: {
        id: 'children-ministry-fuente',
        name: 'Ministerio Infantil',
        description: 'Ministerio para niños de 3 a 12 años',
        leader: 'Maestra Principal',
        churchId: church2.id,
      },
    }),
  ]);

  console.log('✅ Ministerios creados:', ministries.length);

  // Crear algunos miembros de ejemplo para ambas iglesias
  const members = await Promise.all([
    // Miembros de Iglesia Shalom
    prisma.member.create({
      data: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+1234567891',
        address: 'Calle Secundaria 456',
        birthDate: new Date('1985-05-15'),
        status: 'MEMBER',
        churchId: church1.id,
      },
    }),
    prisma.member.create({
      data: {
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
        phone: '+1234567892',
        address: 'Avenida Principal 789',
        birthDate: new Date('1990-08-22'),
        baptismDate: new Date('2010-12-25'),
        status: 'MEMBER',
        churchId: church1.id,
      },
    }),
    // Miembros de Fuente de Agua Viva
    prisma.member.create({
      data: {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@example.com',
        phone: '+1234567893',
        status: 'VISITOR',
        churchId: church2.id,
      },
    }),
    prisma.member.create({
      data: {
        firstName: 'Ana',
        lastName: 'Martín',
        email: 'ana.martin@example.com',
        phone: '+1234567894',
        address: 'Calle 62, Centro',
        birthDate: new Date('1988-03-10'),
        status: 'MEMBER',
        churchId: church2.id,
      },
    }),
  ]);

  console.log('✅ Miembros creados:', members.length);

  // Crear reuniones de ejemplo para ambas iglesias
  const meeting1 = await prisma.meeting.create({
    data: {
      title: 'Servicio Dominical - Shalom',
      description: 'Servicio principal de adoración',
      date: new Date(),
      type: 'SUNDAY_SERVICE',
      location: 'Santuario Principal',
      churchId: church1.id,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      title: 'Servicio Dominical - Fuente',
      description: 'Servicio principal de adoración',
      date: new Date(),
      type: 'SUNDAY_SERVICE',
      location: 'Salón Principal',
      churchId: church2.id,
    },
  });

  console.log('✅ Reuniones creadas:', meeting1.title, 'y', meeting2.title);

  // Crear algunas asistencias para ambas reuniones
  const shalomMembers = members.filter(m => m.churchId === church1.id);
  const fuenteMembers = members.filter(m => m.churchId === church2.id);

  await Promise.all([
    ...shalomMembers.map(member =>
      prisma.attendance.create({
        data: {
          present: Math.random() > 0.3, // 70% de probabilidad de asistencia
          memberId: member.id,
          meetingId: meeting1.id,
        },
      })
    ),
    ...fuenteMembers.map(member =>
      prisma.attendance.create({
        data: {
          present: Math.random() > 0.3, // 70% de probabilidad de asistencia
          memberId: member.id,
          meetingId: meeting2.id,
        },
      })
    ),
  ]);

  console.log('✅ Asistencias registradas');

  // Crear ofrendas de ejemplo para ambas iglesias
  await Promise.all([
    prisma.offering.create({
      data: {
        amount: 1500.50,
        type: 'OFFERING',
        description: 'Ofrenda del servicio dominical - Shalom',
        date: new Date(),
        churchId: church1.id,
      },
    }),
    prisma.offering.create({
      data: {
        amount: 890.25,
        type: 'TITHE',
        description: 'Diezmos - Fuente de Agua Viva',
        date: new Date(),
        churchId: church2.id,
      },
    }),
  ]);

  console.log('✅ Ofrendas registradas');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
