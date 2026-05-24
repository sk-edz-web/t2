/**
 * App.tsx
 * 
 * MAIN DASHBOARD AND USER SCREEN ORCHESTRATION.
 * Adheres strictly to layout disciplines, including mobile-first scaling, responsive grids (1 row = 2 columns on mobile), and Light/Dark themes.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Search, 
  Sparkles, 
  User, 
  Sun, 
  Moon, 
  Clock, 
  Briefcase, 
  Key, 
  Compass, 
  BookOpen, 
  SearchIcon, 
  Settings, 
  AlertTriangle,
  FileText,
  ChevronRight,
  ThumbsUp,
  Award
} from "lucide-react";
import { SkillCardType, UserProfile, Comment } from "./types";
import SkillCard from "./components/SkillCard";
import ChatView from "./components/ChatView";
import ProfileView from "./components/ProfileView";
import AdminPanel from "./components/AdminPanel";
import LoginView from "./components/LoginView";

import { 
  subscribeToSkills, 
  saveSkillToFirestore, 
  deleteSkillFromFirestore,
  addCommentToSkill, 
  subscribeToUserProfile, 
  saveUserProfileToFirestore,
  auth,
  signOut,
  onAuthStateChanged
} from "./data";

// Prepopulated high-definition skill guidelines for interactive learning
const INITIAL_SKILLS: SkillCardType[] = [
  {
    id: "skill-react",
    title: "React.js Web Dev",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=80",
    avgLearningTime: "6 Weeks",
    vacancyPercentage: 92,
    isAiGenerated: false,
    description: "Learn component architectures, react state management hooks, asynchronous fetch routes, and modern rendering patterns.",
    roadmapSteps: [
      "Master modern ES6 JavaScript & functional states",
      "Learn JSX rendering rules under React 19",
      "Configure standard state hooks (useState, useEffect, useMemo)",
      "Build real-time fetching dashboards linked to APIs",
      "Apply optimization rules & state containers"
    ],
    whereToLearn: [
      { platform: "freeCodeCamp.org", path: "Scientific Web Developer and Front-End Certification", hasCertificate: true },
      { platform: "Meta Career Academy on Coursera", path: "Meta Front End Professional Path", hasCertificate: true },
      { platform: "Scrimba Dev Path", path: "Interactive Code Playground", hasCertificate: false }
    ],
    vacanciesList: ["Meta Remote Core", "Vercel Platform Engine", "Contract Labs Inc"],
    comments: [
      { id: "c1", userName: "harish_dev", text: "Truly detailed steps! Made building products extremely clear.", rating: 5, timestamp: "2 hours ago" },
      { id: "c2", userName: "prakas_k", text: "Fabulous layout. The course suggestions are completely free.", rating: 4, timestamp: "5 hours ago" }
    ],
    rating: 4.5
  },
  {
    id: "skill-uiux",
    title: "UI/UX Figma Design",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=500&auto=format&fit=crop&q=80",
    avgLearningTime: "4 Weeks",
    vacancyPercentage: 88,
    isAiGenerated: true,
    description: "Discover spacing guides, modern typographic principles, responsive auto-layouts, prototyping flows, and design systems.",
    roadmapSteps: [
      "Spacing scale grids, layout margins, and constraints",
      "Typography styling systems and responsive column widths",
      "Auto-layout elements, components, and interactive variants",
      "Responsive UI wires, functional wireframes, and design components",
      "Pragmatic handoff checklists for engineering teams"
    ],
    whereToLearn: [
      { platform: "Figma Learn Hub", path: "Official design system & layout courses", hasCertificate: true },
      { platform: "Google UX Academy", path: "Complete Professional UX wireframe tracks", hasCertificate: true }
    ],
    vacanciesList: ["Vercel UI Unit", "Scale AI Products", "Agency Hub Global"],
    comments: [
      { id: "c3", userName: "meghna_s", text: "Figma auto layout guides inside here are perfect.", rating: 5, timestamp: "1 day ago" }
    ],
    rating: 5.0
  },
  {
    id: "skill-python",
    title: "Python AI & Models",
    category: "AI & Analytics",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=80",
    avgLearningTime: "8 Weeks",
    vacancyPercentage: 95,
    isAiGenerated: false,
    description: "Get ready to parse datasets using Python core functions, Pandas, NumPy data blocks, and basic prompt pipelines.",
    roadmapSteps: [
      "Python data types, variables, lists, and loops",
      "Parse and merge CSV datasets using modern Pandas functions",
      "Configure data visualizations with Seaborn mapping blocks",
      "Construct neural regression prototypes with Gemini APIs",
      "Publish live Jupyter Notebooks to Git repositories"
    ],
    whereToLearn: [
      { platform: "Kaggle Certified Path", path: "Micro-tutorials for basic python & charts", hasCertificate: true },
      { platform: "Google Cloud Skill Boost", path: "Generative AI Foundations syllabus", hasCertificate: true }
    ],
    vacanciesList: ["OpenAI Pipeline operations", "Scale AI Data Team", "Quant Analytics Labs"],
    comments: [],
    rating: 4.0
  },
  {
    id: "skill-marketing",
    title: "Growth Marketing",
    category: "Marketing",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80",
    avgLearningTime: "3 weeks",
    vacancyPercentage: 82,
    isAiGenerated: false,
    description: "Master modern user acquisition methodologies, email marketing automation systems, metrics parsing, and branding campaigns.",
    roadmapSteps: [
      "Configure fundamental metrics (CAC, LTV, ROAS, conversion scales)",
      "Set up target email automation pipelines with segmented tags",
      "Develop responsive graphical copy utilizing Canva or Figma",
      "Query search optimization (SEO) networks and meta titles",
      "Audit analytics metrics using custom feedback reports"
    ],
    whereToLearn: [
      { platform: "Google Digital Garage", path: "Certified core marketing principles", hasCertificate: true },
      { platform: "HubSpot Academy", path: "Inbound email automation professional standard", hasCertificate: true }
    ],
    vacanciesList: ["Zapier Scale Operations", "Tailwind Marketing group", "SaaS Growth Labs"],
    comments: [
      { id: "c4", userName: "kamal_m", text: "HubSpot course recommended here is top tier, highly practical.", rating: 5, timestamp: "3 days ago" }
    ],
    rating: 4.8
  }
];

const GUEST_PROFILE: UserProfile = {
  uid: "guest-id",
  name: "Guest Student",
  username: "anonymous_learner",
  bio: "Browsing course pathways anonymously. Verify your account to customize and participate in certifications.",
  contact: "guest@getready.com",
  hideContactPublic: true,
  followers: [],
  following: [],
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
};

export default function App() {
  // Navigation: "home" | "search" | "ai" | "profile" | "public-portfolio"
  const [activeTab, setActiveTab] = useState<"home" | "search" | "ai" | "profile" | "public-portfolio">("home");
  
  // Theme state: "light" | "dark"
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showSettings, setShowSettings] = useState(false);

  // Authenticated coordinates
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>(GUEST_PROFILE);

  // Skills dynamic records (Synchronized with Firestore DB in real-time)
  const [skills, setSkills] = useState<SkillCardType[]>(INITIAL_SKILLS);
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "React Web Dev", "Figma Design templates", "Flipped syllabus model"
  ]);

  const [isAdminPage, setIsAdminPage] = useState(false);

  useEffect(() => {
    if ((window as any).IS_ADMIN_HTML || window.location.pathname.endsWith("admin.html")) {
      setIsAdminPage(true);
    }
  }, []);

  const [followedInstructors, setFollowedInstructors] = useState<string[]>([]);

  // 1. Listen to authentication transformations
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setProfile(GUEST_PROFILE);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen to profile updates corresponding to user uid
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToUserProfile(currentUser.uid, (dbProfile) => {
      if (dbProfile) {
        setProfile(dbProfile);
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  // 3. Listen to real-time skills document collection in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToSkills((updatedData) => {
      setSkills(updatedData);
    }, INITIAL_SKILLS);
    return () => unsubscribe();
  }, []);

  // Sync theme directly onto HTML element class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Support public profile URL inspection via URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inspectUser = params.get("user");
    if (inspectUser) {
      setActiveTab("public-portfolio");
    }
  }, []);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...profile, ...updates } as UserProfile;
    setProfile(updated);
    saveUserProfileToFirestore(currentUser.uid, updated);
  };

  const handleFollowClick = () => {
    const isAlreadyFollowing = followedInstructors.includes(profile.uid);
    if (isAlreadyFollowing) {
      setFollowedInstructors(prev => prev.filter(uid => uid !== profile.uid));
      setProfile(prev => ({ ...prev, followers: prev.followers.filter(uid => uid !== "temp-user") }));
    } else {
      setFollowedInstructors(prev => [...prev, profile.uid]);
      setProfile(prev => ({ ...prev, followers: [...prev.followers, "temp-user"] }));
    }
  };

  const handleAddComment = async (cardId: string, commentText: string, rating: number) => {
    const usernameTag = currentUser ? (profile.username || "verified_user") : "guest_ready";
    const newComm: Comment = {
      id: Math.random().toString(),
      userName: usernameTag,
      text: commentText,
      rating: rating,
      timestamp: "Just now"
    };

    const targetCard = skills.find(card => card.id === cardId);
    if (targetCard) {
      const updatedComments = [newComm, ...targetCard.comments];
      const avg = Number((updatedComments.reduce((acc, c) => acc + c.rating, 0) / updatedComments.length).toFixed(1));
      
      try {
        await addCommentToSkill(cardId, updatedComments, avg);
      } catch (err) {
        console.error("Failed to commit comment to real-time DB:", err);
      }
    }
  };

  // Add manually uploaded cards from secret admin gateway
  const handleAddManualCard = async (newCardData: Partial<SkillCardType>) => {
    const freshCard: SkillCardType = {
      id: `manual-skill-${Date.now()}`,
      title: newCardData.title || "Untitled Manual Syllabus",
      category: newCardData.category || "General",
      imageUrl: newCardData.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop",
      avgLearningTime: newCardData.avgLearningTime || "4 Weeks",
      vacancyPercentage: newCardData.vacancyPercentage || 85,
      isAiGenerated: false,
      description: newCardData.description || "Manual skill description provided.",
      roadmapSteps: newCardData.roadmapSteps || [],
      whereToLearn: newCardData.whereToLearn || [],
      vacanciesList: newCardData.vacanciesList || [],
      comments: newCardData.comments || [],
      rating: 5.0
    };

    try {
      await saveSkillToFirestore(freshCard);
    } catch (err) {
      console.error("Failed to write manual skill to real-time DB:", err);
    }
  };

  // Edit existing skill card in Firestore
  const handleEditManualCard = async (updatedCard: SkillCardType) => {
    try {
      await saveSkillToFirestore(updatedCard);
    } catch (err) {
      console.error("Failed to update manual skill in real-time DB:", err);
    }
  };

  // Delete existing skill card from Firestore
  const handleDeleteManualCard = async (cardId: string) => {
    try {
      await deleteSkillFromFirestore(cardId);
    } catch (err) {
      console.error("Failed to delete manual skill from Firestore:", err);
    }
  };

  // AI Career match generator matching query fields
  const getAISmartSuggestion = () => {
    if (skills.length === 0) return INITIAL_SKILLS[0];
    const highMatch = skills.reduce((prev, current) => (prev.vacancyPercentage > current.vacancyPercentage) ? prev : current);
    return highMatch;
  };

  const filteredSkills = skills.filter(skill => 
    skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addSearchToHistory = (query: string) => {
    if (!query.trim() || searchHistory.includes(query)) return;
    setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSearchToHistory(searchQuery);
  };

  const smartAiSkill = getAISmartSuggestion();

  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex items-center justify-center transition-colors duration-350">
        <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
          <AdminPanel 
            skills={skills}
            onAddCard={handleAddManualCard}
            onEditCard={handleEditManualCard}
            onDeleteCard={handleDeleteManualCard}
            onClose={() => {
              window.location.href = "/";
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-350">
      
      {/* 1. Global Navigation Top Header */}

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-3 pb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50 font-sans uppercase">
                Get Ready With Us
              </h1>
              <span className="text-[9px] font-mono tracking-widest text-emerald-500 uppercase block leading-none font-bold">
                Learn Practical Skills
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick theme toggles/settings selector */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 sm:p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:text-emerald-500 dark:text-neutral-400 dark:hover:text-emerald-400 transition-all flex items-center gap-1 bg-transparent text-neutral-600"
              id="top-settings-btn"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Drawer Overlay */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs" onClick={() => setShowSettings(false)} />
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 relative z-10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                <h3 className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">
                  Configure Settings
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-xs font-bold text-neutral-400 hover:text-neutral-600">
                  Close
                </button>
              </div>

              {/* Theme Settings Selector as requested by user */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Visual Canvas Theme</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${theme === "light" ? "border-emerald-500 bg-emerald-50/20 text-emerald-500" : "border-neutral-200 dark:border-neutral-800 text-neutral-500"}`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>White Theme</span>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${theme === "dark" ? "border-emerald-500 bg-emerald-950/30 text-emerald-400" : "border-neutral-200 dark:border-neutral-800 text-neutral-500"}`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark Theme</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Administrative Panel</span>
                <button
                  onClick={() => {
                    window.location.href = "/admin.html";
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-emerald-500 font-bold text-xs text-neutral-700 dark:text-neutral-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-emerald-500" />
                  <span>Open Standalone Admin Portal</span>
                </button>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">App Core Information</span>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                  "Get Ready With Us" allows you to study dynamic pathways. Expand cards to view free certificate platforms and placements. Check Alnitak AI for guidance.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT CANVAS */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME */}
          {activeTab === "home" && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Premium Hero Banner suggesting the highest placement skill */}
              {smartAiSkill && (
                <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 dark:border-neutral-850 text-white relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 shadow-sm">
                  {/* Glowing background accent */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />
                  
                  <div className="space-y-3 relative z-10 md:max-w-xl">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                      ✨ AI Best Skill Recommendation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black leading-tight">
                      Master <span className="text-emerald-400">{smartAiSkill.title}</span> – Placements active at {smartAiSkill.vacancyPercentage}%!
                    </h2>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Our dynamic Alnitak analysis pipeline recommends {smartAiSkill.title}. Junior placements are surging across modern remote teams. Master the curriculum under {smartAiSkill.avgLearningTime}.
                    </p>
                    <div className="pt-1 flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>{smartAiSkill.avgLearningTime} study</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Free Certification verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center md:items-end md:justify-end">
                    <button
                      onClick={() => {
                        const el = document.getElementById(`close-modal-btn-${smartAiSkill.id}`);
                        if (el) {
                          el.click();
                        } else {
                          alert(`Click the card "${smartAiSkill.title}" below to open full details!`);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-xs font-bold"
                    >
                      Explore Skill Map
                    </button>
                  </div>
                </div>
              )}

              {/* Working search inside Home card indexing */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    📚 Skill Curriculum Pathways ({skills.length})
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Syllabus directories compiled with verified platforms and cert links
                  </p>
                </div>

                {/* Sub-Search and filter bar inside Home */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400">
                    <SearchIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full px-9 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Mobile-centric card list: 1 row = 2 cards on mobile! PC is flexible grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredSkills.map(card => (
                  <SkillCard 
                    key={card.id} 
                    card={card} 
                    onAddComment={handleAddComment}
                    currentUser={profile}
                  />
                ))}
              </div>

              {filteredSkills.length === 0 && (
                <div className="text-center py-12 p-6 bg-white dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    No learning pathways matched "{searchQuery}"
                  </p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs font-bold text-emerald-500 hover:underline"
                  >
                    Reset Search Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: SEARCH */}
          {activeTab === "search" && (
            <motion.div
              key="tab-search"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    🔍 Career Search Grounding
                  </h3>
                  <p className="text-xs text-neutral-500">Query career roles, high vacancies, and automated study roadmaps</p>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute left-3.5 top-3.5 text-neutral-400">
                      <SearchIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Graphic design, React dev, High vacancy, Cloud certified..."
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-white text-xs transition duration-150 shadow-md shadow-emerald-500/10"
                  >
                    Search
                  </button>
                </form>

                {searchHistory.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Recent Search Keywords</span>
                    <div className="flex flex-wrap gap-1.5">
                      {searchHistory.map((hist, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSearchQuery(hist)}
                          className="px-2.5 py-1 text-[11px] bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-450 rounded-lg transition border border-neutral-200 dark:border-neutral-800"
                        >
                          🕒 {hist}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Curated Matches */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Suggested Match Results</span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredSkills.map(card => (
                    <SkillCard 
                      key={card.id} 
                      card={card} 
                      onAddComment={handleAddComment}
                      currentUser={profile}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ALNITAK Chatbot */}
          {activeTab === "ai" && (
            <motion.div
              key="tab-ai"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <ChatView />
            </motion.div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === "profile" && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              {currentUser && profile.uid !== "guest-id" ? (
                <div className="space-y-4">
                  <div className="max-w-md mx-auto flex justify-between items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-2xl">
                    <span className="text-xs text-emerald-500 font-bold">
                      🛡️ Authenticated Student Coordinate
                    </span>
                    <button
                      onClick={() => signOut(auth)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                  <ProfileView 
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </div>
              ) : (
                <LoginView 
                  onLoginSuccess={() => {
                    setActiveTab("profile");
                  }}
                />
              )}
            </motion.div>
          )}

          {/* TAB 5: PUBLIC PORTFOLIO MODE */}
          {activeTab === "public-portfolio" && (
            <motion.div
              key="tab-public"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center max-w-lg mx-auto pb-2">
                <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                  🌐 Public Viewer Sandbox
                </span>
                <button
                  onClick={() => {
                    // Strip the user param
                    window.history.pushState({}, '', window.location.pathname);
                    setActiveTab("profile");
                  }}
                  className="text-xs font-bold text-emerald-500 hover:underline"
                >
                  Return to Dashboard Edit
                </button>
              </div>

              <ProfileView 
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                publicMode={true}
                onFollow={handleFollowClick}
                isFollowing={followedInstructors.includes(profile.uid)}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* Secret Admin panel 404 trigger Footer link */}
        <footer className="mt-16 pt-6 border-t border-neutral-200 dark:border-neutral-800/80 text-center space-y-4 text-xs text-neutral-400 select-none pb-8">
          <p>© 2026 Get Ready With Us. All educational materials certified.</p>
          <div className="flex gap-4 justify-center items-center">
            <button 
              onClick={() => {
                window.location.href = "/admin.html";
              }}
              className="hover:underline hover:text-red-500 cursor-pointer text-[10px]"
            >
              System diagnostic (Load Secure Admin Console)
            </button>
          </div>
        </footer>
      </main>

      {/* Secret Admin Modal block triggered from diagnostic link */}
      <div 
        id="admin-overlay-container" 
        className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-sm"
        style={{ display: "none" }}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
            <AdminPanel 
              skills={skills}
              onAddCard={(card) => {
                handleAddManualCard(card);
                const modal = document.getElementById("admin-overlay-container");
                if (modal) modal.style.display = "none";
              }}
              onEditCard={(updatedCard) => {
                handleEditManualCard(updatedCard);
                const modal = document.getElementById("admin-overlay-container");
                if (modal) modal.style.display = "none";
              }}
              onDeleteCard={(cardId) => {
                handleDeleteManualCard(cardId);
              }}
              onClose={() => {
                const modal = document.getElementById("admin-overlay-container");
                if (modal) modal.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile focused bottom navigation pill */}
      <nav className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl py-2 px-3 flex items-center justify-around shadow-lg transition-colors">
        <button
          onClick={() => { setActiveTab("home"); setSearchQuery(""); }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${activeTab === "home" ? "text-emerald-500 font-bold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => { setActiveTab("search"); }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${activeTab === "search" ? "text-emerald-500 font-bold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => { setActiveTab("ai"); }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${activeTab === "ai" ? "text-emerald-500 font-bold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-[10px]">Alnitak</span>
        </button>

        <button
          onClick={() => { setActiveTab("profile"); }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${activeTab === "profile" || activeTab === "public-portfolio" ? "text-emerald-500 font-bold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
