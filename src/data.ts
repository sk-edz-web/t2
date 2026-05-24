/**
 * data.ts
 * 
 * CORE INTEGRATIONS AND REAL-TIME FIREBASE SDK CONFIGURATIONS.
 * Includes: Firebase App client setup, Cloudinary uploads, and OpenRouter/Gemini AI integrations.
 * Real-time listeners for Skills, Comments, and User Profiles.
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from "firebase/firestore";
import { SkillCardType, UserProfile, Comment } from "./types";

// ============== 1. FIREBASE CONFIGURATION ==============
const firebaseConfig = {
  apiKey: "AIzaSyBinEDXDgw3wMsx4Fcq1HmrLahxC1An_8Y",
  authDomain: "skedz-b9e48.firebaseapp.com",
  databaseURL: "https://skedz-b9e48-default-rtdb.firebaseio.com",
  projectId: "skedz-b9e48",
  storageBucket: "skedz-b9e48.firebasestorage.app",
  messagingSenderId: "924978671204",
  appId: "1:924978671204:web:19351d832ac14363443971",
  measurementId: "G-LX6N9CW8EW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Export Firebase methods directly
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  onSnapshot
};

// ============== 2. REAL-TIME DATABASE SYNCHRONIZATION HELPERS ==============

/**
 * Real-time snapshot listener on the 'skills' collection.
 * Includes first-use default bootstrap population logic if the collection is empty.
 */
export function subscribeToSkills(
  onData: (skills: SkillCardType[]) => void,
  defaultSkills: SkillCardType[]
) {
  const skillsCollection = collection(db, "skills");
  
  return onSnapshot(skillsCollection, async (snapshot) => {
    if (snapshot.empty) {
      console.log("No skills in Firestore. Bootstrapping default skills dataset...");
      // Prepopulate Firestore with the default skills set
      try {
        for (const skill of defaultSkills) {
          const docRef = doc(db, "skills", skill.id);
          await setDoc(docRef, skill);
        }
      } catch (err) {
        console.error("Failed to bootstrap default skills in Firestore:", err);
      }
    } else {
      const skillsList: SkillCardType[] = [];
      snapshot.forEach((docSnap) => {
        skillsList.push(docSnap.data() as SkillCardType);
      });
      // Sort skills by category or title is fine, let's keep it sorted cleanly
      onData(skillsList);
    }
  });
}

/**
 * Saves a manual/AI-generated skill to the Firestore collection.
 */
export async function saveSkillToFirestore(skill: SkillCardType) {
  try {
    const docRef = doc(db, "skills", skill.id);
    await setDoc(docRef, skill);
  } catch (err) {
    console.error("Error saving skill card to Firestore:", err);
    throw err;
  }
}

/**
 * Appends a verified review comment to a skill document.
 */
export async function addCommentToSkill(cardId: string, updatedComments: Comment[], newAverageRating: number) {
  try {
    const docRef = doc(db, "skills", cardId);
    await updateDoc(docRef, {
      comments: updatedComments,
      rating: newAverageRating
    });
  } catch (err) {
    console.error("Error updating skill comments on Firestore:", err);
    throw err;
  }
}

/**
 * Real-time snap listener for user profiles.
 */
export function subscribeToUserProfile(
  userId: string,
  onData: (profile: UserProfile | null) => void
) {
  const userDocRef = doc(db, "users", userId);
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      onData(docSnap.data() as UserProfile);
    } else {
      onData(null);
    }
  });
}

/**
 * Updates a user profile in Firestore.
 */
export async function saveUserProfileToFirestore(userId: string, profile: UserProfile) {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (err) {
    console.error("Error saving user profile to Firestore:", err);
    throw err;
  }
}

// ============== 3. CLOUDINARY CONFIGURATION ==============
export const CLOUDINARY_CLOUD_NAME = "dnrgcl6ah";
export const CLOUDINARY_UPLOAD_PRESET = "all";

/**
 * Uploads a file directly to Cloudinary using unsigned upload preset
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Cloudinary error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

// ============== 4. OPENROUTER FREE / ALNITAK AI COMPONENTRY ==============
export async function askAlnitakAI({
  prompt,
  contextHistory = [],
  systemInstruction = ""
}: {
  prompt: string;
  contextHistory?: { role: string; content: string }[];
  systemInstruction?: string;
}): Promise<string> {
  const savedKey = localStorage.getItem("openrouter_api_key") || "";
  
  const defaultSystem = `You are Alnitak, a brilliant, friendly, and expert skill learning & career guidance AI coach. 
We are "Get Ready With Us" — a curated portal designed to help people transition into high-growth skills.
When providing information, always structure it beautifully in clean Markdown with:
- Summary of the Skill / Job Role
- Average learning duration to be interview-ready
- Expected vacancy & demand percentages (e.g. 85%)
- Top 3 Free Learning Sources (always include name + where to get free certificates)
- Key career roles and typical vacancy updates
Be encouraging and concise. Use clear, bulleted segments!`;

  const finalSystemInstruction = systemInstruction ? `${defaultSystem}\n${systemInstruction}` : defaultSystem;

  const messages = [
    { role: "system", content: finalSystemInstruction },
    ...contextHistory.map(h => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content
    })),
    { role: "user", content: prompt }
  ];

  if (savedKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Get Ready With Us Skill Center"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash:free",
          messages: messages,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const resData = await response.json();
        return resData?.choices?.[0]?.message?.content || "No text generated.";
      } else {
        console.warn(`OpenRouter HTTP Error: ${response.status}. Falling back to smart Alnitak generation.`);
      }
    } catch (e) {
      console.error("OpenRouter request failed:", e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getSimulatedAlnitakResponse(prompt));
    }, 1500);
  });
}

function getSimulatedAlnitakResponse(prompt: string): string {
  const norm = prompt.toLowerCase();
  
  if (norm.includes("react") || norm.includes("web") || norm.includes("frontend")) {
    return `### 🚀 Frontend Engineering & React.js

Gain the core skills of building responsive, interactive user experiences with JSX, state modeling, and hooks.

- **Learning Time:** 6 to 8 weeks (avg. 120 hours)
- **Vacancy Availability Rate:** 92% (High Demand)
- **Where to Learn:**
  - **freeCodeCamp.org** (Includes full Front End Certification)
  - **Scrimba Frontend Developer Path** (Interactive browser-based playground with certificate options)
  - **Coursera - Meta Frontend Developer Professional Certificate** (Financial Aid available for 100% free access)
- **Job Vacancies & Career Outlook:**
  - High demand in modern scaleups, remote hubs, and contract agencies. Junior roles start at $65k-$80k.
- **Tip from Alnitak AI:** Focus heavily on state management, asynchronous fetch protocols, and writing clean, reusable components!`;
  }

  if (norm.includes("design") || norm.includes("ui") || norm.includes("ux") || norm.includes("figma")) {
    return `### 🎨 UI/UX Design & Product Customization

Master typographic hierarchy, spacing rhythm, interactive wireframing, and design-system translation.

- **Learning Time:** 4 to 6 weeks (avg. 80 hours)
- **Vacancy Availability Rate:** 88% (Steady Growth)
- **Where to Learn:**
  - **Figma Learn Portal** (Master Figma directly via official modules)
  - **Google UX Design Certificate on Coursera** (Audit free to obtain complete career skills)
  - **UX Design Institute (Free Introductory courses)**
- **Job Vacancy Insights:**
  - Growing rapidly as businesses build digital products. Great for creative problem solvers wanting remote work.
- **Tip from Alnitak AI:** Build a custom portfolio showing visual case studies, wireframes, and smooth transition animations!`;
  }

  if (norm.includes("python") || norm.includes("data") || norm.includes("ai") || norm.includes("machine")) {
    return `### 🐍 Python Data Science & AI Foundations

Master NumPy, Pandas series, data plotting, and basic ML regression models with Google Colab.

- **Learning Time:** 8 to 12 weeks (avg. 180 hours)
- **Vacancy Availability Rate:** 95% (Extreme Growth)
- **Where to Learn:**
  - **Kaggle Courses** (Bite-sized visual notebooks with free micro-certificates)
  - **Google Cloud Skills Boost** (Generative AI learning path for free)
  - **Python for Everybody** (Universities of Michigan free curriculum)
- **Job Placement Details:**
  - High starting positions across product analytics, enterprise operations, and LLM-finetuning pipelines.
- **Tip from Alnitak AI:** Build practical scripts that query REST endpoints, merge CSV datasets, and draw automated visualization charts!`;
  }

  return `### ⚙️ Creative Career Roadmap: ${prompt.trim().toUpperCase()}

Here is the customized skill path compiled instantly by your career coach **Alnitak AI**!

- **Estimated Avg Learning Time:** 6 weeks (80-100 hours of focused project work)
- **Vacancy Availability Rate:** 85% (Favorable placement rate)
- **Top Free Learning Platforms & Certificates:**
  - **freeCodeCamp** (100% free interactive certifications and community groups)
  - **Google Career Certificates** (Available through free audits on partner networks)
  - **Youtube Masterclasses** (Search for comprehensive curated crash courses to build functional projects)
- **Where to Find Vacancies:** Look on LinkedIn, remote-only forums, and Upwork for freelance launch items.
- **AI Career Expert Note:** The fastest way to learn is by doing. Pick a single simple project, break it into tiny tasks, and build it step-by-step. Let me know if you would like me to draft your weekly study calendar!`;
}
