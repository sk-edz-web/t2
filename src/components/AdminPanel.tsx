import React, { useState } from "react";
import { AlertCircle, HelpCircle, FilePlus, Sparkles, Check, Database, Sparkle } from "lucide-react";
import { SkillCardType } from "../types";

interface AdminPanelProps {
  onAddCard: (newCard: Partial<SkillCardType>) => void;
  onClose: () => void;
}

export default function AdminPanel({ onAddCard, onClose }: AdminPanelProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [imageUrl, setImageUrl] = useState("");
  const [avgLearningTime, setAvgLearningTime] = useState("");
  const [vacancyPercentage, setVacancyPercentage] = useState(85);
  const [description, setDescription] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [vacancies, setVacancies] = useState("");

  const [message, setMessage] = useState("");

  const handleFakeClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 4) {
      setIsUnlocked(true);
      setMessage("🔓 Admin override activated! Access granted successfully.");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMessage("⚠️ Title and Description are required.");
      return;
    }

    const newCardData: Partial<SkillCardType> = {
      title,
      category,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop",
      avgLearningTime: avgLearningTime || "6 Weeks",
      vacancyPercentage: Number(vacancyPercentage) || 85,
      isAiGenerated: false,
      description,
      roadmapSteps: roadmap ? roadmap.split(",").map(s => s.trim()) : ["Gain foundations", "Build practical case studies", "Receive certification"],
      whereToLearn: platforms ? platforms.split(";").map(plat => {
        const parts = plat.split(",");
        return {
          platform: parts[0]?.trim() || "Web Learning Forum",
          path: parts[1]?.trim() || "Self Study curriculum",
          hasCertificate: parts[2]?.trim().toLowerCase() === "true" || true
        };
      }) : [
        { platform: "freeCodeCamp", path: "Full certified guide", hasCertificate: true },
        { platform: "YouTube Masterclasses", path: "Practical hands-on builds", hasCertificate: false }
      ],
      vacanciesList: vacancies ? vacancies.split(",").map(v => v.trim()) : ["Contract roles", "Remote Tech Hubs"],
      comments: [
        {
          id: Math.random().toString(),
          userName: "system_admin",
          text: "Verified manual curriculum uploaded securely.",
          rating: 5,
          timestamp: "Just now"
        }
      ]
    };

    onAddCard(newCardData);
    setMessage("✅ Skill Card published to Firestore successfully!");
    
    // reset form
    setTitle("");
    setImageUrl("");
    setAvgLearningTime("");
    setVacancyPercentage(85);
    setDescription("");
    setRoadmap("");
    setPlatforms("");
    setVacancies("");
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl min-h-[500px] flex flex-col justify-between">
      {!isUnlocked ? (
        // Spectacular Custom Fake 404 Page error
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/20 text-red-500 animate-pulse">
            <AlertCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 
              onClick={handleFakeClick}
              className="text-6xl sm:text-7xl font-mono font-extrabold tracking-widest text-neutral-900 dark:text-neutral-100 cursor-pointer select-none active:scale-95 transition-transform"
            >
              404
            </h1>
            <p className="font-semibold text-lg text-neutral-700 dark:text-neutral-300">
              Oops! Page Not Found
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
              Our servers could not trace this path. Check the web address or contact your organization's support desk.
            </p>
          </div>

          <div className="pt-2 text-[10px] text-neutral-300 dark:text-neutral-700 select-none">
            {clickCount > 0 && `(Signal stability feedback clicks left: ${4 - clickCount})`}
          </div>

          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Return to Safety
          </button>
        </div>
      ) : (
        // Unlocked Manual Card Creator Form
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight flex items-center gap-1.5ClassName">
                📂 Admin Skill Card Publisher
              </h2>
              <p className="text-xs text-neutral-500">Unrestricted manual uploading database gateway</p>
            </div>
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-lg text-xs transition-all"
            >
              Close Panel
            </button>
          </div>

          {message && (
            <div className="p-3.5 rounded-xl text-xs font-medium bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
              {message}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-500 mb-1">Course Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Advanced Figma Design Masterclass"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Category Group</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="AI & Analytics">AI & Analytics</option>
                  <option value="Business Strategy">Business Strategy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-500 mb-1">Average Study Duration</label>
                <input 
                  type="text" 
                  value={avgLearningTime}
                  onChange={e => setAvgLearningTime(e.target.value)}
                  placeholder="e.g., 4 Weeks or 8 Weeks"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-neutral-500 mb-1">Banner Image URL (Unsplash or direct Cloudinary link)</label>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="e.g. Leave blank to use a dynamic placeholder"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-500 mb-1">Placement Rate / Vacancies Weight (0% - 100%)</label>
                <input 
                  type="number" 
                  min={0}
                  max={100}
                  value={vacancyPercentage}
                  onChange={e => setVacancyPercentage(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Hiring fields (Comma separated list)</label>
                <input 
                  type="text" 
                  value={vacancies}
                  onChange={e => setVacancies(e.target.value)}
                  placeholder="e.g., Meta Remote, Contract Labs, Vercel"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-500 mb-1">Syllabus Milestones (Comma separated list)</label>
              <input 
                type="text" 
                value={roadmap}
                onChange={e => setRoadmap(e.target.value)}
                placeholder="e.g. Figma foundations, Advanced auto-layout metrics, Portfolio design"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-500 mb-1">Verified Free Platforms (Format: Platform, CourseName, HasCert(true/false) ; platform2...)</label>
              <input 
                type="text" 
                value={platforms}
                onChange={e => setPlatforms(e.target.value)}
                placeholder="e.g. freeCodeCamp, Responsive Web Certification, true; Scrimba, JSX foundations, false"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-500 mb-1">Course Summary / Pitch Description</label>
              <textarea 
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe with pristine details the topics, learning tools used, and target outcomes..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                type="button" 
                onClick={() => setIsUnlocked(false)}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 font-bold rounded-xl transition"
              >
                Mock Out
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-white transition shadow-md shadow-emerald-500/10"
              >
                Publish Directly
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
