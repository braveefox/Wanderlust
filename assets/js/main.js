document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Booking Form Validation ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const feedbackEl = document.getElementById('booking-feedback');
        const inputs = bookingForm.querySelectorAll('input[required]');

        const validateField = (field) => {
            const fieldId = field.id;
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Hide error message initially
            const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
            if (errorEl) errorEl.classList.add('hidden');

            switch (field.type) {
                case 'text':
                    isValid = value.length >= 2;
                    break;
                case 'email':
                    isValid = /.+@.+\..+/.test(value);
                    break;
                case 'date':
                    if (fieldId === 'endDate') {
                        const startDate = new Date(document.getElementById('startDate').value);
                        const endDate = new Date(value);
                        isValid = endDate > startDate;
                    } else {
                        isValid = !!value;
                    }
                    break;
                case 'number':
                    isValid = parseInt(value, 10) >= 1;
                    break;
                default:
                    isValid = !!value;
            }

            if (!isValid && errorEl) {
                errorEl.classList.remove('hidden');
            }
            return isValid;
        };

        // Validate on form submission
        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();

            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // In a real application, you would send the data to a server here using fetch()
                // fetch('/api/booking', { method: 'POST', body: new FormData(bookingForm) })
                //   .then(response => response.json())
                //   .then(data => { ... });

                feedbackEl.textContent = "Thank you! We'll be in touch shortly.";
                feedbackEl.className = 'text-green-600 font-medium';
                feedbackEl.classList.remove('hidden');
                bookingForm.reset();

                setTimeout(() => {
                    feedbackEl.classList.add('hidden');
                }, 5000); // Hide message after 5 seconds

            } else {
                feedbackEl.textContent = 'Please correct the errors above.';
                feedbackEl.className = 'text-red-600 font-medium';
                feedbackEl.classList.remove('hidden');
            }
        });

        // Add real-time validation on blur (when user leaves a field)
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
        });
    }

    // --- Lightbox for Gallery ---
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryImages.length > 0 && lightbox && lightboxImg && lightboxClose) {
        let lastFocusedElement;

        const openLightbox = (img) => {
            lastFocusedElement = document.activeElement;
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            // For full accessibility, you should trap focus inside the modal.
            // This means preventing tabbing outside the lightbox and its close button.
            lightboxClose.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            lightboxImg.src = '';
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        galleryImages.forEach((img) => {
            img.addEventListener('click', () => openLightbox(img));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) closeLightbox();
        });
    }

    // --- Dynamic Copyright Year ---
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});