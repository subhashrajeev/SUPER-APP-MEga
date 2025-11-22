import { PrismaClient, UserRole, LeadStatus, QuotationStatus, ProjectStatus, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.dashboardWidget.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.leadAssignment.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.projectPhoto.deleteMany();
  await prisma.projectNote.deleteMany();
  await prisma.projectTask.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.projectPhase.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.material.deleteMany();
  await prisma.materialCategory.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ Creating demo users...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

  const demoAdmin = await prisma.user.create({
    data: {
      email: 'demo@ivr.local',
      password: hashedPassword,
      name: 'Demo Admin',
      phone: '+91-9876543210',
      role: UserRole.ADMIN,
      status: 'ACTIVE',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@ivr.local',
      password: hashedPassword,
      name: 'Rajesh Kumar',
      phone: '+91-9876543211',
      role: UserRole.SALES,
      status: 'ACTIVE',
    },
  });

  const projectManager = await prisma.user.create({
    data: {
      email: 'pm@ivr.local',
      password: hashedPassword,
      name: 'Priya Sharma',
      phone: '+91-9876543212',
      role: UserRole.PROJECT_MANAGER,
      status: 'ACTIVE',
    },
  });

  const technician = await prisma.user.create({
    data: {
      email: 'tech@ivr.local',
      password: hashedPassword,
      name: 'Suresh Reddy',
      phone: '+91-9876543213',
      role: UserRole.TECHNICIAN,
      status: 'ACTIVE',
    },
  });

  console.log('📋 Creating material categories and materials...');

  // Material Categories
  const laminatesCategory = await prisma.materialCategory.create({
    data: {
      name: 'Laminates',
      slug: 'laminates',
      description: 'High-quality decorative laminates for furniture',
      order: 1,
      isActive: true,
    },
  });

  const hardwareCategory = await prisma.materialCategory.create({
    data: {
      name: 'Hardware & Fittings',
      slug: 'hardware',
      description: 'Cabinet handles, hinges, and accessories',
      order: 2,
      isActive: true,
    },
  });

  // Materials
  await prisma.material.createMany({
    data: [
      {
        name: 'Premium Oak Laminate',
        sku: 'LAM-OAK-001',
        description: 'Natural oak finish laminate with wood grain texture',
        categoryId: laminatesCategory.id,
        brand: 'Greenply',
        unitPrice: 450,
        unit: 'sqft',
        tags: ['oak', 'wood', 'natural'],
        inStock: true,
        isFeatured: true,
      },
      {
        name: 'Glossy White Laminate',
        sku: 'LAM-WHT-001',
        description: 'High-gloss white laminate for modern kitchens',
        categoryId: laminatesCategory.id,
        brand: 'Merino',
        unitPrice: 380,
        unit: 'sqft',
        tags: ['white', 'glossy', 'modern'],
        inStock: true,
        isFeatured: true,
      },
      {
        name: 'Soft-Close Hinges',
        sku: 'HDW-HNG-001',
        description: 'Premium soft-close cabinet hinges',
        categoryId: hardwareCategory.id,
        brand: 'Hettich',
        unitPrice: 120,
        unit: 'piece',
        tags: ['hinge', 'soft-close'],
        inStock: true,
      },
      {
        name: 'Designer Cabinet Handle',
        sku: 'HDW-HDL-001',
        description: 'Stainless steel modern cabinet handle',
        categoryId: hardwareCategory.id,
        brand: 'Ebco',
        unitPrice: 85,
        unit: 'piece',
        tags: ['handle', 'steel', 'modern'],
        inStock: true,
      },
    ],
  });

  console.log('👥 Creating demo leads...');

  // Create Leads
  const lead1 = await prisma.lead.create({
    data: {
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91-9123456789',
      address: '123 Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      status: LeadStatus.QUALIFIED,
      source: 'WEBSITE',
      priority: 1,
      budget: 500000,
      projectType: 'Full Kitchen',
      requirements: 'Modern modular kitchen with island, premium finishes',
      ownerId: salesUser.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: 'Sunita Reddy',
      email: 'sunita.r@example.com',
      phone: '+91-9234567890',
      address: '456 Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      status: LeadStatus.CONTACTED,
      source: 'REFERRAL',
      priority: 2,
      budget: 300000,
      projectType: 'Bedroom Wardrobes',
      requirements: 'Walk-in wardrobe for master bedroom',
      ownerId: salesUser.id,
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+91-9345678901',
      address: '789 Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      status: LeadStatus.NEW,
      source: 'SOCIAL_MEDIA',
      priority: 2,
      budget: 150000,
      projectType: 'TV Unit',
      requirements: 'Wall-mounted TV unit with storage',
      ownerId: salesUser.id,
    },
  });

  console.log('💼 Creating quotations...');

  // Create Quotation
  const quotation1 = await prisma.quotation.create({
    data: {
      quotationNumber: 'QUO-2025-001',
      version: 1,
      leadId: lead1.id,
      title: 'Modular Kitchen - Banjara Hills',
      description: 'Complete modular kitchen with island and premium fittings',
      status: QuotationStatus.SENT,
      validUntil: new Date('2025-12-31'),
      subtotal: 450000,
      taxRate: 18,
      taxAmount: 81000,
      discount: 0,
      total: 531000,
      createdById: salesUser.id,
      sentAt: new Date(),
      items: {
        create: [
          {
            name: 'Base Cabinets',
            description: 'Modular base cabinets with soft-close drawers',
            category: 'Cabinetry',
            quantity: 25,
            unit: 'sqft',
            unitPrice: 8000,
            total: 200000,
            taxRate: 18,
            order: 1,
          },
          {
            name: 'Wall Cabinets',
            description: 'Wall-mounted cabinets with glass shutters',
            category: 'Cabinetry',
            quantity: 15,
            unit: 'sqft',
            unitPrice: 6000,
            total: 90000,
            taxRate: 18,
            order: 2,
          },
          {
            name: 'Kitchen Island',
            description: 'Custom kitchen island with granite top',
            category: 'Furniture',
            quantity: 1,
            unit: 'unit',
            unitPrice: 80000,
            total: 80000,
            taxRate: 18,
            order: 3,
          },
          {
            name: 'Hardware & Fittings',
            description: 'Premium handles, hinges, and accessories',
            category: 'Hardware',
            quantity: 1,
            unit: 'lot',
            unitPrice: 50000,
            total: 50000,
            taxRate: 18,
            order: 4,
          },
          {
            name: 'Installation & Labor',
            description: 'Professional installation and finishing',
            category: 'Service',
            quantity: 1,
            unit: 'lot',
            unitPrice: 30000,
            total: 30000,
            taxRate: 18,
            order: 5,
          },
        ],
      },
    },
  });

  console.log('🏗️ Creating demo project...');

  // Create Project
  const project1 = await prisma.project.create({
    data: {
      projectNumber: 'PRJ-2025-001',
      name: 'Modular Kitchen - Banjara Hills',
      description: 'Complete kitchen renovation with modern modular design',
      status: ProjectStatus.IN_PROGRESS,
      priority: 1,
      clientName: 'Amit Patel',
      clientEmail: 'amit.patel@example.com',
      clientPhone: '+91-9123456789',
      siteAddress: '123 Banjara Hills, Hyderabad, Telangana 500034',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-03-15'),
      actualStartDate: new Date('2025-01-20'),
      budget: 531000,
      progressPercent: 45,
      managerId: projectManager.id,
      fromLeadId: lead1.id,
      fromQuotationId: quotation1.id,
      phases: {
        create: [
          {
            name: 'Design & Planning',
            description: 'Initial design, measurements, and material selection',
            order: 1,
            startDate: new Date('2025-01-20'),
            endDate: new Date('2025-02-05'),
            status: 'COMPLETED',
            progress: 100,
          },
          {
            name: 'Fabrication',
            description: 'Manufacturing of cabinets and components',
            order: 2,
            startDate: new Date('2025-02-06'),
            endDate: new Date('2025-02-25'),
            status: 'IN_PROGRESS',
            progress: 70,
          },
          {
            name: 'Installation',
            description: 'On-site installation and fitting',
            order: 3,
            startDate: new Date('2025-02-26'),
            endDate: new Date('2025-03-10'),
            status: 'PENDING',
            progress: 0,
          },
          {
            name: 'Finishing',
            description: 'Final touches and quality check',
            order: 4,
            startDate: new Date('2025-03-11'),
            endDate: new Date('2025-03-15'),
            status: 'PENDING',
            progress: 0,
          },
        ],
      },
      milestones: {
        create: [
          {
            name: 'Design Approval',
            description: 'Client approval on final design',
            dueDate: new Date('2025-02-01'),
            completed: true,
            completedAt: new Date('2025-01-28'),
            order: 1,
          },
          {
            name: 'Material Procurement',
            description: 'All materials procured and verified',
            dueDate: new Date('2025-02-10'),
            completed: true,
            completedAt: new Date('2025-02-08'),
            order: 2,
          },
          {
            name: 'Installation Complete',
            description: 'Complete installation on site',
            dueDate: new Date('2025-03-10'),
            completed: false,
            order: 3,
          },
        ],
      },
      tasks: {
        create: [
          {
            title: 'Site measurement verification',
            description: 'Verify all measurements before fabrication',
            status: 'DONE',
            priority: 1,
            completedAt: new Date('2025-01-25'),
          },
          {
            title: 'Cabinet fabrication',
            description: 'Complete base and wall cabinet fabrication',
            status: 'IN_PROGRESS',
            priority: 1,
          },
          {
            title: 'Hardware procurement',
            description: 'Order and receive all hardware items',
            status: 'DONE',
            priority: 2,
            completedAt: new Date('2025-02-05'),
          },
        ],
      },
    },
  });

  console.log('🧾 Creating invoice...');

  // Create Invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-001',
      projectId: project1.id,
      title: 'First Milestone Payment',
      description: 'Payment for design approval and material procurement',
      status: InvoiceStatus.PAID,
      subtotal: 200000,
      taxRate: 18,
      taxAmount: 36000,
      discount: 0,
      total: 236000,
      paidAmount: 236000,
      dueAmount: 0,
      clientName: 'Amit Patel',
      clientEmail: 'amit.patel@example.com',
      clientPhone: '+91-9123456789',
      clientAddress: '123 Banjara Hills, Hyderabad',
      createdById: demoAdmin.id,
      sentAt: new Date('2025-01-25'),
      paidAt: new Date('2025-01-28'),
      items: {
        create: [
          {
            description: 'Design & Planning Phase',
            quantity: 1,
            unit: 'lot',
            unitPrice: 50000,
            total: 50000,
            taxRate: 18,
            order: 1,
          },
          {
            description: 'Material Advance (40%)',
            quantity: 1,
            unit: 'lot',
            unitPrice: 150000,
            total: 150000,
            taxRate: 18,
            order: 2,
          },
        ],
      },
      payments: {
        create: {
          paymentNumber: 'PAY-2025-001',
          amount: 236000,
          currency: 'INR',
          method: 'BANK_TRANSFER',
          status: 'COMPLETED',
          paidBy: 'Amit Patel',
          paidAt: new Date('2025-01-28'),
          transactionId: 'TXN123456789',
        },
      },
    },
  });

  console.log('👷 Creating employees...');

  // Create Employees
  await prisma.employee.createMany({
    data: [
      {
        employeeNumber: 'EMP-001',
        userId: technician.id,
        name: 'Suresh Reddy',
        phone: '+91-9876543213',
        type: 'TECHNICIAN',
        status: 'ACTIVE',
        designation: 'Senior Technician',
        dateOfJoining: new Date('2023-01-15'),
        salary: 25000,
        skills: ['Installation', 'Carpentry', 'Finishing'],
      },
      {
        employeeNumber: 'EMP-002',
        name: 'Ravi Kumar',
        phone: '+91-9876543214',
        type: 'CARPENTER',
        status: 'ACTIVE',
        designation: 'Lead Carpenter',
        dateOfJoining: new Date('2022-06-01'),
        salary: 30000,
        skills: ['Woodwork', 'Cabinet Making', 'Joinery'],
      },
      {
        employeeNumber: 'EMP-003',
        name: 'Ganesh Rao',
        phone: '+91-9876543215',
        type: 'CARPENTER',
        status: 'ACTIVE',
        designation: 'Carpenter',
        dateOfJoining: new Date('2023-08-15'),
        salary: 22000,
        skills: ['Basic Carpentry', 'Installation'],
      },
    ],
  });

  console.log('🏢 Creating vendors...');

  // Create Vendors
  await prisma.vendor.createMany({
    data: [
      {
        vendorCode: 'VEN-001',
        name: 'Greenply Industries',
        contactPerson: 'Ramesh Iyer',
        email: 'ramesh@greenply.com',
        phone: '+91-9876501234',
        address: 'Industrial Area, Phase 1',
        city: 'Hyderabad',
        state: 'Telangana',
        gstin: '36AABCG1234F1Z5',
        status: 'ACTIVE',
        category: 'Laminates',
        paymentTerms: 'Net 30',
      },
      {
        vendorCode: 'VEN-002',
        name: 'Hettich India',
        contactPerson: 'Sunil Mehta',
        email: 'sunil@hettich.co.in',
        phone: '+91-9876502345',
        address: 'Hardware District',
        city: 'Bangalore',
        state: 'Karnataka',
        gstin: '29AABCH5678K1Z8',
        status: 'ACTIVE',
        category: 'Hardware',
        paymentTerms: 'Net 15',
      },
    ],
  });

  console.log('📊 Creating dashboard widgets for demo user...');

  // Create Dashboard Widgets
  await prisma.dashboardWidget.createMany({
    data: [
      {
        userId: demoAdmin.id,
        type: 'TODAY_VISITS',
        title: "Today's Visits",
        position: 1,
        size: 'MEDIUM',
        isVisible: true,
      },
      {
        userId: demoAdmin.id,
        type: 'OPEN_LEADS',
        title: 'Open Leads',
        position: 2,
        size: 'MEDIUM',
        isVisible: true,
      },
      {
        userId: demoAdmin.id,
        type: 'OUTSTANDING_PAYMENTS',
        title: 'Outstanding Payments',
        position: 3,
        size: 'MEDIUM',
        isVisible: true,
      },
      {
        userId: demoAdmin.id,
        type: 'PENDING_APPROVALS',
        title: 'Pending Approvals',
        position: 4,
        size: 'SMALL',
        isVisible: true,
      },
      {
        userId: demoAdmin.id,
        type: 'QUICK_ACTIONS',
        title: 'Quick Actions',
        position: 5,
        size: 'LARGE',
        isVisible: true,
      },
    ],
  });

  console.log('🎨 Creating before/after examples...');

  // Before/After Examples
  await prisma.beforeAfter.createMany({
    data: [
      {
        title: 'Modern Kitchen Transformation',
        description: 'Complete kitchen makeover with modular cabinets',
        beforeImage: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7',
        afterImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
        projectType: 'Kitchen',
        location: 'Hyderabad',
        tags: ['kitchen', 'modular', 'modern'],
        isPublished: true,
        publishedAt: new Date(),
        order: 1,
      },
      {
        title: 'Luxury Bedroom Wardrobe',
        description: 'Walk-in wardrobe with mirror and lighting',
        beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        afterImage: 'https://images.unsplash.com/photo-1558618666-d0a9ccf44b8b',
        projectType: 'Wardrobe',
        location: 'Bangalore',
        tags: ['wardrobe', 'luxury', 'bedroom'],
        isPublished: true,
        publishedAt: new Date(),
        order: 2,
      },
    ],
  });

  console.log('🎭 Creating 3D models and renders...');

  // 3D Models
  await prisma.threeDModel.createMany({
    data: [
      {
        name: 'Modern Kitchen Set',
        description: 'L-shaped modular kitchen with island',
        modelUrl: '/models/kitchen-modern.glb',
        thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
        category: 'Kitchen',
        tags: ['kitchen', 'modern', 'l-shaped'],
        isPublished: true,
        isFeatured: true,
      },
      {
        name: 'Wardrobe Design 1',
        description: 'Sliding door wardrobe with mirror',
        modelUrl: '/models/wardrobe-sliding.glb',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-d0a9ccf44b8b',
        category: 'Wardrobe',
        tags: ['wardrobe', 'sliding', 'mirror'],
        isPublished: true,
      },
    ],
  });

  // Project Renders
  await prisma.projectRender.createMany({
    data: [
      {
        title: 'Contemporary Kitchen Design',
        description: 'Minimalist white kitchen with wooden accents',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
        thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
        projectType: 'Kitchen',
        style: 'Contemporary',
        tags: ['kitchen', 'contemporary', 'minimalist'],
        isPublished: true,
        isFeatured: true,
        order: 1,
      },
      {
        title: 'Traditional Pooja Room',
        description: 'Elegant pooja unit with traditional carvings',
        imageUrl: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1',
        thumbnail: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=400',
        projectType: 'Pooja Room',
        style: 'Traditional',
        tags: ['pooja', 'traditional', 'carved'],
        isPublished: true,
        order: 2,
      },
    ],
  });

  console.log('⚙️ Creating app settings...');

  // App Settings
  await prisma.appSetting.createMany({
    data: [
      {
        key: 'company_name',
        value: JSON.stringify('IVR INTERIORS'),
        description: 'Company display name',
      },
      {
        key: 'company_email',
        value: JSON.stringify('info@ivrinteriors.com'),
        description: 'Company contact email',
      },
      {
        key: 'company_phone',
        value: JSON.stringify('+91-9876543210'),
        description: 'Company contact phone',
      },
      {
        key: 'gst_number',
        value: JSON.stringify('36AABCI1234F1Z6'),
        description: 'Company GST number',
      },
      {
        key: 'default_tax_rate',
        value: JSON.stringify(18),
        description: 'Default tax rate percentage',
      },
      {
        key: 'currency',
        value: JSON.stringify('INR'),
        description: 'Default currency',
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:           demo@ivr.local / Demo123!');
  console.log('Sales:           sales@ivr.local / Demo123!');
  console.log('Project Manager: pm@ivr.local / Demo123!');
  console.log('Technician:      tech@ivr.local / Demo123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🎉 Database seeded with:');
  console.log('  • 4 Users with different roles');
  console.log('  • 3 Leads in various stages');
  console.log('  • 1 Quotation with 5 line items');
  console.log('  • 1 Active Project with phases and milestones');
  console.log('  • 1 Paid Invoice with payment');
  console.log('  • 2 Material categories with 4 materials');
  console.log('  • 3 Employees');
  console.log('  • 2 Vendors');
  console.log('  • 5 Dashboard widgets');
  console.log('  • 2 Before/After showcases');
  console.log('  • 2 3D Models and renders');
  console.log('  • System settings\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
