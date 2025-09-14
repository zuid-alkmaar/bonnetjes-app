// Main JavaScript for Bonnetjes Cafe

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('nl-NL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Loading state management
function setLoading(element, loading = true) {
    if (loading) {
        element.classList.add('loading');
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        element.appendChild(spinner);
    } else {
        element.classList.remove('loading');
        const spinner = element.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Confirmation dialogs
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Auto-save functionality
function autoSave(form, endpoint) {
    const formData = new FormData(form);
    
    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Changes saved automatically');
        }
    })
    .catch(error => {
        console.error('Auto-save failed:', error);
    });
}

// Search functionality
function initializeSearch(searchInput, searchableElements) {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N for new order
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/orders/new';
    }
    
    // Ctrl/Cmd + D for dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        window.location.href = '/';
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
        });
    }
});

// Print functionality
function printOrder(orderId) {
    const printWindow = window.open(`/orders/${orderId}/print`, '_blank');
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

// Export functionality
function exportData(type, format = 'csv') {
    const url = `/api/export/${type}?format=${format}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
}

// Real-time updates (if WebSocket is implemented)
function initializeRealTimeUpdates() {
    if (typeof WebSocket !== 'undefined') {
        const ws = new WebSocket(`ws://${window.location.host}`);
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'order_created':
                    showToast(`New order #${data.orderId} created`);
                    break;
                case 'order_updated':
                    showToast(`Order #${data.orderId} updated`);
                    break;
                case 'order_deleted':
                    showToast(`Order #${data.orderId} deleted`);
                    break;
            }
        };
        
        ws.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Initialize form validation
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showToast('Please fill in all required fields', 'error');
            }
        });
    });
    
    // Initialize search if search input exists
    const searchInput = document.querySelector('[data-search]');
    if (searchInput) {
        const searchableElements = document.querySelectorAll('[data-searchable]');
        initializeSearch(searchInput, searchableElements);
    }
    
    // Initialize auto-refresh for dashboard
    if (window.location.pathname === '/') {
        setInterval(() => {
            // Refresh dashboard stats every 30 seconds
            fetch('/api/dashboard/stats')
                .then(response => response.json())
                .then(data => {
                    // Update stats without full page reload
                    updateDashboardStats(data);
                })
                .catch(error => {
                    console.error('Failed to refresh dashboard:', error);
                });
        }, 30000);
    }
    
    // Show page load success
    showToast('Page loaded successfully');
});

// Dashboard stats update function
function updateDashboardStats(stats) {
    const elements = {
        totalRevenue: document.querySelector('[data-stat="totalRevenue"]'),
        totalOrders: document.querySelector('[data-stat="totalOrders"]'),
        totalProducts: document.querySelector('[data-stat="totalProducts"]')
    };
    
    if (elements.totalRevenue) {
        elements.totalRevenue.textContent = formatCurrency(stats.totalRevenue);
    }
    if (elements.totalOrders) {
        elements.totalOrders.textContent = stats.totalOrders;
    }
    if (elements.totalProducts) {
        elements.totalProducts.textContent = stats.totalProducts;
    }
}

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Offline detection
window.addEventListener('online', function() {
    showToast('Connection restored');
});

window.addEventListener('offline', function() {
    showToast('You are now offline', 'error');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
