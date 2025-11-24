import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, TriageResult, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const triagePatient = async (data: PatientData): Promise<TriageResult> => {
  try {
    const prompt = `
      Act as an emergency medical triage AI. Analyze the following patient data provided by paramedics in an ambulance.
      
      Patient Info:
      Age: ${data.age}
      Gender: ${data.gender}
      Symptoms: ${data.symptoms}
      Vitals: ${data.vitals}

      Provide a structured assessment including severity (CRITICAL, MODERATE, STABLE), a brief medical summary for the receiving hospital, recommended specialists to have on standby, and equipment needed upon arrival.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              enum: [Severity.CRITICAL, Severity.MODERATE, Severity.STABLE],
              description: "The medical severity of the patient."
            },
            summary: {
              type: Type.STRING,
              description: "A concise 1-2 sentence medical summary for the doctor."
            },
            recommended_specialists: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specialists (e.g., Cardiologist, Trauma Surgeon)."
            },
            equipment_needed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of medical equipment needed immediately (e.g., Ventilator, Defibrillator)."
            }
          },
          required: ["severity", "summary", "recommended_specialists", "equipment_needed"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as TriageResult;

  } catch (error) {
    console.error("Triage Error:", error);
    // Fallback in case of API error
    return {
      severity: Severity.MODERATE,
      summary: "Automated triage unavailable. See raw notes.",
      recommended_specialists: ["General ER Physician"],
      equipment_needed: ["Standard ER Kit"]
    };
  }
};