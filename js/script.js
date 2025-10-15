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

    console.log('SenQubyr JavaScript initialized successfully!');
});