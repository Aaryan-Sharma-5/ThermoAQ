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

Please provide a detailed health report with the following sections:

1. **OVERALL HEALTH RISK ASSESSMENT**
   - Analyze how the current environmental conditions may affect this individual
   - Consider their age, pre-existing conditions, and activity level
   - Rate the overall risk level (Low/Moderate/High/Severe)

2. **SYMPTOM ANALYSIS**
   - Connect reported symptoms to environmental conditions
   - Explain likely causes based on AQI, pollutants, and weather
   - Differentiate between environmental and other potential causes

3. **IMMEDIATE RECOMMENDATIONS**
   - Specific actions to take today based on current conditions
   - Activity modifications (outdoor time, exercise intensity)
   - Protective measures (masks, air purifiers, medication)

4. **ENVIRONMENTAL IMPACT BREAKDOWN**
   - How AQI level affects respiratory and cardiovascular health
   - Impact of temperature and humidity on their conditions
   - UV exposure risks and precautions
   - Specific pollutant concerns (PM2.5, PM10, O3, NO2, etc.)

5. **PERSONALIZED HEALTH ADVICE**
   - Long-term strategies for managing health in this environment
   - Lifestyle adjustments based on their activity level
   - When to seek medical attention (warning signs)
   - Preventive measures for their specific conditions

6. **MEDICATION & TREATMENT CONSIDERATIONS**
   - Whether to adjust current medications (general advice)
   - Over-the-counter remedies that may help
   - When to consult a healthcare provider

7. **MONITORING RECOMMENDATIONS**
   - What symptoms to watch for
   - How often to check air quality
   - Suggested health tracking methods

Format the report professionally with clear headings, bullet points, and actionable advice. Be empathetic but honest about risks. Always emphasize that this is informational guidance and recommend consulting healthcare professionals for medical decisions.`;
};

// Generate health report using Gemini
async function generateHealthReport(userData, environmentalData, location) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
# HEALTH ASSESSMENT REPORT
**Location:** ${location}
**Date:** ${new Date().toLocaleDateString()}
**Overall Risk Level:** ${riskLevel}

⚠️ **Note:** This is a basic automated report. AI service is temporarily unavailable. Please consult healthcare professionals for detailed medical advice.

## 1. OVERALL HEALTH RISK ASSESSMENT

Based on current environmental conditions:
- Air Quality Index: ${aqi} (${aqiLevel})
- Temperature: ${temperature}°C
- Humidity: ${humidity}%

**Risk Assessment:**
${aqi > 150 ? `🔴 HIGH RISK: Air quality is poor. Individuals with respiratory conditions, elderly, and children should avoid outdoor activities.` : ''}
${aqi <= 150 && aqi > 100 ? `🟡 MODERATE RISK: Sensitive individuals should limit prolonged outdoor activities.` : ''}
${aqi <= 100 ? `🟢 LOW TO MODERATE RISK: Air quality is acceptable for most individuals.` : ''}

${hasRespiratoryCondition ? `
⚠️ **Special Note:** You have pre-existing respiratory conditions. Extra precautions are recommended.
` : ''}

## 2. IMMEDIATE RECOMMENDATIONS

**Today's Actions:**
- ${aqi > 150 ? 'Stay indoors as much as possible' : 'Limit outdoor activities to essential ones'}
- ${aqi > 100 ? 'Wear an N95 mask when going outside' : 'Consider wearing a mask during outdoor activities'}
- ${temperature > 35 ? 'Avoid outdoor activities during peak heat hours (11 AM - 4 PM)' : ''}
- Keep windows closed and use air purifiers if available
- Stay well-hydrated (drink at least 8 glasses of water)
- ${hasSymptoms ? 'Monitor your symptoms closely and consult a doctor if they worsen' : ''}

## 3. ENVIRONMENTAL IMPACT

**Air Quality Effects:**
- PM2.5 and PM10 particles can penetrate deep into lungs
- May cause or worsen respiratory symptoms
- ${hasRespiratoryCondition ? 'Can trigger asthma attacks or COPD flare-ups' : ''}
- Cardiovascular stress in high pollution

**Temperature & Humidity:**
- ${humidity > 70 ? 'High humidity can worsen respiratory issues' : ''}
- ${temperature > 35 ? 'Heat stress risk - stay hydrated and cool' : ''}

## 4. PERSONALIZED HEALTH ADVICE

**Long-term Strategies:**
1. Check AQI daily before planning outdoor activities
2. Install air quality monitoring apps
3. Maintain indoor air quality with purifiers
4. ${hasRespiratoryCondition ? 'Keep rescue inhaler readily available' : ''}
5. Regular health check-ups every 6 months

**When to Seek Medical Attention:**
- Severe breathing difficulty
- Chest pain or tightness
- Persistent cough with blood
- High fever with respiratory symptoms
- Symptoms that don't improve after moving indoors

## 5. MONITORING RECOMMENDATIONS

**Daily Monitoring:**
- Check local AQI before going outdoors
- Monitor your symptoms (keep a health diary)
- Track peak symptom times
- Note correlation between outdoor activities and symptoms

**Disclaimer:**
This report is for informational purposes only and does not replace professional medical advice. Always consult qualified healthcare providers for diagnosis and treatment.
`;
}

module.exports = {
  generateHealthReport
};
