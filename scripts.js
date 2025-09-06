// import { handleSubmit } from "./database";

// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all UI elements
    initializeUI();
    
    // Initialize all form validation
    initializeFormValidation();
    
    // Initialize particle animation
    initializeParticles();
});

// UI Elements Initialization
function initializeUI() {
    // Contact us popup functionality
    initializeContactPopup();
    
    // Landing page and form transitions
    initializeLandingPage();
    
    // Audio controls
    initializeAudioControls();
    
    // Team selection handling
    initializeTeamSelection();
}

// Initialize contact popup functionality
function initializeContactPopup() {
    const contactUsBtn = document.getElementById('contact-us-btn');
    const popup = document.getElementById('popup');
    
    if (contactUsBtn && popup) {
        contactUsBtn.addEventListener('click', function() {
            popup.classList.toggle('active');
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === popup) {
                popup.classList.remove('active');
            }
        });
    }
}

// Initialize landing page transitions
function initializeLandingPage() {
    const applyBtn = document.getElementById('apply-btn');
    const landingPage = document.getElementById('landing-page');
    const formContainer = document.getElementById('form-container');
    const loading = document.getElementById('loading');
    const scrollToFormBtn = document.getElementById('scroll-to-form');
    
    if (applyBtn && landingPage && formContainer) {
        applyBtn.addEventListener('click', function() {
            if (loading) loading.classList.add('active');
            
            // Play background music if it exists
            const audio = document.getElementById('background-music');
            if (audio) {
                audio.volume = 0.4;
                audio.play().catch(e => {
                    console.warn('Audio autoplay was prevented:', e);
                });
                
                const audioControls = document.getElementById('audio-controls');
                if (audioControls) audioControls.style.display = 'flex';
            }
            
            setTimeout(() => {
                landingPage.classList.add('slide-up');
                formContainer.style.display = 'block';
                
                window.scrollTo(0, 0);
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    if (loading) loading.classList.remove('active');
                    document.body.style.overflow = '';
                    if (audio && audio.paused) {
                        audio.play().catch(e => {
                            console.warn('Audio autoplay was still prevented:', e);
                        });
                    }
                }, 800);
            }, 1000);
        });
    }
    
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', function() {
            const formElement = document.querySelector('.form-container');
            if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Initialize audio controls
function initializeAudioControls() {
    const audio = document.getElementById('background-music');
    const muteBtn = document.getElementById('mute-btn');
    const volumeControl = document.getElementById('volume-control');
    const stopBtn = document.getElementById('stop-btn');

        // Set the initial volume to 40 when the page loads
        if (audio) {
            audio.volume = 0.4; // 40% volume
        }
    
        // Set volume control to 40%
        if (volumeControl) {
            volumeControl.value = 40;
        }

    // Mute/Unmute Toggle
    if (muteBtn) {
        muteBtn.addEventListener('click', function () {
            audio.muted = !audio.muted;
            muteBtn.textContent = audio.muted ? '🔇' : '🔊';
            volumeControl.value = audio.muted ? 0 : audio.volume * 100;
        });
    }

    // Volume Control
    if (volumeControl) {
        volumeControl.addEventListener('input', function () {
            const volume = this.value / 100;
            audio.volume = volume;
            audio.muted = volume === 0;
            muteBtn.textContent = volume === 0 ? '🔇' : '🔊';
        });
        volumeControl.value = audio.volume * 100;
    }

    // Play/Pause Toggle
    if (stopBtn) {
        stopBtn.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                stopBtn.textContent = '⏸️';
            } else {
                audio.pause();
                stopBtn.textContent = '▶️';
            }
        });
    }
}

// Initialize team selection
function initializeTeamSelection() {
    const preferredTeam1 = document.getElementById('preferredTeam1');
    const preferredTeam2 = document.getElementById('preferredTeam2');
    const additionalPreferences = document.getElementById('additional-preferences');
    
    if (preferredTeam1 && additionalPreferences) {
        function updateAdditionalPreferences() {
            const teams = [];
            if (preferredTeam1) teams.push(preferredTeam1.value);
            if (preferredTeam2) teams.push(preferredTeam2.value);
            
            const allSections = additionalPreferences.querySelectorAll('.section');
            allSections.forEach(section => section.style.display = 'none');
            
            teams.forEach(team => {
                if (team) {
                    const section = document.getElementById(`${team}-team`);
                    if (section) section.style.display = 'block';
                }
            });
            
            // Update required attributes for visible/hidden fields
            updateRequiredAttributes();
        }
        
        preferredTeam1.addEventListener('change', updateAdditionalPreferences);
        if (preferredTeam2) {
            preferredTeam2.addEventListener('change', updateAdditionalPreferences);
        }
        
        // Initialize sections on page load
        updateAdditionalPreferences();
    }
    
    // Initialize course and branch dropdowns
    const courseSelect = document.getElementById('course');
    if (courseSelect) {
        courseSelect.addEventListener('change', updateBranches);
    }
    
    const branchSelect = document.getElementById('branch');
    if (branchSelect) {
        branchSelect.addEventListener('change', updatesp);
    }
}

// Initialize particles animation
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 30 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        const duration = Math.random() * 10 + 5;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Form Validation Initialization
function initializeFormValidation() {
    // Phone number validation
    initializePhoneValidation();
    
    // Email validation
    initializeEmailValidation();
    
    // Link validation
    initializeLinkValidation();
    
    // Form submission handling
    initializeFormSubmission();
}

// Initialize phone number validation
function initializePhoneValidation() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        const phoneError = document.getElementById('phoneError');
        phoneInput.addEventListener('input', function() {
            validatePhoneNumber(phoneInput, phoneError);
        });
        
        if (phoneError) {
            phoneInput.addEventListener('blur', function() {
                validatePhoneNumber(phoneInput, phoneError);
            });
        }
    }
}

// Phone number validation function
function validatePhoneNumber(input, errorElement) {
    if (!input || !errorElement) return;
    
    const phoneNumber = input.value.trim();
    
    if (/^\d{10}$/.test(phoneNumber)) {
        errorElement.style.display = 'none';
        input.style.border = '2px solid green';
        input.setCustomValidity('');
    } else {
        errorElement.style.display = 'block';
        input.style.border = '2px solid red';
        input.setCustomValidity('Please enter a valid 10-digit number.');
    }
}

// Initialize email validation
function initializeEmailValidation() {
    const officialEmailInput = document.getElementById('officialEmail');
    if (!officialEmailInput) return;
    
    const officialEmailError = document.getElementById('officialEmailError');
    if (!officialEmailError) return;
    
    officialEmailInput.addEventListener('blur', function() {
        const email = officialEmailInput.value.trim();
        if (email && !email.includes('@srmist.edu.in')) {
            officialEmailError.style.display = 'block';
            officialEmailInput.setCustomValidity('Official email must contain @srmist.edu.in');
        } else {
            officialEmailError.style.display = 'none';
            officialEmailInput.setCustomValidity('');
        }
    });
}

// Initialize link validation
function initializeLinkValidation() {
    const linkInputs = {
        'githubLink': document.getElementById('githubLink'),
        // 'linkedinLink': document.getElementById('linkedinLink'),
        'instagramLink': document.getElementById('instagramLink'),
        'xLink': document.getElementById('xLink'),
        'portfolioLink': document.getElementById('portfolioLink'),
        'portfolioLinkContent': document.getElementById('portfolioLinkContent'),
        'portfolioLinkSocial': document.getElementById('portfolioLinkSocial'),
        'portfolioLinkDesign': document.getElementById('portfolioLinkDesign'),
        'portfolioLinkEditing': document.getElementById('portfolioLinkEditing')
    };
    
    const linkErrors = {
        'githubLink': document.getElementById('githubLinkError'),
        // 'linkedinLink': document.getElementById('linkedinLinkError'),
        'instagramLink': document.getElementById('instagramLinkError'),
        'xLink': document.getElementById('xLinkError')
    };
    
    const allowedDomains = ['github.com', 'linkedin.com', 'instagram.com', 'x.com', 'twitter.com'];
    
    // Set up validation for each link input that exists
    for (const [key, input] of Object.entries(linkInputs)) {
        if (input) {
            const errorElement = linkErrors[key];
            if (errorElement) {
                input.addEventListener('blur', function() {
                    validateLink(input, errorElement, allowedDomains);
                });
            }
        }
    }
}

// Link validation function
function validateLink(input, errorElement, allowedDomains) {
    if (!input || !errorElement) return;
    
    const linkValue = input.value.trim();
    if (!linkValue) {
        errorElement.style.display = 'none';
        input.setCustomValidity('');
        return;
    }
    
    try {
        const url = new URL(linkValue);
        if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
            errorElement.style.display = 'block';
            input.setCustomValidity('Enter a valid GitHub, LinkedIn, Instagram, or X.com link.');
        } else {
            errorElement.style.display = 'none';
            input.setCustomValidity('');
        }
    } catch (e) {
        errorElement.style.display = 'block';
        input.setCustomValidity('Enter a valid URL.');
    }
}

// Initialize form submission
function initializeFormSubmission() {
    // Fix for the "An invalid form control is not focusable" error
    const form = document.getElementById('recruitmentForm') || document.getElementById('recruitment-form');
    if (!form) return;
    
    // Add novalidate to prevent browser's built-in validation
    form.setAttribute('novalidate', 'true');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Update required attributes for hidden fields
        updateRequiredAttributes();
        
        // Custom validation
        if (!validateForm(form)) {
            alert('Please fill out all required fields correctly.');
            return;
        }
        
        // If we have our Supabase client and the form passes validation
        if (typeof insertUsers === 'function') {
            handleFormSubmission(form);
        } else {
            // Fallback if no Supabase
            const formContainer = document.getElementById('form-container');
            const thankYouPage = document.getElementById('thank-you-page');
            
            if (formContainer && thankYouPage) {
                formContainer.style.display = 'none';
                thankYouPage.style.display = 'block';
                window.scrollTo(0, 0);
            }
        }
    });
}

// Update required attributes based on field visibility
function updateRequiredAttributes() {
    document.querySelectorAll('input, select, textarea').forEach(field => {
        const isHidden = isElementHidden(field);
        
        if (isHidden && field.hasAttribute('required')) {
            field.dataset.wasRequired = 'true';
            field.removeAttribute('required');
        } else if (!isHidden && field.dataset.wasRequired === 'true') {
            field.setAttribute('required', 'true');
        }
    });
}

// Check if an element is hidden
function isElementHidden(element) {
    // Check the element itself and all parent elements
    let current = element;
    while (current) {
        const style = window.getComputedStyle(current);
        if (style.display === 'none' || style.visibility === 'hidden' || 
            parseInt(style.opacity, 10) === 0 || style.height === '0px') {
            return true;
        }
        
        // Also check if it's inside a hidden team section
        if (current.closest && current.closest('.section') && 
            window.getComputedStyle(current.closest('.section')).display === 'none') {
            return true;
        }
        
        current = current.parentElement;
    }
    return false;
}

// Validate the entire form
function validateForm(form) {
    let isValid = true;
    
    // Validate visible required fields
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (!isElementHidden(field) && !field.validity.valid) {
            isValid = false;
            field.reportValidity(); // Show validation message
        }
    });
    
    return isValid;
}

// Handle form submission with Supabase
import { handleSubmit } from "./database.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('recruitmentForm');
    if (form) {
        form.addEventListener('submit', handleSubmit); // Call handleSubmit from database.js
    } else {
        console.error("Recruitment form not found.");
    }
});


// The following functions are kept for backward compatibility
// with your existing code that might be calling them

function updatesp() {
    const specializationSelect = document.getElementById('specialization');
    const branchSelect = document.getElementById('branch');
    if (!specializationSelect || !branchSelect) return;
    
    const branchValue = branchSelect.value;
    const specialization = {
        cse: ["Core", "AI & ML", "Cyber Security", "Data Science", "Cloud Computing", "IoT"],
        ece: ["Core"],
        mechanical: ["Core"],
        civil: ["Core"],
        it: ["Core"],
        general: ["General"],
        data_science: ["General"],
        chemistry: ["General"],
        physics: ["General"],
        mathematics: ["General"],
        phd_in_pharmacy: ["General"],
        phd_computer_science_applications: ["General"],
        phd_management: ["General"],
        phd_engineering: ["General"],
        automobile: ["Core"],
        csbs: ["Core"]
    };
    
    specializationSelect.innerHTML = '<option value="" disabled selected>Select your Specialization.</option>';
    if (specialization[branchValue]) {
        specialization[branchValue].forEach(spec => {
            let option = document.createElement("option");
            option.value = spec.toLowerCase().replace(/\s+/g, "_");
            option.textContent = spec;
            option.style.color = "#000000";
            specializationSelect.appendChild(option);
        });
    }
    
    // Update required attributes after changing options
    updateRequiredAttributes();
}

function updateBranches() {
    const branchSelect = document.getElementById('branch');
    const courseSelect = document.getElementById('course');
    if (!branchSelect || !courseSelect) return;
    
    const courseValue = courseSelect.value;
    const branches = {
        btech: ["CSE", "ECE", "Mechanical", "Civil", "IT", "Automobile", "CSBS"],
        bca: ["General", "Data Science"],
        mca: ["General"],
        bba: ["General"],
        mba: ["General"],
        pharma: ["General"],
        bsc: ["Physics", "Chemistry", "Mathematics"],
        hotel: ["General"],
        phd: ["PhD_in_Pharmacy", "PhD_Computer_Science_Applications", "PhD_Management", "PhD_Engineering"]
    };

    branchSelect.innerHTML = '<option value="" disabled selected>Select your Branch.</option>';

    if (branches[courseValue]) {
        branches[courseValue].forEach(branch => {
            let option = document.createElement("option");
            option.value = branch.toLowerCase().replace(/\s+/g, "_");
            option.textContent = branch;
            option.style.color = "#000000";
            branchSelect.appendChild(option);
        });
    }
    
    // Update required attributes after changing options
    updateRequiredAttributes();
}

document.addEventListener("DOMContentLoaded", function () {
    let audioControls = document.getElementById("audio-controls");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 350) { 
            audioControls.style.opacity = "1";
        } else {
            audioControls.style.opacity = "0";
        }
    });
});