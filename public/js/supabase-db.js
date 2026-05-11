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
      return false;
    }

    if (data) {
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
    }
    return true;
  } catch (err) {
    console.error('Failed to load projects:', err);
    return false;
  }
}

/**
 * Save a project to Supabase (insert or update)
 */
async function dbSaveProject(projectData, existingId) {
  const record = {
    title: projectData.title,
    client: projectData.client,
    category: projectData.category,
    status: projectData.status,
    date: projectData.date,
    description: projectData.desc,
    tags: projectData.tags,
    views: projectData.views || 0,
    likes: projectData.likes || 0,
    cover_url: projectData.cover || '',
    emoji: projectData.emoji,
    project_url: projectData.url || '',
    updated_at: new Date().toISOString()
  };

  try {
    if (existingId) {
      // Update existing project
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
      // Insert new project
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
