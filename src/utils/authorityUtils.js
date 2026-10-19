/**
 * CleanCity AI - Authority Contact & Validation Utilities
 * 
 * Handles client-side validation, safe sanitization of phone/URLs,
 * and prefilled complaint email draft generation.
 */

// Safe protocol check - strictly allows only http and https
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // If user entered "www.mcphagwara.gov.in" without scheme, prepend https://
  if (/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return '';
}

// Clean phone for tel: URI
export function cleanPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '';
  // Keep digits and leading +
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return hasPlus ? `+${digits}` : digits;
}

// Validation function for authority contact fields
export function validateAuthorityContact(contact) {
  const errors = {};
  if (!contact) return { isValid: true, errors };

  const { phone, email, websiteUrl } = contact;

  // Phone validation (optional field, but if provided, must be valid)
  if (phone && phone.trim()) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      errors.phone = "Phone number should contain between 7 and 15 digits.";
    }
  }

  // Email validation (optional field, but if provided, must be valid RFC 5322 subset)
  if (email && email.trim()) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid official email address (e.g. commissioner@city.gov.in).";
    }
  }

  // Website URL validation (optional field, but if provided, must be valid HTTP/HTTPS)
  if (websiteUrl && websiteUrl.trim()) {
    const trimmedUrl = websiteUrl.trim();
    if (/^(javascript|data|vbscript|file):/i.test(trimmedUrl)) {
      errors.websiteUrl = "Unsafe URL scheme detected. Only HTTP and HTTPS URLs are allowed.";
    } else {
      const sanitized = sanitizeUrl(trimmedUrl);
      if (!sanitized) {
        errors.websiteUrl = "Please enter a valid website address (e.g. https://mcludhiana.gov.in).";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generates a prefilled, polite, and professionally formatted complaint email.
 * Note: The email is only prepared locally; the citizen reviews, edits,
 * and sends it via their default email client (mailto:).
 */
export function generateAuthorityEmailDraft(report, authorityContact = null) {
  const auth = authorityContact || report?.authorityContact || {};
  const recipientEmail = auth.email || '';
  const authorityName = auth.name || 'Competent Municipal Authority';

  const subject = `Civic Grievance: ${report?.category || 'Civic Issue'} at ${report?.locality || ''}, ${report?.city || 'Punjab'} [Ref: ${report?.id || 'GRIEVANCE'}]`;

  const coordsStr = report?.latitude && report?.longitude 
    ? `${report.latitude.toFixed(6)}° N, ${report.longitude.toFixed(6)}° E` 
    : 'Not available';

  const body = 
`To: The Officer-in-Charge / Grievance Redressal Cell
${authorityName}
${report?.city ? `${report.city}, Punjab` : 'Punjab'}

Subject: Formal Grievance Notice Regarding ${report?.category || 'Civic Infrastructure'} [Ref: ${report?.id || 'LOCAL-REPORT'}]

Respected Sir/Madam,

I am writing to formally draw your attention to a civic grievance that has been reported by local residents in your jurisdiction:

• Reference ID: ${report?.id || 'N/A'}
• Issue Category: ${report?.category || 'Unspecified'}
• Location: ${report?.locality || 'Locality'}, ${report?.city || 'City'}, Punjab
• Geographic Coordinates: ${coordsStr}
• Date Reported: ${report?.reportedAt || new Date().toISOString().split('T')[0]}
• Assessed Urgency: ${report?.urgency || 'Medium'}

Issue Details & Resident Statement:
"${report?.caption || report?.description || 'No detailed description provided.'}"

Impact & Public Concern:
This condition represents an active civic inconvenience and potential public health or safety hazard for daily commuters, school children, and neighborhood families.

Requested Action:
We respectfully request your department to dispatch a field inspection officer to assess the situation and initiate corrective remediation at the earliest possible opportunity.

We would be grateful if you could acknowledge receipt of this communication and provide a tentative timeline for inspection or repair.

Thank you for your service and dedication to our city.

Yours sincerely,
A Concerned Resident & CleanCity AI Community Contributor
Location: ${report?.locality || ''}, ${report?.city || ''}
Verified Community Portal: CleanCity AI Open Grievance Registry

---
[Note: This email was prepared locally via the CleanCity AI community initiative. CleanCity AI does not send automated emails; this message has been reviewed and dispatched by an individual citizen.]`;

  const mailtoLink = recipientEmail
    ? `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : '';

  return {
    subject,
    body,
    mailtoLink,
    recipientEmail
  };
}

// Realistic municipal department suggestions for Punjab
export const MUNICIPAL_AUTHORITIES_PUNJAB = {
  Phagwara: {
    general: {
      name: "Municipal Corporation Phagwara",
      phone: "+91-1824-260100",
      email: "commissioner@mcphagwara.in",
      websiteUrl: "https://mcphagwara.in"
    },
    power: {
      name: "Punjab State Power Corporation (PSPCL) - Phagwara Division",
      phone: "+91-1824-228300",
      email: "complaints@pspcl.in",
      websiteUrl: "https://www.pspcl.in"
    },
    roads: {
      name: "PWD (B&R) Punjab - Phagwara Subdivision",
      phone: "+91-1824-261220",
      email: "ee.pwd.phagwara@punjab.gov.in",
      websiteUrl: "https://pwdpunjab.gov.in"
    }
  },
  Jalandhar: {
    general: {
      name: "Municipal Corporation Jalandhar (MCJ)",
      phone: "+91-181-2227015",
      email: "commissioner.mcj@punjab.gov.in",
      websiteUrl: "https://mcjalandhar.in"
    },
    power: {
      name: "PSPCL - Jalandhar Central Division",
      phone: "1912",
      email: "complaints@pspcl.in",
      websiteUrl: "https://www.pspcl.in"
    },
    roads: {
      name: "PWD (B&R) Punjab - Jalandhar Circle",
      phone: "+91-181-2458920",
      email: "se.pwd.jalandhar@punjab.gov.in",
      websiteUrl: "https://pwdpunjab.gov.in"
    }
  },
  Ludhiana: {
    general: {
      name: "Municipal Corporation Ludhiana (MCL)",
      phone: "+91-161-2442223",
      email: "commissioner@mcludhiana.gov.in",
      websiteUrl: "https://mcludhiana.gov.in"
    },
    power: {
      name: "PSPCL - Ludhiana Central Operation Zone",
      phone: "1912",
      email: "complaints@pspcl.in",
      websiteUrl: "https://www.pspcl.in"
    },
    roads: {
      name: "National Highways Authority of India (NHAI) / PWD Ludhiana",
      phone: "+91-161-2531000",
      email: "ro-chandigarh@nhai.org",
      websiteUrl: "https://nhai.gov.in"
    }
  },
  Amritsar: {
    general: {
      name: "Municipal Corporation Amritsar (MCA)",
      phone: "+91-183-2502339",
      email: "commissioner.mca@punjab.gov.in",
      websiteUrl: "https://amritsarcorp.com"
    },
    power: {
      name: "PSPCL - Amritsar Border Zone",
      phone: "1912",
      email: "complaints@pspcl.in",
      websiteUrl: "https://www.pspcl.in"
    },
    roads: {
      name: "Amritsar Smart City Corporation / PWD",
      phone: "+91-183-2560000",
      email: "ceo@amritsarsmartcity.com",
      websiteUrl: "https://amritsarsmartcity.com"
    }
  }
};
