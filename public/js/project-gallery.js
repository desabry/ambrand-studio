// =====================
// Project Gallery - Framer Inspired
// =====================

class ProjectGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            columns: 3,
            aspectRatio: '4/3',
            cardGap: 16,
            tabGap: 16,
            sectionGap: 40,
            activeTextColor: '#000000',
            inactiveTextColor: '#888888',
            underlineColor: '#000000',
            dividerColor: '#e5e5e5',
            allLabel: 'ALL',
            tabUppercase: true,
            cardUppercase: false,
            cardTextColor: '#000000',
            ...options
        };
        
        this.projects = [];
        this.activeTab = this.options.allLabel;
        this.lightboxImage = null;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('ProjectGallery: Container not found');
            return;
        }
        
        this.loadProjects();
        this.render();
        this.bindEvents();
    }
    
    loadProjects() {
        // Load projects from the existing gallery grid
        const existingGallery = document.querySelector('.gallery-grid') || document.querySelector('#galleryGrid');
        if (existingGallery) {
            const items = existingGallery.querySelectorAll('.gallery-item');
            this.projects = Array.from(items).map(item => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3')?.textContent || '';
                const category = item.querySelector('.category-badge')?.textContent || '';
                const categoryData = item.getAttribute('data-category') || '';
                
                return {
                    image: {
                        src: img?.src || '',
                        alt: img?.alt || title
                    },
                    title: title,
                    category: category,
                    categoryData: categoryData,
                    focalX: 50,
                    focalY: 50
                };
            });
        }
        
        // If no projects found, add some default ones
        if (this.projects.length === 0) {
            this.projects = [
                {
                    image: {
                        src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800&h=600',
                        alt: 'Qahwa Coffee Brand'
                    },
                    title: 'Qahwa Coffee Brand Development',
                    category: 'Brand Development',
                    categoryData: 'brand',
                    focalX: 50,
                    focalY: 50
                },
                {
                    image: {
                        src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=600',
                        alt: 'Tech Solutions Logo'
                    },
                    title: 'Tech Solutions Digital Identity',
                    category: 'Logo Design',
                    categoryData: 'logo',
                    focalX: 50,
                    focalY: 50
                },
                {
                    image: {
                        src: 'https://images.unsplash.com/photo-1610647181306-4c3522b402e5?auto=format&fit=crop&q=80&w=800&h=600',
                        alt: 'Organic Beauty Packaging'
                    },
                    title: 'Organic Beauty Packaging Design',
                    category: 'Packaging Design',
                    categoryData: 'packaging',
                    focalX: 50,
                    focalY: 50
                },
                {
                    image: {
                        src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800&h=600',
                        alt: 'Fitness Pro Video'
                    },
                    title: 'Fitness Pro Promotional Video',
                    category: 'Motion Graphics',
                    categoryData: 'motion',
                    focalX: 50,
                    focalY: 50
                },
                {
                    image: {
                        src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&h=600',
                        alt: 'Luxury Hotels Website'
                    },
                    title: 'Luxury Hotels E-Commerce Website',
                    category: 'Website Design',
                    categoryData: 'website',
                    focalX: 50,
                    focalY: 50
                },
                {
                    image: {
                        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800&h=600',
                        alt: '3D Product Modeling'
                    },
                    title: '3D Product Modeling',
                    category: '3D Design',
                    categoryData: '3d',
                    focalX: 50,
                    focalY: 50
                }
            ];
        }
    }
    
    getTabs() {
        const categories = new Set();
        this.projects.forEach(project => {
            if (project.category && project.category.trim()) {
                categories.add(project.category.trim());
            }
        });
        return [this.options.allLabel, ...Array.from(categories)];
    }
    
    getFilteredProjects() {
        if (this.activeTab === this.options.allLabel) {
            return this.projects;
        }
        return this.projects.filter(project => 
            project.category === this.activeTab
        );
    }
    
    render() {
        const tabs = this.getTabs();
        const filteredProjects = this.getFilteredProjects();
        
        this.container.innerHTML = `
            <div class="project-gallery-container">
                <div class="filter-tabs">
                    ${tabs.map((tab, index) => `
                        <button class="filter-tab ${tab === this.activeTab ? 'active' : ''}" 
                                data-tab="${tab}"
                                style="animation-delay: ${0.2 + index * 0.05}s">
                            ${tab}
                        </button>
                    `).join('')}
                </div>
                <div class="project-cards-grid" style="grid-template-columns: repeat(${this.options.columns}, 1fr); gap: ${this.options.cardGap}px;">
                    ${filteredProjects.map((project, index) => `
                        <div class="project-card" style="animation-delay: ${index * 0.25}s">
                            <div class="project-image-container" style="aspect-ratio: ${this.options.aspectRatio}">
                                <img src="${project.image.src}" 
                                     alt="${project.image.alt}"
                                     style="object-position: ${project.focalX}% ${project.focalY}%"
                                     data-lightbox="${project.image.src}">
                                <div class="project-overlay">
                                    <h3>${project.title}</h3>
                                    <span class="category-badge">${project.category}</span>
                                </div>
                            </div>
                            <h4 class="project-title">${project.title}</h4>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Tab switching
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tab')) {
                this.switchTab(e.target.dataset.tab);
            }
            
            // Lightbox
            if (e.target.dataset.lightbox) {
                this.openLightbox(e.target.dataset.lightbox);
            }
        });
        
        // Close lightbox
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox') || e.target.closest('.lightbox-close')) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightboxImage) {
                this.closeLightbox();
            }
        });
    }
    
    switchTab(tab) {
        if (tab === this.activeTab) return;
        
        const direction = this.getTabs().indexOf(tab) > this.getTabs().indexOf(this.activeTab) ? 1 : -1;
        this.activeTab = tab;
        
        // Animate out current cards
        const cards = this.container.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('exit');
            }, index * 50);
        });
        
        // Render new content after exit animation
        setTimeout(() => {
            this.render();
        }, 300);
    }
    
    openLightbox(imageSrc) {
        this.lightboxImage = imageSrc;
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
            <img src="${imageSrc}" alt="Project image">
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        }
        this.lightboxImage = null;
    }
    
    // Public methods
    addProject(project) {
        this.projects.push(project);
        this.render();
    }
    
    removeProject(index) {
        this.projects.splice(index, 1);
        this.render();
    }
    
    updateProject(index, project) {
        this.projects[index] = project;
        this.render();
    }
    
    setProjects(projects) {
        this.projects = projects;
        this.render();
    }
}

// Auto-initialize on pages with gallery grid
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('galleryGrid');
    if (galleryContainer) {
        // Replace the existing gallery with the new one
        const newContainer = document.createElement('div');
        newContainer.id = 'projectGallery';
        galleryContainer.parentNode.replaceChild(newContainer, galleryContainer);
        
        // Initialize the new gallery
        new ProjectGallery('projectGallery', {
            columns: 3,
            activeTextColor: '#e31937',
            underlineColor: '#e31937'
        });
    }
});

// Export for global access
window.ProjectGallery = ProjectGallery;
