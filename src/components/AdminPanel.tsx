import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  HelpCircle, 
  FilePlus, 
  Sparkles, 
  Check, 
  Database, 
  Trash2, 
  Edit, 
  Search, 
  X, 
  Settings, 
  ArrowLeft,
  ListRestart
} from "lucide-react";
import { SkillCardType } from "../types";

interface AdminPanelProps {
  skills: SkillCardType[];
  onAddCard: (newCard: Partial<SkillCardType>) => void;
  onEditCard: (updatedCard: SkillCardType) => void;
  onDeleteCard: (cardId: string) => void;
  onClose: () => void;
}

export default function AdminPanel({ 
  skills = [], 
  onAddCard, 
  onEditCard, 
  onDeleteCard, 
  onClose 
}: AdminPanelProps) {
  
  // Auto-unlock helper if running within direct admin.html entry point
  const isDirectWebEntry = (window as any).IS_ADMIN_HTML || window.location.pathname.endsWith("admin.html");
  
  const [clickCount, setClickCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(isDirectWebEntry);
  
  // Dashboard Tabs: "add" | "manage"
  const [activeSubTab, setActiveSubTab] = useState<"add" | "manage">(isDirectWebEntry ? "manage" : "add");

  // Track if we are editing an existing card
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

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

  // Search filter for managing cards
  const [searchManageKey, setSearchManageKey] = useState("");

  // Status/Messages
  const [message, setMessage] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync unlock isDirectWebEntry state
  useEffect(() => {
    if (isDirectWebEntry) {
      setIsUnlocked(true);
    }
  }, [isDirectWebEntry]);

  const handleFakeClick = () => {
    if (isUnlocked) return;
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 4) {
      setIsUnlocked(true);
      setActiveSubTab("manage");
      setMessage("🔓 System override verified! Welcome Get Ready administrator.");
    }
  };

  // Pre-populate form fields to trigger Edit mode
  const startEditCard = (card: SkillCardType) => {
    setEditingCardId(card.id);
    setTitle(card.title || "");
    setCategory(card.category || "Development");
    setImageUrl(card.imageUrl || "");
    setAvgLearningTime(card.avgLearningTime || "");
    setVacancyPercentage(card.vacancyPercentage || 85);
    setDescription(card.description || "");
    
    // Format arrays to formatted string inputs
    setRoadmap(card.roadmapSteps ? card.roadmapSteps.join(", ") : "");
    setVacancies(card.vacanciesList ? card.vacanciesList.join(", ") : "");
    
    // Convert links back into Platform, Path, HasCert; ... style
    if (card.whereToLearn && Array.isArray(card.whereToLearn)) {
      const platString = card.whereToLearn.map(link => 
        `${link.platform}, ${link.path}, ${link.hasCertificate}`
      ).join("; ");
      setPlatforms(platString);
    } else {
      setPlatforms("");
    }

    setMessage(`Mode Changed: Now editing card "${card.title}"`);
    setActiveSubTab("add");
  };

  const cancelEdit = () => {
    setEditingCardId(null);
    clearFormFields();
    setMessage("");
  };

  const clearFormFields = () => {
    setTitle("");
    setCategory("Development");
    setImageUrl("");
    setAvgLearningTime("");
    setVacancyPercentage(85);
    setDescription("");
    setRoadmap("");
    setPlatforms("");
    setVacancies("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMessage("⚠️ Core Course Title and Pitch Description values are mandatory.");
      return;
    }

    // Smart string parses
    const stepsArray = roadmap 
      ? roadmap.split(",").map(s => s.trim()).filter(Boolean) 
      : ["Gain foundational details", "Build practical scale projects", "Earn verified certificate"];

    const parsedPlatforms = platforms 
      ? platforms.split(";").map(plat => {
          const parts = plat.split(",");
          return {
            platform: parts[0]?.trim() || "Virtual Study Forum",
            path: parts[1]?.trim() || "Self Study resources",
            hasCertificate: parts[2]?.trim().toLowerCase() === "true"
          };
        }).filter(p => p.platform)
      : [
          { platform: "freeCodeCamp", path: "Basic Certified Sandbox Course", hasCertificate: true },
          { platform: "YouTube Guides", path: "Interactive hands-on tutorials", hasCertificate: false }
        ];

    const vacanciesArray = vacancies 
      ? vacancies.split(",").map(v => v.trim()).filter(Boolean)
      : ["Remote placements", "Scaleup contracts"];

    if (editingCardId) {
      // Find original card to retain ratings and nested verified comments
      const originalCard = skills.find(c => c.id === editingCardId);
      
      const updatedCard: SkillCardType = {
        id: editingCardId,
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop",
        avgLearningTime: avgLearningTime.trim() || "6 Weeks",
        vacancyPercentage: Number(vacancyPercentage) || 85,
        isAiGenerated: false,
        description: description.trim(),
        roadmapSteps: stepsArray,
        whereToLearn: parsedPlatforms,
        vacanciesList: vacanciesArray,
        comments: originalCard?.comments || [],
        rating: originalCard?.rating || 5.0
      };

      onEditCard(updatedCard);
      setMessage(`✅ Updated skill card "${title}" in Firestore database successfully.`);
      setEditingCardId(null);
    } else {
      const newCardData: Partial<SkillCardType> = {
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop",
        avgLearningTime: avgLearningTime.trim() || "6 Weeks",
        vacancyPercentage: Number(vacancyPercentage) || 85,
        isAiGenerated: false,
        description: description.trim(),
        roadmapSteps: stepsArray,
        whereToLearn: parsedPlatforms,
        vacanciesList: vacanciesArray,
        comments: [
          {
            id: `init-comm-${Date.now()}`,
            userName: "system_admin",
            text: "Administrative verified curriculum launched, open to candidate feedbacks.",
            rating: 5,
            timestamp: "Just now"
          }
        ]
      };

      onAddCard(newCardData);
      setMessage(`✅ Successfully created and published skill card "${title}" to Firestore.`);
    }

    clearFormFields();
    setActiveSubTab("manage");
  };

  const executeCardDeletion = (cardId: string, cardTitle: string) => {
    onDeleteCard(cardId);
    setMessage(`🗑️ Permanent delete request issued for "${cardTitle}"`);
    setConfirmDeleteId(null);
  };

  // Filter skills for list view
  const filteredSkills = skills.filter(card => 
    card.title.toLowerCase().includes(searchManageKey.toLowerCase()) || 
    card.category.toLowerCase().includes(searchManageKey.toLowerCase())
  );

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl min-h-[550px] flex flex-col justify-between">
      {!isUnlocked ? (
        // Fake 404 security shield
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/20 text-red-500 animate-pulse">
            <AlertCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 
              onClick={handleFakeClick}
              className="text-6xl sm:text-7xl font-mono font-extrabold tracking-widest text-neutral-900 dark:text-neutral-100 cursor-pointer select-none active:scale-95 transition-transform"
              id="admin-fake-404-btn"
            >
              404
            </h1>
            <p className="font-semibold text-lg text-neutral-700 dark:text-neutral-300">
              Diagnostic Service Fault
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
              Our network cannot locate the requested endpoint parameters. Tap on the security coordinate value to override safety metrics.
            </p>
          </div>

          <div className="pt-2 text-[10px] text-neutral-300 dark:text-neutral-700 select-none">
            {clickCount > 0 && `(System Stability handshakes remaining: ${4 - clickCount})`}
          </div>

          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Cancel Diagnostic
          </button>
        </div>
      ) : (
        // Unlocked Genuine Operations Controls Dashboard
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-100 dark:border-neutral-800 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 px-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Admin Active
                </span>
                {isDirectWebEntry && (
                  <span className="p-1 px-1.5 bg-sky-500/10 text-sky-500 rounded-lg text-xs font-mono">
                    admin.html Console
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight flex items-center gap-1.5 mt-1">
                ⚙️ Career Skills Control Desk
              </h2>
              <p className="text-xs text-neutral-500">Add, edit, and delete real-time Firestore education modules</p>
            </div>
            
            {!isDirectWebEntry && (
              <button 
                onClick={onClose}
                className="self-start px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Exit Console
              </button>
            )}
          </div>

          {/* Core Navigation Sub Tabs */}
          <div className="flex space-x-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl max-w-sm text-xs font-bold">
            <button
              onClick={() => setActiveSubTab("manage")}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${activeSubTab === "manage" ? "bg-white dark:bg-neutral-900 text-emerald-500 shadow-xs" : "text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-300"}`}
            >
              Manage Available Cards ({skills.length})
            </button>
            <button
              onClick={() => {
                setActiveSubTab("add");
                setEditingCardId(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${activeSubTab === "add" && !editingCardId ? "bg-white dark:bg-neutral-900 text-emerald-500 shadow-xs" : "text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-300"}`}
            >
              Publish New Skill
            </button>
          </div>

          {/* Dynamic Feedbacks */}
          {message && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/50 rounded-xl text-xs font-medium text-indigo-700 dark:text-indigo-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                {message}
              </span>
              <button onClick={() => setMessage("")} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sub Panels Dynamic Switching */}
          <div className="flex-1">
            {activeSubTab === "manage" ? (
              // Option A: Manage existing skill cards (Edit / Delete)
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    value={searchManageKey}
                    onChange={e => setSearchManageKey(e.target.value)}
                    placeholder="Search standard database curves via Title or Category..."
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {filteredSkills.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/10 border border-neutral-150 dark:border-neutral-800 rounded-2xl">
                    <Database className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                    <p className="text-xs text-neutral-500">No matched skill cards exist inside the selection.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-1">
                    {filteredSkills.map(card => {
                      const commSize = card.comments ? card.comments.length : 0;
                      return (
                        <div 
                          key={card.id}
                          className="p-3.5 bg-neutral-50 dark:bg-neutral-805 border border-neutral-150 dark:border-neutral-800/85 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition hover:border-neutral-300 dark:hover:border-neutral-700"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="p-1 px-1.5 bg-neutral-200 dark:bg-neutral-800 font-bold rounded-md text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                                {card.category}
                              </span>
                              <span className="text-[10px] text-amber-500 font-bold">
                                ★ {card.rating || "5.0"}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-neutral-800 dark:text-neutral-200 text-sm">
                              {card.title}
                            </h4>
                            <div className="flex items-center gap-4 text-[10px] text-neutral-400">
                              <span>⏱️ {card.avgLearningTime || "6 Weeks"}</span>
                              <span>💬 {commSize} reviews</span>
                              <span>🎯 Demand: {card.vacancyPercentage}%</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-center">
                            {/* Edit triggers populated add state */}
                            <button
                              onClick={() => startEditCard(card)}
                              className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                              title="Edit specific properties"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete implements confirmation toggle */}
                            {confirmDeleteId === card.id ? (
                              <div className="flex items-center gap-2 animate-pulse">
                                <button
                                  onClick={() => executeCardDeletion(card.id, card.title)}
                                  className="px-2.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition cursor-pointer text-[10px]"
                                >
                                  Confirm?
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="p-2 bg-neutral-250 dark:bg-neutral-800 hover:bg-neutral-300 rounded-xl transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setConfirmDeleteId(card.id);
                                  setMessage("Ready to apply destructive changes. Confirm carefully!");
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-500 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                                title="Permanently discard card document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Option B: Add course elements or Edit active course card pre-filled values
              <div className="space-y-4">
                {editingCardId && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                    <span>✏️ Editing Mode: Updating existing data model parameters for "{title}"</span>
                    <button 
                      onClick={cancelEdit}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg text-[9px] uppercase tracking-wide flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Stop Editing
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium max-h-[420px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-500 mb-1">Course / Career Title</label>
                      <input 
                        type="text" 
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Senior Artificial Intelligence Specialist"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        id="admin-form-title-input"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Category Classification</label>
                      <select 
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
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
                      <label className="block text-neutral-500 mb-1">Time Investment (Avg)</label>
                      <input 
                        type="text" 
                        value={avgLearningTime}
                        onChange={e => setAvgLearningTime(e.target.value)}
                        placeholder="e.g., 6 Weeks or 3 Months"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-neutral-500 mb-1">Hero Backdrop URL (Optional)</label>
                      <input 
                        type="text" 
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or leave blank"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-500 mb-1">Vacancy/Hiring demand index (0 - 100)%</label>
                      <input 
                        type="number" 
                        min={0}
                        max={100}
                        value={vacancyPercentage}
                        onChange={e => setVacancyPercentage(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 mb-1">Key Placements (Comma separated list)</label>
                      <input 
                        type="text" 
                        value={vacancies}
                        onChange={e => setVacancies(e.target.value)}
                        placeholder="e.g., Stripe, Shopify HQ, Remote Labs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Roadmap Curriculum Steps (Comma separated list)</label>
                    <input 
                      type="text" 
                      value={roadmap}
                      onChange={e => setRoadmap(e.target.value)}
                      placeholder="e.g. Phase 1: Core parameters, Phase 2: Scale deployments, Phase 3: Final validation"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1 bg-indigo-50 dark:bg-neutral-800 p-2 rounded-lg text-[10px] text-neutral-500 mb-2">
                      💡 <strong>Format:</strong> <em>PlatformName, CourseSummaryText, HasCertificate(true/false)</em>. Semicolon <strong>(;)</strong> splits separate platforms!
                    </label>
                    <input 
                      type="text" 
                      value={platforms}
                      onChange={e => setPlatforms(e.target.value)}
                      placeholder="e.g. Coursera, Interactive DeepLearning, true; Youtube, Crash Course, false"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 mb-1">Career Guidance & Syllabus Pitch Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe in accurate, beautiful details the career outlook, technologies taught, and curriculum modules..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-3 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                    {editingCardId ? (
                      <>
                        <button 
                          type="button" 
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-neutral-150 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition cursor-pointer"
                        >
                          Discard
                        </button>
                        <button 
                          type="submit" 
                          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          type="button" 
                          onClick={clearFormFields}
                          className="px-4 py-2 bg-neutral-150 dark:bg-neutral-800 hover:bg-neutral-200 rounded-xl transition cursor-pointer"
                        >
                          Reset Form
                        </button>
                        <button 
                          type="submit" 
                          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-md"
                        >
                          Publish Directly
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
