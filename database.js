import supabase from './client.js';

/**
 * Form Field Management
 * These functions handle the required attribute on form fields
 * that may be hidden or shown conditionally
 */
function removeRequiredFromHiddenFields() {
  document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
    const style = window.getComputedStyle(field);
    if (style.display === 'none' || style.visibility === 'hidden') {
      field.dataset.wasRequired = 'true';
      field.removeAttribute('required');
    }
  });
}

function restoreRequiredToHiddenFields() {
  document.querySelectorAll('[data-was-required]').forEach(field => {
    field.setAttribute('required', 'true');
    delete field.dataset.wasRequired;
  });
}

/**
 * Form State Management
 * Functions to handle saving and loading form progress
 */
function saveFormProgress() {
  const formData = {
    fullName: getElementValue('fullName'),
    regNumber: getElementValue('regNumber'),
    personalEmail: getElementValue('personalEmail'),
    officialEmail: getElementValue('officialEmail'),
    phone: getElementValue('phone'),
    currentYear: getElementValue('currentYear'),
    course: getElementValue('course'),
    branch: getElementValue('branch'),
    specialization: getElementValue('specialization'),
    sec: getElementValue('sec'),
    preferredTeam1: getElementValue('preferredTeam1')
    // Add other fields as needed
  };
  
  localStorage.setItem('recruitmentFormProgress', JSON.stringify(formData));
}

function loadFormProgress() {
  const savedData = localStorage.getItem('recruitmentFormProgress');
  if (!savedData) return;
  
  try {
    const formData = JSON.parse(savedData);
    // Populate form fields with saved data
    Object.entries(formData).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (field) field.value = value;
    });
    
    // If team is selected, show the appropriate fields
    const selectedTeam = formData.preferredTeam1;
    if (selectedTeam) {
      toggleTeamFields(selectedTeam);
    }
  } catch (error) {
    console.error('Error loading saved form data:', error);
  }
}

/**
 * Form UI Helpers
 * Functions for handling UI feedback and form display
 */
function setFormLoading(isLoading) {
  const submitButton = document.querySelector('#recruitmentForm button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading ? 'Submitting...' : 'Submit';
  }
  
  // Optionally add a loading spinner
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
  }
}

function showFieldError(fieldId, message) {
  // Remove any existing error messages
  removeFieldError(fieldId);
  
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Create and add error message
  const errorSpan = document.createElement('span');
  errorSpan.className = 'error-message';
  errorSpan.textContent = message;
  field.parentNode.appendChild(errorSpan);
  
  // Highlight the field
  field.classList.add('field-error');
}

function removeFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Remove error highlighting
  field.classList.remove('field-error');
  
  // Remove any existing error message
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

function showFormError(message) {
  const errorContainer = document.getElementById('formErrorContainer') || createErrorContainer();
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
}

function createErrorContainer() {
  const form = document.getElementById('recruitmentForm');
  const errorContainer = document.createElement('div');
  errorContainer.id = 'formErrorContainer';
  errorContainer.className = 'error-container';
  
  // Insert at the top of the form
  form.insertBefore(errorContainer, form.firstChild);
  
  return errorContainer;
}

function hideFormError() {
  const errorContainer = document.getElementById('formErrorContainer');
  if (errorContainer) {
    errorContainer.style.display = 'none';
  }
}

function toggleTeamFields(teamType) {
  // Hide all team-specific sections
  document.querySelectorAll('.team-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show the selected team section
  const selectedSection = document.getElementById(`${teamType}Section`);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  }
  
  // Update required fields
  removeRequiredFromHiddenFields();
}

/**
 * Data Helpers
 * Functions for getting, sanitizing, and validating form data
 */
function sanitizeInput(value) {
  if (!value) return '';
  // Basic sanitization - trim whitespace and convert HTML entities
  return String(value)
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getElementValue(id, defaultValue = '') {
  const element = document.getElementById(id);
  return element ? sanitizeInput(element.value) : defaultValue;
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(input => sanitizeInput(input.value));
}

function validateUserData(userData) {
  const requiredFields = ['full_name', 'reg_number', 'personal_email', 'phone_number'];
  const missingFields = requiredFields.filter(field => !userData[field]);
  
  if (missingFields.length > 0) {
    missingFields.forEach(field => {
      // Convert field name to form field ID (e.g., full_name -> fullName)
      const fieldId = field.replace(/_([a-z])/g, g => g[1].toUpperCase());
      showFieldError(fieldId, 'This field is required');
    });
    
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (userData.personal_email && !emailRegex.test(userData.personal_email)) {
    showFieldError('personalEmail', 'Please enter a valid email address');
    return false;
  }
  
  if (userData.official_email && !emailRegex.test(userData.official_email)) {
    showFieldError('officialEmail', 'Please enter a valid email address');
    return false;
  }
  
  // Validate phone number (basic validation)
  const phoneRegex = /^\d{10}$/;
  if (userData.phone_number && !phoneRegex.test(userData.phone_number.replace(/\D/g, ''))) {
    showFieldError('phone', 'Please enter a valid 10-digit phone number');
    return false;
  }
  
  return true;
}

/**
 * Database Operations
 * Functions to handle database insertions
 */
function handleConnectionError(error) {
  console.error('Connection error:', error);
  // Add more detailed error logging
  if (error.message) {
    console.error('Error message:', error.message);
  }
  if (error.details) {
    console.error('Error details:', error.details);
  }
  
  // Show user-friendly error message with more detail
  const errorMessage = error.message 
    ? `Database error: ${error.message}` 
    : 'Network connection error. Please check your internet connection and try again.';
  showFormError(errorMessage);
  return { error };
}

async function insertUsers() {
  try {
    const userData = {
      full_name: getElementValue('fullName'),
      reg_number: getElementValue('regNumber'),
      personal_email: getElementValue('personalEmail'),
      official_email: getElementValue('officialEmail'),
      phone_number: getElementValue('phone'),
      current_year: getElementValue('currentYear'),
      course: getElementValue('course'),
      branch: getElementValue('branch'),
      specialization: getElementValue('specialization'),
      section: getElementValue('sec')
    };

    if (!validateUserData(userData)) {
      throw new Error('Please fill in all required fields correctly');
    }

    // Add connection check
    if (!navigator.onLine) {
      return handleConnectionError(new Error('No internet connection'));
    }

    const result = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (result.error) {
      return handleConnectionError(result.error);
    }

    return result;
  } catch (error) {
    return handleConnectionError(error);
  }
}

async function insertTeamData(teamType, userId) {
  try {
    if (!navigator.onLine) {
      return handleConnectionError(new Error('No internet connection'));
    }

    // Add validation for userId
    if (!userId) {
      return handleConnectionError(new Error('User ID is required'));
    }

    // Skip inserting team data for "event" and "sponsorship" teams
    if (teamType === 'event' || teamType === 'sponsorship') {
      console.log(`No team data insertion for ${teamType} team.`);
      return { data: null };
    }

    let teamData = { user_id: userId };
    let tableName = '';  // Initialize tableName
    
    // Map team types to their corresponding table names
    const tableNameMap = {
      'technical': 'technical_team',
      'content': 'content_team',
      'social-media': 'socialmedia_team',  // Changed from social-media_team
      'design': 'design_team',
      'editing': 'editing_team'
    };

    // Get the correct table name
    tableName = tableNameMap[teamType];
    if (!tableName) {
      throw new Error(`Invalid team type: ${teamType}`);
    }
    
    console.log('Processing team type:', teamType);
    
    switch (teamType) {
      case 'technical':
        teamData = {
          ...teamData,
          sub_technical_genre: getElementValue('techRole'),
          resume_link: getElementValue('resumeLink'),
          github_link: getElementValue('githubLink'),
          linkedin_link: getElementValue('linkedinLink')
        };
        break;
        
      case 'content':
        teamData = {
          ...teamData,
          portfolio_link: getElementValue('portfolioLinkContent'),
          linkedin_link: getElementValue('linkedinLinkContent'),
          twitter_link: getElementValue('twitterLinkConcent'),
          instagram_link: getElementValue('instagramLinkContent')
        };
        break;
        
      case 'social-media':
        teamData = {
          ...teamData,
          portfolio_link: getElementValue('portfolioLinkSocial'),
          linkedin_link: getElementValue('linkedinLinkSocial'),
          twitter_link: getElementValue('twitterLinkSocial'),
          instagram_link: getElementValue('instagramLinkSocial'),
          discord_link: getElementValue('discordLinkSocial')
        };
        break;
        
      case 'design':
        teamData = {
          ...teamData,
          portfolio_link: getElementValue('portfolioLinkDesign'),
          design_tool: `{${getCheckedValues('designsoft').join(',')}}`
        };
        break;
        
      case 'editing':
        teamData = {
          ...teamData,
          portfolio_link: getElementValue('portfolioLinkEditing'),
          editing_tool: `{${getCheckedValues('editsoft').join(',')}}`
        };
        break;
        
      default:
        // Add more context to the error
        if (!teamType) {
          throw new Error('Team type is required');
        }
        throw new Error(`Invalid team type: ${teamType}`);
    }
    
    console.log('Sending team data:', teamData);
    console.log('Inserting into table:', tableName);

    const result = await supabase
      .from(tableName)
      .insert([teamData])
      .select();

    // Log the result
    console.log('Insert result:', result);

    if (result.error) {
      console.error('Supabase error:', result.error);
      return handleConnectionError(result.error);
    }

    return result;
  } catch (error) {
    console.error('Team data insertion error:', error);
    return handleConnectionError(error);
  }
}

/**
 * Insert Application Data
 * This function handles storing the user's team preferences in the applications table.
 */
async function insertApplicationData(userId) {
  try {
    if (!navigator.onLine) {
      return handleConnectionError(new Error('No internet connection'));
    }

    const preferredTeam1 = document.getElementById('preferredTeam1');
    const preferredTeam2 = document.getElementById('preferredTeam2');
    const reason = document.getElementById('reason');

    const applicationData = {
      user_id: userId,
      preferred_team1: preferredTeam1 ? preferredTeam1.value : null,
      preferred_team2: preferredTeam2 ? preferredTeam2.value : null,
      reason: reason ? reason.value : null
    };

    const result = await supabase
      .from('applications')
      .insert([applicationData])
      .select();

    if (result.error) {
      return handleConnectionError(result.error);
    }

    return result;
  } catch (error) {
    return handleConnectionError(error);
  }
}

/**
 * Main form submission handler
 */
export async function handleSubmit(event) {
  event.preventDefault();
  hideFormError();
  
  // Remove required from hidden fields before validation
  removeRequiredFromHiddenFields();
  
  // Set loading state
  setFormLoading(true);
  
  try {
    // Insert user data
    const userResult = await insertUsers();
    if (userResult.error) throw userResult.error;
    
    if (!userResult.data || !userResult.data[0] || !userResult.data[0].id) {
      throw new Error('Failed to create user: No user ID returned');
    }
    
    const userId = userResult.data[0].id;
    console.log('User created with ID:', userId);
    
    // Get selected team from dropdown
    const selectedTeam = getElementValue('preferredTeam1');
    const selectedTeam2 = getElementValue('preferredTeam2');
    
    if (!selectedTeam) {
      throw new Error('Please select a preferred team');
    }
    
    console.log('Selected teams:', { primary: selectedTeam, secondary: selectedTeam2 });
    
    // Insert team specific data with reference to the user
    const teamResult = await insertTeamData(selectedTeam, userId);
    if (teamResult.error) {
      console.error('Primary team insertion error:', teamResult.error);
      throw teamResult.error;
    }
    
    // Only try to insert second team if one was selected
    if (selectedTeam2) {
      const teamResult2 = await insertTeamData(selectedTeam2, userId);
      if (teamResult2.error) {
        console.error('Secondary team insertion error:', teamResult2.error);
        throw teamResult2.error;
      }
    }
    
    // Insert application data
    const appResult = await insertApplicationData(userId);
    if (appResult.error) throw appResult.error;

    // Show SweetAlert instead of alert()
    Swal.fire({
      title: "Application Received!",
      html: `We will reach out to you shortly.<br><br> 
             Till then, join the <a href="https://chat.whatsapp.com/JEwNKD4Q1yADCI3Na9CZuT" target="_blank" class="my-swal-link" >WhatsApp Group</a> for updates.`,
      icon: "success",
      confirmButtonText: "OK",
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        confirmButton: "my-swal-button",
      }
    });

    // Clear saved form progress
    localStorage.removeItem('recruitmentFormProgress');

    // Reset form after a small delay
    setTimeout(() => {
        document.getElementById('recruitmentForm').reset();
    }, 100);

  } catch (error) {
      console.error('Error submitting form:', error);
      showFormError(error.message || 'Error submitting form. Please try again.');
  } finally {
      setFormLoading(false);
      restoreRequiredToHiddenFields();
  }
}

/**
 * Event Listeners and Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recruitmentForm');
  if (form) {
    // Turn off native validation to use our custom validation
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', handleSubmit);
    
    // Load any saved form data
    loadFormProgress();
    
    // Set up autosave (every 30 seconds)
    setInterval(saveFormProgress, 30000);
    
    // Add event listener for team selection
    const teamSelector = document.getElementById('preferredTeam1');
    if (teamSelector) {
      teamSelector.addEventListener('change', (e) => {
        toggleTeamFields(e.target.value);
      });
    }
    
    // Add input event listeners to remove error messages when user corrects fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        removeFieldError(field.id);
      });
    });
  }
});

export { 
  insertUsers,
  insertTeamData,
  saveFormProgress,
  loadFormProgress
};

