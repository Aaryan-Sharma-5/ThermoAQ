const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Health assessment prompt template
const createHealthPrompt = (userData, environmentalData, location) => {
  const { age, gender, symptoms, preExistingConditions, activityLevel, timeOutdoors, additionalConcerns } = userData;
  
  // Get selected symptoms
  const selectedSymptoms = Object.keys(symptoms).filter(key => symptoms[key]);
  const selectedConditions = Object.keys(preExistingConditions).filter(key => 
    key !== 'other' && preExistingConditions[key]
  );
  
  return `You are an experienced environmental health specialist and physician. Generate a comprehensive, personalized health report based on the following information:

**PATIENT INFORMATION:**
- Age: ${age} years
- Gender: ${gender}
- Activity Level: ${activityLevel}
- Time Spent Outdoors: ${timeOutdoors} hours per day
${additionalConcerns ? `- Additional Concerns: ${additionalConcerns}` : ''}

**CURRENT SYMPTOMS:**
${selectedSymptoms.length > 0 ? selectedSymptoms.map(s => `- ${s.replace(/([A-Z])/g, ' $1').trim()}`).join('\n') : '- No symptoms reported'}

**PRE-EXISTING CONDITIONS:**
${selectedConditions.length > 0 ? selectedConditions.map(c => `- ${c.toUpperCase()}`).join('\n') : '- No pre-existing conditions reported'}
${preExistingConditions.other ? `- Other: ${preExistingConditions.other}` : ''}

**ENVIRONMENTAL CONDITIONS AT ${location.toUpperCase()}:**
- Air Quality Index (AQI): ${environmentalData.aqi} (${environmentalData.aqiLevel})
- Temperature: ${environmentalData.temperature}°C
- Humidity: ${environmentalData.humidity}%
- UV Index: ${environmentalData.uvIndex}
${environmentalData.pollutants ? `
**POLLUTANT LEVELS:**
${Object.entries(environmentalData.pollutants).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
` : ''}

Please provide a detailed health report with the following sections. Format the response in clean HTML with proper headings and lists (NO MARKDOWN ASTERISKS OR HASH SYMBOLS):

<h2>1. OVERALL HEALTH RISK ASSESSMENT</h2>
<p>Analyze how the current environmental conditions may affect this individual. Consider their age, pre-existing conditions, and activity level. Rate the overall risk level (Low/Moderate/High/Severe).</p>

<h2>2. SYMPTOM ANALYSIS</h2>
<p>Connect reported symptoms to environmental conditions. Explain likely causes based on AQI, pollutants, and weather. Differentiate between environmental and other potential causes.</p>

<h2>3. IMMEDIATE RECOMMENDATIONS</h2>
<p>Specific actions to take today based on current conditions:</p>
<ul>
<li>Activity modifications (outdoor time, exercise intensity)</li>
<li>Protective measures (masks, air purifiers, medication)</li>
</ul>

<h2>4. ENVIRONMENTAL IMPACT BREAKDOWN</h2>
<ul>
<li>How AQI level affects respiratory and cardiovascular health</li>
<li>Impact of temperature and humidity on their conditions</li>
<li>UV exposure risks and precautions</li>
<li>Specific pollutant concerns (PM2.5, PM10, O3, NO2, etc.)</li>
</ul>

<h2>5. PERSONALIZED HEALTH ADVICE</h2>
<ul>
<li>Long-term strategies for managing health in this environment</li>
<li>Lifestyle adjustments based on their activity level</li>
<li>When to seek medical attention (warning signs)</li>
<li>Preventive measures for their specific conditions</li>
</ul>

<h2>6. MEDICATION & TREATMENT CONSIDERATIONS</h2>
<ul>
<li>Whether to adjust current medications (general advice)</li>
<li>Over-the-counter remedies that may help</li>
<li>When to consult a healthcare provider</li>
</ul>

<h2>7. MONITORING RECOMMENDATIONS</h2>
<ul>
<li>What symptoms to watch for</li>
<li>How often to check air quality</li>
<li>Suggested health tracking methods</li>
</ul>

IMPORTANT: Format the entire response as clean HTML. Use <h2> for section headings, <h3> for subsections, <p> for paragraphs, <ul> and <li> for lists, and <strong> for emphasis. DO NOT use markdown symbols like *, **, #, or ##. Be empathetic but honest about risks. Always emphasize that this is informational guidance and recommend consulting healthcare professionals for medical decisions.`;
};

// Generate health report using Gemini
async function generateHealthReport(userData, environmentalData, location) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
    
    const prompt = createHealthPrompt(userData, environmentalData, location);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const report = response.text();
    
    return {
      success: true,
      report: report,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Return a fallback report if API fails
    return {
      success: false,
      report: generateFallbackReport(userData, environmentalData, location),
      generatedAt: new Date(),
      error: 'AI service unavailable, showing basic analysis'
    };
  }
}

// Fallback report if Gemini API is unavailable
function generateFallbackReport(userData, environmentalData, location) {
  const { age, symptoms, preExistingConditions } = userData;
  const { aqi, aqiLevel, temperature, humidity } = environmentalData;
  
  let riskLevel = 'Moderate';
  if (aqi > 200) riskLevel = 'Severe';
  else if (aqi > 150) riskLevel = 'High';
  else if (aqi < 50) riskLevel = 'Low';
  
  const hasRespiratoryCondition = preExistingConditions.asthma || preExistingConditions.copd;
  const hasSymptoms = Object.values(symptoms).some(s => s);
  
  return `
<div class="health-report">
  <div class="report-header" style="margin-bottom: 24px; padding: 16px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 8px;">
    <h1 style="color: white; font-size: 24px; margin: 0 0 8px 0;">HEALTH ASSESSMENT REPORT</h1>
    <p style="color: #e0e7ff; margin: 4px 0;"><strong>Location:</strong> ${location}</p>
    <p style="color: #e0e7ff; margin: 4px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p style="color: #fbbf24; margin: 4px 0; font-size: 18px;"><strong>Overall Risk Level:</strong> ${riskLevel}</p>
  </div>

  <div style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin-bottom: 24px; border-radius: 4px;">
    <p style="color: #92400e; margin: 0;"><strong>⚠️ Note:</strong> This is a basic automated report. AI service is temporarily unavailable. Please consult healthcare professionals for detailed medical advice.</p>
  </div>

  <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin: 24px 0 16px 0;">1. OVERALL HEALTH RISK ASSESSMENT</h2>
  
  <p style="margin: 12px 0;"><strong>Current Environmental Conditions:</strong></p>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li>Air Quality Index: ${aqi} (${aqiLevel})</li>
    <li>Temperature: ${temperature}°C</li>
    <li>Humidity: ${humidity}%</li>
  </ul>

  <p style="margin: 16px 0;"><strong>Risk Assessment:</strong></p>
  ${aqi > 150 ? `<p style="color: #dc2626; font-weight: 600;">🔴 HIGH RISK: Air quality is poor. Individuals with respiratory conditions, elderly, and children should avoid outdoor activities.</p>` : ''}
  ${aqi <= 150 && aqi > 100 ? `<p style="color: #f59e0b; font-weight: 600;">🟡 MODERATE RISK: Sensitive individuals should limit prolonged outdoor activities.</p>` : ''}
  ${aqi <= 100 ? `<p style="color: #059669; font-weight: 600;">🟢 LOW TO MODERATE RISK: Air quality is acceptable for most individuals.</p>` : ''}

  ${hasRespiratoryCondition ? `<div style="padding: 12px; background: #fee2e2; border-left: 4px solid #ef4444; margin: 16px 0; border-radius: 4px;">
    <p style="color: #991b1b; margin: 0;"><strong>⚠️ Special Note:</strong> You have pre-existing respiratory conditions. Extra precautions are recommended.</p>
  </div>` : ''}

  <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin: 24px 0 16px 0;">2. IMMEDIATE RECOMMENDATIONS</h2>
  
  <p style="margin: 12px 0;"><strong>Today's Actions:</strong></p>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li>${aqi > 150 ? 'Stay indoors as much as possible' : 'Limit outdoor activities to essential ones'}</li>
    <li>${aqi > 100 ? 'Wear an N95 mask when going outside' : 'Consider wearing a mask during outdoor activities'}</li>
    ${temperature > 35 ? '<li>Avoid outdoor activities during peak heat hours (11 AM - 4 PM)</li>' : ''}
    <li>Keep windows closed and use air purifiers if available</li>
    <li>Stay well-hydrated (drink at least 8 glasses of water)</li>
    ${hasSymptoms ? '<li>Monitor your symptoms closely and consult a doctor if they worsen</li>' : ''}
  </ul>

  <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin: 24px 0 16px 0;">3. ENVIRONMENTAL IMPACT</h2>
  
  <h3 style="color: #1e40af; margin: 16px 0 8px 0;">Air Quality Effects:</h3>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li>PM2.5 and PM10 particles can penetrate deep into lungs</li>
    <li>May cause or worsen respiratory symptoms</li>
    ${hasRespiratoryCondition ? '<li>Can trigger asthma attacks or COPD flare-ups</li>' : ''}
    <li>Cardiovascular stress in high pollution</li>
  </ul>

  <h3 style="color: #1e40af; margin: 16px 0 8px 0;">Temperature & Humidity:</h3>
  <ul style="margin: 8px 0; padding-left: 24px;">
    ${humidity > 70 ? '<li>High humidity can worsen respiratory issues</li>' : '<li>Current humidity levels are within acceptable range</li>'}
    ${temperature > 35 ? '<li>Heat stress risk - stay hydrated and cool</li>' : '<li>Temperature is within comfortable range</li>'}
  </ul>

  <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin: 24px 0 16px 0;">4. PERSONALIZED HEALTH ADVICE</h2>
  
  <h3 style="color: #1e40af; margin: 16px 0 8px 0;">Long-term Strategies:</h3>
  <ol style="margin: 8px 0; padding-left: 24px;">
    <li>Check AQI daily before planning outdoor activities</li>
    <li>Install air quality monitoring apps</li>
    <li>Maintain indoor air quality with purifiers</li>
    ${hasRespiratoryCondition ? '<li>Keep rescue inhaler readily available</li>' : ''}
    <li>Regular health check-ups every 6 months</li>
  </ol>

  <h3 style="color: #1e40af; margin: 16px 0 8px 0;">When to Seek Medical Attention:</h3>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li>Severe breathing difficulty</li>
    <li>Chest pain or tightness</li>
    <li>Persistent cough with blood</li>
    <li>High fever with respiratory symptoms</li>
    <li>Symptoms that don't improve after moving indoors</li>
  </ul>

  <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin: 24px 0 16px 0;">5. MONITORING RECOMMENDATIONS</h2>
  
  <h3 style="color: #1e40af; margin: 16px 0 8px 0;">Daily Monitoring:</h3>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li>Check local AQI before going outdoors</li>
    <li>Monitor your symptoms (keep a health diary)</li>
    <li>Track peak symptom times</li>
    <li>Note correlation between outdoor activities and symptoms</li>
  </ul>
</div>
`;
}

module.exports = {
  generateHealthReport
};
