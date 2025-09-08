const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        churchId: true,
      }
    });
    
    console.log('📊 Usuarios encontrados:', users.length);
    users.forEach(user => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`  Rol: ${user.role}`);
      console.log(`  ChurchId: ${user.churchId}`);
      console.log('---');
    });
    
    // Verificar específicamente el usuario manager
    const manager = await prisma.user.findUnique({
      where: { email: 'manager@arkaone.local' }
    });
    
    console.log('🎯 Usuario manager específico:');
    if (manager) {
      console.log(`✅ Encontrado - ID: ${manager.id}`);
    } else {
      console.log('❌ NO encontrado');
    }
    
    // Verificar accesos a iglesias
    const churchAccess = await prisma.userChurchAccess.findMany({
      where: { userId: manager?.id },
      include: {
        church: {
          select: { id: true, name: true }
        }
      }
    });
    
    console.log('🏛️ Accesos a iglesias del manager:');
    churchAccess.forEach(access => {
      console.log(`- Iglesia: ${access.church.name} (${access.church.id})`);
      console.log(`  Rol: ${access.role}`);
      console.log(`  Activo: ${access.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
