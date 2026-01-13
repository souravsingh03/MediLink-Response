
import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, TriageResult, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const triagePatient = async (data: PatientData): Promise<TriageResult> => {
  try {
    const prompt = `
      Act as an emergency medical triage AI. Analyze the following patient data provided by paramedics.
      
      Patient Info:
      Age: ${data.age}
      Gender: ${data.gender}
      Symptoms: ${data.symptoms}
      Vitals: ${data.vitals}

      Provide a structured assessment including severity (CRITICAL, MODERATE, STABLE), a brief medical summary, recommended specialists, and equipment needed.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              enum: [Severity.CRITICAL, Severity.MODERATE, Severity.STABLE],
            },
            summary: {
              type: Type.STRING,
            },
            recommended_specialists: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            equipment_needed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            }
          },
          required: ["severity", "summary", "recommended_specialists", "equipment_needed"]
        }
      }
    });

    return JSON.parse(response.text) as TriageResult;
  } catch (error) {
    console.error("Triage Error:", error);
    return {
      severity: Severity.MODERATE,
      summary: "Automated triage unavailable. Proceed with standard emergency protocols.",
      recommended_specialists: ["General ER Physician"],
      equipment_needed: ["Standard ER Kit"]
    };
  }
};
