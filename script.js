document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Navigation & Mobile Menu
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close Mobile Menu on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    /* ==========================================================================
       Hero Slider Animation
       ========================================================================== */
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.section-reveal, .reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       Counter Animation
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps approx

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const highlightsSection = document.getElementById('highlights');
    if (highlightsSection) {
        counterObserver.observe(highlightsSection);
    }

    /* ==========================================================================
       Unit Types Tabs
       ========================================================================== */
    const unitTabBtns = document.querySelectorAll('.tab-btn');
    const unitTabContents = document.querySelectorAll('.tab-content');

    unitTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            unitTabBtns.forEach(b => b.classList.remove('active'));
            unitTabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ==========================================================================
       Location Tabs
       ========================================================================== */
    const locTabBtns = document.querySelectorAll('.loc-tab-btn');
    const locTabContents = document.querySelectorAll('.loc-list');

    locTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            locTabBtns.forEach(b => b.classList.remove('active'));
            locTabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ==========================================================================
       EMI Calculator
       ========================================================================== */
    const priceSlider = document.getElementById('price-slider');
    
    // Only run EMI calculator if elements exist on this page
    if (priceSlider) {
        const dpSlider = document.getElementById('dp-slider');
        const roiInput = document.getElementById('roi-input');
        const tenureRadios = document.getElementsByName('tenure');
        
        // Output Elements
        const priceVal = document.getElementById('price-val');
        const dpVal = document.getElementById('dp-val');
        const resLoan = document.getElementById('res-loan');
        const resEmi = document.getElementById('res-emi');
        const resTotal = document.getElementById('res-total');

        function calculateEMI() {
            const propertyPrice = parseFloat(priceSlider.value) * 100000; // in Rupees
            const dpPercent = parseFloat(dpSlider.value);
            const roi = parseFloat(roiInput.value);
            
            // Find selected tenure
            let years = 15;
            for (let i = 0; i < tenureRadios.length; i++) {
                if (tenureRadios[i].checked) {
                    years = parseInt(tenureRadios[i].value);
                    break;
                }
            }

            // Calculations
            const downPaymentAmount = (propertyPrice * dpPercent) / 100;
            const loanAmount = propertyPrice - downPaymentAmount;
            
            const monthlyRate = roi / 12 / 100;
            const months = years * 12;

            let emi = 0;
            let totalPayable = 0;

            if (monthlyRate > 0) {
                emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
                totalPayable = emi * months;
            } else {
                emi = loanAmount / months;
                totalPayable = loanAmount;
            }

            // Update UI
            priceVal.innerText = priceSlider.value;
            dpVal.innerText = dpSlider.value;
            
            // Format to Indian Currency String
            const formatter = new Intl.NumberFormat('en-IN');
            resLoan.innerText = formatter.format(Math.round(loanAmount));
            resEmi.innerText = formatter.format(Math.round(emi));
            resTotal.innerText = formatter.format(Math.round(totalPayable));
        }

        // Attach Event Listeners for EMI Calc
        priceSlider.addEventListener('input', calculateEMI);
        dpSlider.addEventListener('input', calculateEMI);
        roiInput.addEventListener('input', calculateEMI);
        
        tenureRadios.forEach(radio => {
            radio.addEventListener('change', calculateEMI);
        });

        // Initial Calculation
        calculateEMI();
    }

    /* ==========================================================================
       Contact Form Submission
       ========================================================================== */
    const form = document.getElementById('enquiry-form');
    const successMsg = document.getElementById('form-success');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const name = form.querySelector('input[type="text"]').value;
            const mobile = form.querySelector('input[type="tel"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const interest = form.querySelector('select').value;
            const message = form.querySelector('textarea').value;
            
            let interestText = interest === '2bhk' ? '2 BHK Row House' : (interest === '1bhk' ? '1 BHK Flat' : interest);

            const rawMessage = `Hello, Enquiry for Shivsamarth Residency\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nInterested In: ${interestText}\nMessage: ${message}`;
            const whatsappMessage = encodeURIComponent(rawMessage);
            const whatsappNumber = '917741003311'; // +91 77410 03311

            // Redirect to WhatsApp
            window.location.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            
            // Show success message
            successMsg.style.display = 'block';
            // Optional: reset form
            form.reset();
            
            // Hide after 5 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        });
    }

});
