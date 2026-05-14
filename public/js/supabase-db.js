/**
 * Supabase Database Functions for Ambrand Studio
 * Handles all CRUD operations with the Supabase backend.
 * Requires: supabase-config.js to be loaded first.
 */

/* ═══════════════════════════════════
   PROJECTS
═══════════════════════════════════ */

/**
 * Load all projects from Supabase and populate the global `projects` array
 */
async function loadProjectsFromDB() {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading projects:', error);
      console.log('📦 Using fallback demo projects');
      projects = getFallbackProjects();
      return true;
    }

    if (data && data.length > 0) {
      projects = data.map(p => ({
        id: p.id,
        title: p.title,
        client: p.client || 'Unknown Client',
        category: p.category,
        status: p.status || 'Draft',
        date: p.date,
        desc: p.description || '',
        tags: p.tags || [],
        views: p.views || 0,
        likes: p.likes || 0,
        cover: p.cover_url || '',
        emoji: p.emoji || '🎨',
        url: p.project_url || ''
      }));
      console.log(`✅ Loaded ${projects.length} projects from Supabase`);
    } else {
      console.log('📦 No projects in DB, using demo projects');
      projects = getFallbackProjects();
    }
    return true;
  } catch (err) {
    console.error('Failed to load projects:', err);
    console.log('📦 Using fallback demo projects');
    projects = getFallbackProjects();
    return true;
  }
}

function getFallbackProjects() {
  return [
    {
      title: "Qahwa Coffee Brand Development",
      client: "Qahwa Artisanal Coffee",
      category: "branding",
      status: "Published",
      date: "2026-01-15",
      desc: "Complete brand identity redesign for premium Arabic coffee roaster, blending traditional heritage with modern aesthetics.",
      tags: ["Branding", "Packaging", "Coffee", "Arabic Design"],
      views: 1250,
      likes: 89,
      cover: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "☕",
      url: "work-details.html"
    },
    {
      title: "Tech Solutions Digital Identity",
      client: "Tech Solutions Inc.",
      category: "logo",
      status: "Published",
      date: "2026-02-20",
      desc: "Modern tech company logo and brand guidelines focusing on innovation and digital transformation.",
      tags: ["Technology", "Logo", "Digital", "Startup"],
      views: 980,
      likes: 67,
      cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "💻",
      url: "work-details.html"
    },
    {
      title: "Organic Beauty Packaging Design",
      client: "Natural Beauty Co.",
      category: "packaging",
      status: "Published",
      date: "2026-03-10",
      desc: "Eco-friendly packaging design for organic beauty products using sustainable materials.",
      tags: ["Packaging", "Beauty", "Eco-friendly", "Organic"],
      views: 1450,
      likes: 102,
      cover: "https://images.unsplash.com/photo-1610647181306-4c3522b402e5?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "🌿",
      url: "work-details.html"
    },
    {
      title: "Fitness Pro Promotional Video",
      client: "Fitness Pro Gym",
      category: "motion",
      status: "Published",
      date: "2026-01-28",
      desc: "Dynamic promotional video with motion graphics for fitness chain expansion campaign.",
      tags: ["Video", "Motion Graphics", "Fitness", "Marketing"],
      views: 2100,
      likes: 156,
      cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "🎬",
      url: "work-details.html"
    },
    {
      title: "Luxury Hotels E-Commerce Website",
      client: "Luxury Hotels Group",
      category: "website",
      status: "Published",
      date: "2026-02-15",
      desc: "Premium e-commerce platform for luxury hotel bookings with sophisticated user experience.",
      tags: ["Website", "E-commerce", "Hospitality", "Luxury"],
      views: 1890,
      likes: 134,
      cover: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "🏨",
      url: "work-details.html"
    },
    {
      title: "3D Product Modeling",
      client: "Tech Gadgets Ltd.",
      category: "3d",
      status: "Published",
      date: "2026-03-05",
      desc: "Photorealistic 3D modeling and rendering for new tech product launch campaign.",
      tags: ["3D", "Product Design", "Technology", "Rendering"],
      views: 1670,
      likes: 98,
      cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "🎮",
      url: "work-details.html"
    },
    {
      title: "Essentials Brand Strategy",
      client: "Essentials Retail",
      category: "branding",
      status: "Published",
      date: "2026-01-20",
      desc: "Comprehensive brand strategy and visual identity for retail chain expansion.",
      tags: ["Strategy", "Branding", "Retail", "Identity"],
      views: 1120,
      likes: 78,
      cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "🛍️",
      url: "work-details.html"
    },
    {
      title: "Start-Up Hub Logo Design",
      client: "Start-Up Hub",
      category: "logo",
      status: "Published",
      date: "2026-02-28",
      desc: "Dynamic logo design for co-working space and startup incubator program.",
      tags: ["Logo", "Startup", "Co-working", "Community"],
      views: 890,
      likes: 56,
      cover: "https://images.unsplash.com/photo-1497366216548-375240708a2f?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "🚀",
      url: "work-details.html"
    },
    {
      title: "Premium Fragrance Packaging",
      client: "Luxury Scents",
      category: "packaging",
      status: "Published",
      date: "2026-03-12",
      desc: "Elegant packaging design for premium fragrance line with gold foil details.",
      tags: ["Packaging", "Luxury", "Fragrance", "Premium"],
      views: 1340,
      likes: 92,
      cover: "https://images.unsplash.com/photo-1598440099904-e4875c8c8bdf?auto=format&fit=crop&q=80&w=800&h=600",
      emoji: "👑",
      url: "work-details.html"
    }
  ];
}

/**
 * Save a project to Supabase (insert or update)
 */
async function dbSaveProject(projectData, existingId) {
  const record = {
    title: projectData.title,
    description: projectData.desc || projectData.description,
  };

  try {
    if (existingId) {
      const { data, error } = await supabaseClient
        .from('projects')
        .update(record)
        .eq('id', existingId)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Project updated in Supabase:', data.id);
      return data;
    } else {
      const { data, error } = await supabaseClient
        .from('projects')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Project created in Supabase:', data.id);
      return data;
    }
  } catch (err) {
    console.error('Error saving project:', err);
    return null;
  }
}

/**
 * Delete a project from Supabase
 */
async function dbDeleteProject(id) {
  try {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log('✅ Project deleted from Supabase:', id);
    return true;
  } catch (err) {
    console.error('Error deleting project:', err);
    return false;
  }
}

/* ═══════════════════════════════════
   CLIENTS
═══════════════════════════════════ */

/**
 * Load all clients from Supabase
 */
async function loadClientsFromDB() {
  try {
    const { data, error } = await supabaseClient
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading clients:', error);
      return false;
    }

    if (data) {
      // Clear and repopulate the global clients array
      clients.length = 0;
      data.forEach(c => {
        clients.push({
          name: c.name,
          company: c.company || '',
          projects: c.projects_count || 0,
          spent: parseFloat(c.total_spent) || 0,
          avatar: c.avatar || c.name.charAt(0),
          color: c.color || '#5227FF'
        });
      });
      console.log(`✅ Loaded ${clients.length} clients from Supabase`);
    }
    return true;
  } catch (err) {
    console.error('Failed to load clients:', err);
    return false;
  }
}

/* ═══════════════════════════════════
   MESSAGES
═══════════════════════════════════ */

/**
 * Load all contact messages from Supabase
 */
async function loadMessagesFromDB() {
  try {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading messages:', error);
      return [];
    }

    console.log(`✅ Loaded ${(data || []).length} messages from Supabase`);
    return data || [];
  } catch (err) {
    console.error('Failed to load messages:', err);
    return [];
  }
}

/**
 * Send a contact message to Supabase
 */
async function dbSendMessage(msgData) {
  try {
    const { data, error } = await supabaseClient
      .from('messages')
      .insert({
        name: msgData.name,
        email: msgData.email,
        subject: msgData.subject || '',
        message: msgData.message
      })
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Message saved to Supabase:', data.id);
    return { success: true, data };
  } catch (err) {
    console.error('Error sending message:', err);
    return { success: false, error: err };
  }
}

/**
 * Mark a message as read
 */
async function dbMarkMessageRead(id) {
  try {
    await supabaseClient
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);
    return true;
  } catch (err) {
    console.error('Error marking message read:', err);
    return false;
  }
}

/**
 * Delete a message from Supabase
 */
async function dbDeleteMessage(id) {
  try {
    const { error } = await supabaseClient
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting message:', err);
    return false;
  }
}

/* ═══════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════ */

/**
 * Fetch all testimonials from Supabase
 */
async function loadTestimonials() {
  try {
    const { data, error } = await supabaseClient
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading testimonials:', error);
      return [];
    }

    console.log(`✅ Loaded ${(data || []).length} testimonials from Supabase`);
    return data || [];
  } catch (err) {
    console.error('Failed to load testimonials:', err);
    return [];
  }
}

/**
 * Save or update a testimonial
 */
async function dbSaveTestimonial(testimonial) {
  try {
    const { data, error } = await supabaseClient
      .from('testimonials')
      .upsert(testimonial)
      .select();

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error('Error saving testimonial:', err);
    return null;
  }
}

/**
 * Delete a testimonial by ID
 */
async function dbDeleteTestimonial(id) {
  try {
    const { error } = await supabaseClient
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return false;
  }
}

/* ═══════════════════════════════════
   PROFILES
   ═══════════════════════════════════ */

/**
 * Fetch user profile by ID
 */
async function dbGetUserProfile(uid) {
  try {
    // Get current session user - this works with anon key
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user.id === uid) {
      return {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.email,
        role: session.user.user_metadata?.role || 'user'
      };
    }
    return null;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
}

/* ═══════════════════════════════════
   MASTER LOAD (called after login)
   ═══════════════════════════════════ */

/**
 * Load all data from Supabase
 */
async function loadAllDataFromDB() {
  console.log('📡 Loading data from Supabase...');
  const [projOk, clientsOk] = await Promise.all([
    loadProjectsFromDB(),
    loadClientsFromDB()
  ]);

  if (projOk && clientsOk) {
    console.log('✅ All data loaded successfully from Supabase');
  } else {
    console.warn('⚠️ Some data failed to load, using fallback data');
  }
}
