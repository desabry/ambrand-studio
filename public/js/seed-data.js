/**
 * Seed Data for Ambrand Studio
 * Adds sample projects to Supabase database
 */

// Sample projects data
const sampleProjects = [
    {
        title: "Qahwa Coffee Brand Development",
        client: "Qahwa Artisanal Coffee",
        category: "Brand Development",
        status: "Published",
        date: "2026-01-15",
        description: "Complete brand identity redesign for premium Arabic coffee roaster, blending traditional heritage with modern aesthetics.",
        tags: ["Branding", "Packaging", "Coffee", "Arabic Design"],
        views: 1250,
        likes: 89,
        cover_url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "☕",
        project_url: "work-details.html"
    },
    {
        title: "Tech Solutions Digital Identity",
        client: "Tech Solutions Inc.",
        category: "Logo Design",
        status: "Published",
        date: "2026-02-20",
        description: "Modern tech company logo and brand guidelines focusing on innovation and digital transformation.",
        tags: ["Technology", "Logo", "Digital", "Startup"],
        views: 980,
        likes: 67,
        cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "💻",
        project_url: "work-details.html"
    },
    {
        title: "Organic Beauty Packaging Design",
        client: "Natural Beauty Co.",
        category: "Packaging Design",
        status: "Published",
        date: "2026-03-10",
        description: "Eco-friendly packaging design for organic beauty products using sustainable materials.",
        tags: ["Packaging", "Beauty", "Eco-friendly", "Organic"],
        views: 1450,
        likes: 102,
        cover_url: "https://images.unsplash.com/photo-1610647181306-4c3522b402e5?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "🌿",
        project_url: "work-details.html"
    },
    {
        title: "Fitness Pro Promotional Video",
        client: "Fitness Pro Gym",
        category: "Motion Graphics",
        status: "Published",
        date: "2026-01-28",
        description: "Dynamic promotional video with motion graphics for fitness chain expansion campaign.",
        tags: ["Video", "Motion Graphics", "Fitness", "Marketing"],
        views: 2100,
        likes: 156,
        cover_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "🎬",
        project_url: "work-details.html"
    },
    {
        title: "Luxury Hotels E-Commerce Website",
        client: "Luxury Hotels Group",
        category: "Website Design",
        status: "Published",
        date: "2026-02-15",
        description: "Premium e-commerce platform for luxury hotel bookings with sophisticated user experience.",
        tags: ["Website", "E-commerce", "Hospitality", "Luxury"],
        views: 1890,
        likes: 134,
        cover_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "🏨",
        project_url: "work-details.html"
    },
    {
        title: "3D Product Modeling",
        client: "Tech Gadgets Ltd.",
        category: "3D Design",
        status: "Published",
        date: "2026-03-05",
        description: "Photorealistic 3D modeling and rendering for new tech product launch campaign.",
        tags: ["3D", "Product Design", "Technology", "Rendering"],
        views: 1670,
        likes: 98,
        cover_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "🎮",
        project_url: "work-details.html"
    },
    {
        title: "Essentials Brand Strategy",
        client: "Essentials Retail",
        category: "Brand Development",
        status: "Published",
        date: "2026-01-20",
        description: "Comprehensive brand strategy and visual identity for retail chain expansion.",
        tags: ["Strategy", "Branding", "Retail", "Identity"],
        views: 1120,
        likes: 78,
        cover_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "🛍️",
        project_url: "work-details.html"
    },
    {
        title: "Start-Up Hub Logo Design",
        client: "Start-Up Hub",
        category: "Logo Design",
        status: "Published",
        date: "2026-02-28",
        description: "Dynamic logo design for co-working space and startup incubator program.",
        tags: ["Logo", "Startup", "Co-working", "Community"],
        views: 890,
        likes: 56,
        cover_url: "https://images.unsplash.com/photo-1497366216548-375240708a2f?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "🚀",
        project_url: "work-details.html"
    },
    {
        title: "Premium Fragrance Packaging",
        client: "Luxury Scents",
        category: "Packaging Design",
        status: "Published",
        date: "2026-03-12",
        description: "Elegant packaging design for premium fragrance line with gold foil details.",
        tags: ["Packaging", "Luxury", "Fragrance", "Premium"],
        views: 1340,
        likes: 92,
        cover_url: "https://images.unsplash.com/photo-1598440099904-e4875c8c8bdf?auto=format&fit=crop&q=80&w=800&h=600",
        emoji: "👑",
        project_url: "work-details.html"
    }
];

// Sample clients data (inserted manually via dashboard due to RLS)
const sampleClients = [];

// Sample testimonials data (inserted manually via dashboard due to RLS)
const sampleTestimonials = [];

/**
 * Seed all sample data to Supabase
 */
async function seedSampleData() {
    console.log('🌱 Starting to seed sample data...');
    
    try {
        // Seed projects
        console.log('📁 Adding sample projects...');
        let seededCount = 0;
        for (const project of sampleProjects) {
            const result = await dbSaveProject(project);
            if (result) {
                seededCount++;
            }
        }
        if (seededCount > 0) {
            console.log(`✅ Seeded ${seededCount} projects to Supabase`);
        } else {
            console.log('ℹ️ No projects seeded (RLS or DB issue — fallback data will be used)');
        }
        
        // Seed clients
        if (sampleClients.length > 0) {
            console.log('👥 Adding sample clients...');
            for (const client of sampleClients) {
                const { data, error } = await supabaseClient
                    .from('clients')
                    .insert(client)
                    .select()
                    .single();
                    
                if (error) {
                    console.warn(`⚠️ Skipped client: ${client.name}`);
                }
            }
        }
        
        // Seed testimonials
        if (sampleTestimonials.length > 0) {
            console.log('⭐ Adding sample testimonials...');
            for (const testimonial of sampleTestimonials) {
                const { data, error } = await supabaseClient
                    .from('testimonials')
                    .insert(testimonial)
                    .select()
                    .single();
                    
                if (error) {
                    console.warn(`⚠️ Skipped testimonial: ${testimonial.name}`);
                }
            }
        }
        
        console.log('🎉 Sample data seeding completed!');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

/**
 * Check if data exists and seed if empty
 */
async function seedIfNeeded() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            console.log('🔒 Not logged in, skipping data seeding');
            return;
        }
        
        const { data: existingProjects, error: projectError } = await supabaseClient
            .from('projects')
            .select('id')
            .limit(1);
            
        if (projectError) throw projectError;
        
        if (!existingProjects || existingProjects.length === 0) {
            console.log('📭 No projects found, seeding sample data...');
            await seedSampleData();
        } else {
            console.log('📚 Projects already exist, skipping seeding');
        }
        
    } catch (error) {
        console.warn('⚠️ Could not check/seed data:', error);
    }
}

// Seeding is disabled — fallback demo data in loadProjectsFromDB handles portfolio display.
// To enable seeding later, uncomment below and run data/fix-all.sql in Supabase SQL Editor.
// if (typeof supabaseClient !== 'undefined') { seedIfNeeded(); }
