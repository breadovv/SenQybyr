function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const errors = [];

        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        const email = form.querySelector('input[type="email"]');
        const name = form.querySelector('input[name="name"]');
        const password = form.querySelector('input[type="password"]');
        const confirmPassword = form.querySelector('input[name="confirmPassword"]');

        if (email) {
            const emailValue = email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailValue) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
        }

        if (name) {
            const nameValue = name.value.trim();
            if (!nameValue) {
                showError(name, 'Name is required');
                isValid = false;
            } else if (nameValue.length < 2) {
                showError(name, 'Name must be at least 2 characters');
                isValid = false;
            }
        }

        if (password) {
            const passwordValue = password.value;
            if (!passwordValue) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (passwordValue.length < 8) {
                showError(password, 'Password must be at least 8 characters');
                isValid = false;
            }
        }


        if (confirmPassword && password) {
            const confirmValue = confirmPassword.value;
            if (!confirmValue) {
                showError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (confirmValue !== password.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }
        }

        if (isValid) {
            showSuccessMessage(form, 'Form submitted successfully!');
            form.reset();
        }
    });
}

function showError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function showSuccessMessage(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.textContent = message;
    form.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}


function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            // Hide content initially
            content.style.display = 'none';

            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all accordions
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.display = 'none';
                    }
                });

                // Toggle current accordion
                if (!isActive) {
                    item.classList.add('active');
                    content.style.display = 'block';
                }
            });
        }
    });
}


function initPopup() {
    const openButtons = document.querySelectorAll('[data-popup-open]');
    const closeButtons = document.querySelectorAll('[data-popup-close]');
    const popups = document.querySelectorAll('.popup-overlay');

    openButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const popupId = this.getAttribute('data-popup-open');
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const popup = this.closest('.popup-overlay');
            if (popup) {
                popup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    popups.forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}


function initBackgroundChanger() {
    const btn = document.getElementById('bgChangeBtn');
    if (!btn) return;

    const colors = [
        'linear-gradient(180deg, #ffffff, rgb(243, 243, 243))',
        'linear-gradient(180deg, #ffeaa7, #fdcb6e)',
        'linear-gradient(180deg, #a29bfe, #6c5ce7)',
        'linear-gradient(180deg, #fd79a8, #e84393)',
        'linear-gradient(180deg, #74b9ff, #0984e3)',
        'linear-gradient(180deg, #55efc4, #00b894)',
        'linear-gradient(180deg, #fab1a0, #e17055)'
    ];

    let currentIndex = 0;

    btn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % colors.length;
        document.body.style.background = colors[currentIndex];
    });
}


function initDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    if (!dateTimeElement) return;

    function updateDateTime() {
        const now = new Date();

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        const formattedDate = now.toLocaleDateString('en-US', options);
        dateTimeElement.textContent = formattedDate;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
}


function initSearch() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    alert(`Searching for: ${query}`);
                    // Here you would implement actual search logic
                }
            }
        });
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear your watch history?')) {
        const historyContent = document.querySelector('.history-content');
        const emptyState = document.getElementById('empty-history');

        if (historyContent && emptyState) {
            historyContent.style.display = 'none';
            emptyState.style.display = 'flex';
        }
    }
}

function toggleHistory() {
    alert('History tracking has been paused');
}

function removeFromHistory(btn) {
    const tile = btn.closest('.tile');
    if (tile && confirm('Remove this video from history?')) {
        tile.style.opacity = '0';
        tile.style.transform = 'translateX(-100%)';

        setTimeout(() => {
            tile.remove();
        }, 300);
    }
}

// Liked videos management
function clearAllLiked() {
    if (confirm('Are you sure you want to clear all liked videos?')) {
        const likedContent = document.querySelector('.liked-content');
        const emptyState = document.getElementById('empty-liked');

        if (likedContent && emptyState) {
            likedContent.style.display = 'none';
            emptyState.style.display = 'flex';
        }
    }
}

function unlikeVideo(btn) {
    const tile = btn.closest('.tile');
    if (tile && confirm('Unlike this video?')) {
        tile.style.opacity = '0';
        tile.style.transform = 'scale(0.8)';

        setTimeout(() => {
            tile.remove();
        }, 300);
    }
}

// Filter functionality
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter logic would go here based on the page
            console.log(`Filtering by: ${filter}`);
        });
    });
}


// Theme toggle initialization
function initThemeToggle() {
    const checkbox = document.getElementById('themeSwitch');
    const label = document.querySelector('label[for="themeSwitch"]');

    const applyTheme = (theme) => {
        document.body.classList.toggle('theme-dark', theme === 'night');
        localStorage.setItem('theme', theme);
        if (checkbox) checkbox.checked = (theme === 'night');
        if (label) label.textContent = theme === 'night' ? 'Night' : 'Day';
    };

    const saved = localStorage.getItem('theme') || 'day';
    applyTheme(saved);

    if (checkbox) {
        checkbox.addEventListener('change', () => {
            applyTheme(checkbox.checked ? 'night' : 'day');
        });
    }
}

// Star rating initialization
function initRating() {
    const stars = document.querySelectorAll('#profile-rating .star');
    const valueEl = document.querySelector('#rating-value span');
    let currentRating = 0;

    if (!stars.length) return;

    const updateStars = (rating) => {
        stars.forEach((s, i) => s.classList.toggle('selected', i < rating));
    };

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateStars(currentRating);
            if (valueEl) valueEl.textContent = currentRating;
        });
        star.addEventListener('mouseover', () => updateStars(index + 1));
        star.addEventListener('mouseout', () => updateStars(currentRating));
    });
}

function initImageGallery() {
    const main = document.getElementById('gallery-main');
    const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    if (!main || !thumbs.length) return;

    thumbs.forEach(t => {
        t.addEventListener('click', () => {
            const src = t.getAttribute('data-src');
            if (src) {
                main.src = src;
            }
            thumbs.forEach(el => el.classList.remove('active'));
            t.classList.add('active');
        });
    });
}

function initTimeButton() {
    const btn = document.getElementById('showTimeBtn');
    const display = document.getElementById('currentTimeDisplay');
    if (!btn || !display) return;

    btn.addEventListener('click', () => {
        display.textContent = new Date().toLocaleTimeString();
    });
}

// Product data using JavaScript objects and arrays
const productData = [
    {
        id: 1,
        title: "Music Production Course",
        category: "music",
        price: 29.99,
        priceRange: "medium",
        description: "Learn professional music production techniques",
        featured: true
    },
    {
        id: 2,
        title: "JavaScript Fundamentals",
        category: "education",
        price: 0,
        priceRange: "free",
        description: "Complete guide to JavaScript programming",
        featured: false
    },
    {
        id: 3,
        title: "Gaming Highlights Compilation",
        category: "gaming",
        price: 5.99,
        priceRange: "low",
        description: "Best gaming moments from top streamers",
        featured: true
    },
    {
        id: 4,
        title: "Comedy Special",
        category: "entertainment",
        price: 15.99,
        priceRange: "medium",
        description: "Stand-up comedy from rising stars",
        featured: false
    },
    {
        id: 5,
        title: "Advanced React Tutorial",
        category: "education",
        price: 75.00,
        priceRange: "high",
        description: "Master React with advanced patterns",
        featured: true
    },
    {
        id: 6,
        title: "Indie Music Playlist",
        category: "music",
        price: 0,
        priceRange: "free",
        description: "Curated indie music collection",
        featured: false
    }
];

// Product management object with methods
const ProductManager = {
    products: productData,
    currentFilters: {
        category: 'all',
        price: 'all'
    },
    
    // Method to get filtered products using higher-order functions
    getFilteredProducts() {
        return this.products.filter(product => {
            const categoryMatch = this.currentFilters.category === 'all' || 
                                product.category === this.currentFilters.category;
            const priceMatch = this.currentFilters.price === 'all' || 
                             product.priceRange === this.currentFilters.price;
            return categoryMatch && priceMatch;
        });
    },
    
    // Method to render products using forEach
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        const filteredProducts = this.getFilteredProducts();
        
        // Clear existing products
        grid.innerHTML = '';
        
        // Use forEach to create product cards
        filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
        
        // Show message if no products found
        if (filteredProducts.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--muted);">No products found matching your filters.</p>';
        }
    },
    
    // Method to create product card element
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-title">${product.title}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-price">${product.price === 0 ? 'Free' : '$' + product.price}</div>
            <div class="product-description">${product.description}</div>
        `;
        
        // Add click event with sound effect
        card.addEventListener('click', () => {
            this.selectProduct(product);
            playSound('success');
        });
        
        return card;
    },
    
    // Method to handle product selection
    selectProduct(product) {
        console.log('Selected product:', product);
        // You could show a modal or navigate to product details here
    },
    
    // Method to update filters
    updateFilters(category, price) {
        this.currentFilters.category = category;
        this.currentFilters.price = price;
        this.renderProducts();
    },
    
    // Method to clear filters
    clearFilters() {
        this.currentFilters = { category: 'all', price: 'all' };
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('priceFilter').value = 'all';
        this.renderProducts();
    }
};

// Contact form functionality with async fetch
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('contactFeedback');
    
    if (!form || !feedback) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        feedback.className = 'contact-feedback';
        feedback.textContent = 'Sending message...';
        feedback.style.display = 'block';
        
        try {
            // Simulate async POST request (replace with real endpoint)
            const response = await simulateFormSubmission(data);
            
            if (response.success) {
                showFeedback('success', 'Message sent successfully! We\'ll get back to you soon.');
                form.reset();
                playSound('success');
                // Notify jQuery spinner handler
                document.dispatchEvent(new Event('contactFormCompleted'));
            } else {
                throw new Error(response.message || 'Failed to send message');
            }
        } catch (error) {
            showFeedback('error', 'Failed to send message. Please try again.');
            playSound('error');
            // Notify jQuery spinner handler
            document.dispatchEvent(new Event('contactFormCompleted'));
        }
    });
    
    // Callback function to show feedback
    function showFeedback(type, message) {
        feedback.className = `contact-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.display = 'block';
        
        // Hide feedback after 5 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }
}

// Simulate form submission (replace with real API call)
async function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate success/failure
            const success = Math.random() > 0.2; // 80% success rate
            resolve({
                success: success,
                message: success ? 'Message sent' : 'Server error'
            });
        }, 1500);
    });
}

// Keyboard interaction with switch statement
function initKeyboardDemo() {
    const keyDisplay = document.getElementById('keyDisplay');
    if (!keyDisplay) return;
    
    document.addEventListener('keydown', function(e) {
        let message = '';
        let soundType = 'notification';
        
        // Switch statement for different key responses
        switch(e.key.toLowerCase()) {
            case 'a':
                message = '🎵 Key A pressed - Music mode!';
                soundType = 'success';
                break;
            case 's':
                message = '⭐ Key S pressed - Star rating!';
                soundType = 'success';
                break;
            case 'd':
                message = '🌙 Key D pressed - Dark mode toggle!';
                soundType = 'notification';
                break;
            case 'f':
                message = '🔥 Key F pressed - Featured content!';
                soundType = 'success';
                break;
            case 'arrowup':
                message = '⬆️ Up arrow - Scroll up!';
                break;
            case 'arrowdown':
                message = '⬇️ Down arrow - Scroll down!';
                break;
            case 'arrowleft':
                message = '⬅️ Left arrow - Previous!';
                break;
            case 'arrowright':
                message = '➡️ Right arrow - Next!';
                break;
            case 'escape':
                message = '❌ Escape - Close/Cancel!';
                soundType = 'error';
                break;
            case 'enter':
                message = '✅ Enter - Confirm/Submit!';
                soundType = 'success';
                break;
            default:
                message = `🔤 "${e.key}" pressed - Try A, S, D, F, or arrow keys!`;
        }
        
        keyDisplay.textContent = message;
        keyDisplay.classList.add('active');
        
        // Play sound effect
        playSound(soundType);
        
        // Remove active class after animation
        setTimeout(() => {
            keyDisplay.classList.remove('active');
        }, 300);
    });
}

// Sound effects functionality
function initSoundEffects() {
    const notificationBtn = document.getElementById('playNotification');
    const successBtn = document.getElementById('playSuccess');
    const errorBtn = document.getElementById('playError');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => `playSound`('notification'));
    }
    
    if (successBtn) {
        successBtn.addEventListener('click', () => playSound('success'));
    }
    
    if (errorBtn) {
        errorBtn.addEventListener('click', () => playSound('error'));
    }
}

// Play sound function using Web Audio API
function playSound(type) {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Different frequencies for different sound types
    const frequencies = {
        notification: [800, 600],
        success: [523, 659, 784], // C, E, G chord
        error: [300, 250]
    };
    
    const freq = frequencies[type] || frequencies.notification;
    
    // Create and play tones
    freq.forEach((frequency, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = type === 'error' ? 'sawtooth' : 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
    });
}

// Animation functionality
function initAnimations() {
    const animateBtn = document.getElementById('animateBox');
    const animationBox = document.getElementById('animationBox');
    
    if (!animateBtn || !animationBox) return;
    
    animateBtn.addEventListener('click', function() {
        // Add animation class
        animationBox.classList.add('animate');
        
        // Play sound effect
        playSound('success');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            animationBox.classList.remove('animate');
        }, 600);
        
        // Chain multiple animations using callbacks
        setTimeout(() => {
            animateElement(animationBox, 'bounce');
        }, 700);
    });
}

// Animation helper function with callback
function animateElement(element, animationType, callback) {
    switch(animationType) {
        case 'bounce':
            element.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                element.style.transform = 'translateY(0)';
                if (callback) callback();
            }, 200);
            break;
        case 'shake':
            element.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                element.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    element.style.transform = 'translateX(0)';
                    if (callback) callback();
                }, 100);
            }, 100);
            break;
    }
}

// Product filtering functionality
function initProductFiltering() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const clearBtn = document.getElementById('clearFilters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            ProductManager.updateFilters(this.value, priceFilter.value);
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            ProductManager.updateFilters(categoryFilter.value, this.value);
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            ProductManager.clearFilters();
        });
    }
    
    // Initial render
    ProductManager.renderProducts();
}

// Higher-order function example: Array manipulation utilities
const ArrayUtils = {
    // Map function to transform product data
    mapProducts: (products, transformer) => products.map(transformer),
    
    // Filter function with custom predicate
    filterProducts: (products, predicate) => products.filter(predicate),
    
    // Reduce function to calculate statistics
    getProductStats: (products) => {
        return products.reduce((stats, product) => {
            stats.total++;
            stats.totalValue += product.price;
            stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
            return stats;
        }, { total: 0, totalValue: 0, categories: {} });
    },
    
    // Sort products by different criteria
    sortProducts: (products, sortBy) => {
        return [...products].sort((a, b) => {
            switch(sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    validateForm('subscriptionForm');
    validateForm('contactForm');
    validateForm('profileSubscriptionForm');
    validateForm('profileContactForm');
    validateForm('popupSubscriptionForm');
    initAccordion();
    initPopup();
    initBackgroundChanger();
    initDateTime();
    initSearch();
    initFilters();
    initRating();
    initThemeToggle();
    initImageGallery();
    initTimeButton();
    
    // Initialize new advanced features
    initContactForm();
    initProductFiltering();
    initKeyboardDemo();
    initSoundEffects();
    initAnimations();
    
    // Log product statistics using higher-order functions
    const stats = ArrayUtils.getProductStats(productData);
    console.log('Product Statistics:', stats);
    
    // Example of using higher-order functions
    const freeProducts = ArrayUtils.filterProducts(productData, product => product.price === 0);
    console.log('Free Products:', freeProducts);
    
    const productTitles = ArrayUtils.mapProducts(productData, product => product.title);
    console.log('All Product Titles:', productTitles);

    console.log('SenQubyr JavaScript initialized successfully!');
});

// ================= jQuery Tasks =================
// Here is task 1: Real-time Search and Live Filter
$(function() {
    const $searchInput = $('#jqSearchInput');
    const $searchListItems = $('#jqSearchList li');
    const $suggestions = $('#jqSuggestions');
    const suggestionSource = (window.productData || []).map(p => p.title);

    $searchInput.on('keyup', function() {
        const query = $(this).val().toLowerCase();

        // Filter list items in real-time
        $searchListItems.filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
        });

        // Here is task 2: Autocomplete Search Suggestions
        const suggestions = suggestionSource
            .filter(title => title.toLowerCase().includes(query))
            .slice(0, 5);

        if (query && suggestions.length) {
            $suggestions.empty();
            suggestions.forEach(title => {
                $suggestions.append(`<li>${title}</li>`);
            });
            $suggestions.show();
        } else {
            $suggestions.hide();
        }

        // Here is task 3: Search Highlighting
        highlightMatches('#jqHighlightArea', query);
    });

    $suggestions.on('click', 'li', function() {
        const text = $(this).text();
        $searchInput.val(text);
        $suggestions.hide();
        $searchInput.trigger('keyup');
    });

    // Highlight helper using regex & .html()
    function highlightMatches(selector, query) {
        const $el = $(selector);
        if (!$el.data('original')) {
            $el.data('original', $el.html());
        }
        const original = $el.data('original');
        if (!query) {
            $el.html(original);
            return;
        }
        try {
            const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'gi');
            const highlighted = original.replace(regex, '<span class="jq-highlight">$1</span>');
            $el.html(highlighted);
        } catch (e) {
            $el.html(original);
        }
    }

    // Here is task 4: Colorful Scroll Progress Bar
    const $progressBar = $('#scrollProgressBar');
    const updateProgress = function() {
        const s = $(window).scrollTop();
        const docH = $(document).height();
        const winH = $(window).height();
        const pct = Math.max(0, Math.min(100, Math.round((s / (docH - winH)) * 100)));
        $progressBar.css('width', pct + '%');
    };
    $(window).on('scroll resize', updateProgress);
    updateProgress();

    // Here is task 5: Animated Number Counter
    const $counters = $('.counter');
    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        $counters.each(function() {
            const $c = $(this);
            const target = parseInt($c.data('target'), 10) || 0;
            const duration = 1500;
            const start = performance.now();
            function tick(now) {
                const progress = Math.min(1, (now - start) / duration);
                const val = Math.floor(progress * target);
                $c.text(val);
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }
    const countersInView = function() {
        const st = $(window).scrollTop();
        const wh = $(window).height();
        const top = $('.jq-counter-section').offset()?.top || 0;
        if (st + wh >= top + 50) startCounters();
    };
    $(window).on('scroll resize', countersInView);
    countersInView();

    // Here is task 6: Loading spinner on Submit (using jQuery)
    $('#contactForm').on('submit', function() {
        const $btn = $(this).find('button[type="submit"]');
        $btn.addClass('loading').prop('disabled', true).text('Please wait…');
    });
    // Revert when the contact form async completes
    $(document).on('contactFormCompleted', function() {
        const $btn = $('#contactForm').find('button[type="submit"]');
        $btn.removeClass('loading').prop('disabled', false).text('Send Message');
    });

    // Here is task 7: Notification System (Toast)
    window.jqNotify = function(message, type = 'info') {
        const $toast = $(`<div class="jq-toast ${type}">${message}</div>`).appendTo('body');
        setTimeout(() => { $toast.fadeOut(500, () => $toast.remove()); }, 2000);
    };
    // Example: show a toast when filters change
    $('#categoryFilter, #priceFilter').on('change', function() {
        window.jqNotify('Filters applied', 'info');
    });

    // Here is task 8: Copied to Clipboard Button
    $('#copyBtn').on('click', async function() {
        const text = $('#copyText').text();
        try {
            await navigator.clipboard.writeText(text);
            $(this).addClass('copied').text('Copied!');
            $('#copyTooltip').addClass('show');
            setTimeout(() => {
                $('#copyTooltip').removeClass('show');
            }, 1200);
        } catch (e) {
            window.jqNotify('Failed to copy', 'error');
        }
    });

    // Here is task 9: Image Lazy Loading
    function lazyLoadImages() {
        $('.lazy-load').each(function() {
            const $img = $(this);
            if ($img.data('loaded')) return;
            const rect = this.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
                const src = $img.attr('data-src');
                if (src) {
                    $img.attr('src', src);
                    $img.data('loaded', true);
                }
            }
        });
    }
    $(window).on('scroll resize', lazyLoadImages);
    lazyLoadImages();
});

$(document).ready(function() {
    let nextPageToken = null;
    let currentQuery = 'new kazakh music';
    let isLoading = false;
    const API_KEY = 'AIzaSyAeI_U0o8VJpabxYvl7uqYqwWGwmvQtnxo';

    // --- Логика для всплывающих окон (Popups) ---
    $('[data-popup-open]').on('click', function() {
        var popupId = $(this).data('popup-open');
        $('#' + popupId).fadeIn();
    });

    $('[data-popup-close]').on('click', function() {
        $(this).closest('.popup-overlay').fadeOut();
    });

    $('.popup-overlay').on('click', function(e) {
        if ($(e.target).is('.popup-overlay')) {
            $(this).fadeOut();
        }
    });

    // --- Обработчики для кнопок в футере ---
    $('#aboutBtn').on('click', function(e) {
        e.preventDefault();
        alert('SenQubyr is a project by Beknur Erdembek and Alisher Bolatkhanov created in 2025.');
    });
    $('#rulesBtn').on('click', function(e) {
        e.preventDefault();
        alert('Rules: Be respectful to other users. No spamming or posting inappropriate content.');
    });
    $('#privacyBtn').on('click', function(e) {
        e.preventDefault();
        alert('Privacy Policy: We value your privacy. Your data is not shared with third parties.');
    });

    // --- Функция для загрузки основных видео ---
    function fetchMainVideos(query, isAppending = false, pageToken = null) {
        const videoGrid = $('#video-grid-main');
        if (isLoading) return;
        isLoading = true;
        $('#loading-indicator').show();

        let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=8&type=video&key=${API_KEY}`;
        if (pageToken) {
            apiUrl += `&pageToken=${pageToken}`;
        }

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(response) {
                nextPageToken = response.nextPageToken || null;
                let videoHtml = '';
                if (response.items.length === 0 && !isAppending) {
                    videoGrid.html('<p>No videos found.</p>');
                    return;
                }
                response.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const title = item.snippet.title;
                    const channelTitle = item.snippet.channelTitle;
                    const thumbnailUrl = item.snippet.thumbnails.high.url;
                    const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString();
                    videoHtml += `
                        <div class="tile">
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="text-decoration: none;">
                                <div class="thumb thumb-lg">
                                    <img src="${thumbnailUrl}" alt="${title}">
                                </div>
                                <div class="tmeta">
                                    <p class="ttitle">${title}</p>
                                    <p class="tsub">${channelTitle} • ${publishedAt}</p>
                                </div>
                            </a>
                        </div>
                    `;
                });

                if (isAppending) {
                    videoGrid.append(videoHtml);
                } else {
                    videoGrid.html(videoHtml);
                }
            },
            error: function() {
                videoGrid.html('<p>Error loading videos. Please check your API key or network connection.</p>');
            },
            complete: function() {
                isLoading = false;
                $('#loading-indicator').hide();
            }
        });
    }

    // --- Функция для загрузки "Shorts" ---
    function fetchShorts() {
        const shortsGrid = $('#shorts-grid');
        const shortsQuery = 'latest #shorts';
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(shortsQuery)}&maxResults=4&type=video&key=${API_KEY}`;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(response) {
                let videoHtml = '';
                response.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const title = item.snippet.title;
                    const channelTitle = item.snippet.channelTitle;
                    const thumbnailUrl = item.snippet.thumbnails.high.url;
                    videoHtml += `
                        <div class="tile">
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="text-decoration: none;">
                                <div class="thumb thumb-shorts">
                                    <img src="${thumbnailUrl}" alt="${title}">
                                </div>
                                <div class="tmeta">
                                    <p class="short-title">${title}</p>
                                    <p class="tsub">${channelTitle}</p>
                                </div>
                            </a>
                        </div>
                    `;
                });
                shortsGrid.html(videoHtml);
            },
            error: function() {
                shortsGrid.html('<p>Error loading shorts.</p>');
            }
        });
    }

    // --- Логика поиска ---
    function handleSearch() {
        const query = $('#search').val().trim();
        $('#search-suggestions').hide();
        if (query !== '') {
            currentQuery = query;
            nextPageToken = null;
            $('#grid-title').text(`Search Results for "${query}"`);
            fetchMainVideos(currentQuery, false, null);
        }
    }

    $('#searchBtn').on('click', function(e) {
        e.preventDefault();
        handleSearch();
    });

    $('#search').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            handleSearch();
        }
    });

    // --- Логика для подсказок поиска ---
    $('#search').on('keyup', function() {
        const query = $(this).val();
        if (query.length < 2) {
            $('#search-suggestions').hide();
            return;
        }

        $.ajax({
            url: 'https://suggestqueries.google.com/complete/search',
            dataType: 'jsonp',
            data: { client: 'youtube', ds: 'yt', q: query },
            success: function(data) {
                const suggestions = data[1];
                let suggestionsHtml = '';
                suggestions.forEach(suggestion => {
                    suggestionsHtml += `<div class="suggestion-item">${suggestion[0]}</div>`;
                });
                $('#search-suggestions').html(suggestionsHtml).show();
            }
        });
    });

    $(document).on('click', '.suggestion-item', function() {
        $('#search').val($(this).text());
        $('#search-suggestions').hide();
        handleSearch();
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search').length) {
            $('#search-suggestions').hide();
        }
    });

    const isLikedPage = $('body').find('.liked-tile').length > 0;
    const isHistoryPage = $('body').find('.history-tile').length > 0;
    const isStaticPage = isLikedPage || isHistoryPage;

    if ($('#video-grid-main').length > 0 && !isStaticPage) {

        // 1. Запускаем начальную загрузку видео
        fetchMainVideos(currentQuery);

        // 2. Включаем бесконечную прокрутку
        $(window).on('scroll', function() {
            if (!isLoading && nextPageToken && ($(window).scrollTop() + $(window).height() >= $(document).height() - 250)) {
                fetchMainVideos(currentQuery, true, nextPageToken);
            }
        });
    }

    if ($('#shorts-grid').length > 0) {
        fetchShorts();
    }

});