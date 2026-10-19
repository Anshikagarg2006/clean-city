/**
 * CleanCity AI - Professional Complaint Generator
 * Generates formal civic complaints using a configured LLM API (if present)
 * or a clearly labeled professional demo fallback template engine.
 * 
 * DISCLAIMER: This tool drafts grievances. It does NOT transmit complaints
 * directly to government grievance portals without an authorized API integration.
 */

export async function generateProfessionalComplaint({
  category,
  description,
  city,
  locality,
  urgency = "Medium",
  citizenName = "Concerned Citizen",
  photoAttached = false
}) {
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.VITE_OPENAI_API_KEY;

  // If a Gemini API key is configured in .env, attempt call
  if (apiKey && import.meta.env?.VITE_GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Draft a formal, professional administrative civic complaint letter addressed to the Municipal Commissioner of ${city}, Punjab, India.
Issue Category: ${category}
Exact Location: ${locality}, ${city}, Punjab
Urgency Level: ${urgency}
Complainant's Description: ${description}
Complainant Name: ${citizenName}
Attached Photo: ${photoAttached ? "Yes, photographic proof attached" : "No photo"}

Requirements:
1. Formal administrative tone following Punjab Municipal Corporation guidelines.
2. Clear subject line.
3. Summary of public safety, sanitation, and health risks.
4. Specific request for field inspection and time-bound remediation.
5. Conclude with a clear disclaimer: "[Drafted via CleanCity AI Assistant — Requires Citizen Submission]".`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return {
            text: generatedText,
            source: "Configured Gemini LLM API",
            isFallback: false
          };
        }
      }
    } catch (err) {
      console.warn("LLM API call failed, using demo fallback generator:", err);
    }
  }

  // High-Quality Professional Demo Fallback Template Engine
  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const referenceNo = `CC/PB/${city.substring(0, 3).toUpperCase()}/${Date.now().toString().slice(-6)}`;

  const fallbackText = `To,
The Municipal Commissioner / Joint Commissioner,
Municipal Corporation Office,
${city}, Punjab, India.

Date: ${currentDate}
Grievance Ref Draft: ${referenceNo}

SUBJECT: Formal Civic Grievance regarding ${category.toUpperCase()} at ${locality}, ${city}

Respected Sir/Madam,

I am writing to formally place on record an urgent civic concern affecting the residents and commuters of ${locality}, ${city}.

1. INCIDENT DETAILS:
   • Primary Category: ${category}
   • Specific Locality: ${locality}, ${city}, Punjab
   • Priority Rating: ${urgency.toUpperCase()}
   • Photographic Documentation: ${photoAttached ? "Attached with report" : "Not provided"}

2. CITIZEN'S FACTUAL STATEMENT:
   "${description.trim()}"

3. PUBLIC HAZARD & STATUTORY IMPACT:
   The prevailing situation constitutes a public nuisance and violates standards prescribed under the Punjab Municipal Corporation Act. The unresolved state of this issue poses imminent hazards to public hygiene, vehicular road safety, and daily pedestrian movement.

4. REQUESTED MUNICIPAL INTERVENTION:
   In view of the urgency of the matter, it is respectfully requested that:
   a) A designated municipal zonal officer or junior engineer be deputed for on-site physical inspection.
   b) Immediate corrective and remediation work be scheduled under standard civic SLAs.
   c) Status update be documented for citizen visibility.

Thanking you.

Yours sincerely,
${citizenName}
Locality Resident, ${locality}, ${city}

─────────────────────────────────────────────────────────────
[GENERATION NOTICE: Generated via CleanCity AI Demo Fallback Generator]
[LEGAL NOTICE: This is a drafted document for demonstration and record-keeping purposes. It has NOT been automatically submitted to the Punjab Municipal Corporation or state 311 portal.]`;

  return {
    text: fallbackText,
    source: "Demo Fallback Generator (Clearly Labeled Demo)",
    isFallback: true
  };
}
