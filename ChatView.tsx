import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Briefcase, Award, Star, MessageSquare, CornerDownRight, Check, X, ShieldAlert } from "lucide-react";
import { SkillCardType, Comment } from "../types";

interface SkillCardProps {
  key?: string | number;
  card: SkillCardType;
  onAddComment: (cardId: string, commentText: string, rating: number) => void;
  currentUser?: { name: string; username: string };
}

export default function SkillCard({ card, onAddComment, currentUser }: SkillCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(card.id, newComment, selectedRating);
    setNewComment("");
    setSelectedRating(5);
  };

  const commentsList = card.comments || [];
  const whereToLearnList = card.whereToLearn || [];

  const averageRating = commentsList.length > 0 
    ? (commentsList.reduce((acc, c) => acc + c.rating, 0) / commentsList.length).toFixed(1)
    : "5.0";

  return (
    <>
      {/* 2-Column Mobile Feed / Responsive Standard Card */}
      <motion.div
        layoutId={`card-container-${card.id}`}
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col h-full"
        whileTap={{ scale: 0.98 }}
      >
        {/* Course Banner */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {card.isAiGenerated && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/90 text-white backdrop-blur-xs flex items-center gap-1">
              <SparkIcon className="w-3 h-3" /> AI Generated
            </span>
          )}
          
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-neutral-900/60 dark:bg-neutral-950/60 text-white backdrop-blur-xs">
            {card.category}
          </div>
        </div>

        {/* Info Area (Compact Index view) */}
        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-500 transition-colors">
              {card.title}
            </h3>
            
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
              {card.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium truncate">{card.avgLearningTime}</span>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 justify-end">
              <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {card.vacancyPercentage}% <span className="text-[9px] text-neutral-400 font-normal">job</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Full screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              layoutId={`card-container-${card.id}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative block"
            >
              {/* Top Cover Image */}
              <div className="relative h-60 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors text-white rounded-full backdrop-blur-md"
                  id={`close-modal-btn-${card.id}`}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 items-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-900/75 text-white backdrop-blur-md">
                    {card.category}
                  </span>
                  {card.isAiGenerated && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/85 text-white backdrop-blur-md flex items-center gap-1">
                      <SparkIcon className="w-3.5 h-3.5" /> AI Augmented
                    </span>
                  )}
                </div>
              </div>

              {/* Main Content Info */}
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {card.title}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Average Student Review Score: <span className="font-bold text-amber-500 text-sm">★ {averageRating}</span> ({commentsList.length} reviews)
                    </p>
                  </div>
                  
                  {/* Dynamic vacancy metrics banner */}
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Study Span</div>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{card.avgLearningTime}</div>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-center">
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Placement Rate</div>
                      <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{card.vacancyPercentage}%</div>
                    </div>
                  </div>
                </div>

                {/* Road Map & Learn pathways */}
                <div className="mt-5 space-y-6">
                  {/* Detailed Description */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">About this skill</h4>
                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                      {card.description}
                    </p>
                  </div>

                  {/* Syllabus / Roadmaps steps */}
                  {card.roadmapSteps && card.roadmapSteps.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mb-2">
                        <Award className="w-4 h-4 text-amber-500" /> Syllabus / Milestones
                      </h4>
                      <div className="space-y-2 pl-1">
                        {card.roadmapSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                            <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 self-start">
                              {(idx + 1).toString().padStart(2, "0")}
                            </span>
                            <span className="font-light">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certified Learning hubs */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mb-2">
                      <Award className="w-4 h-4 text-emerald-500" /> Verified Free Learning Platforms
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {whereToLearnList.map((link, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{link.platform}</span>
                            <p className="text-[11px] text-neutral-500 mt-1">{link.path}</p>
                          </div>
                          {link.hasCertificate && (
                            <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                              <Check className="w-3.5 h-3.5" /> Free Certified Path Included
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Geographic Hotspots / Vacancies info */}
                  {card.vacanciesList && card.vacanciesList.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 mb-2">
                        <Briefcase className="w-4 h-4 text-indigo-500" /> Hiring Fields & Placement Fields
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {card.vacanciesList.map((vac, idx) => (
                          <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            🏢 {vac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Core comments & community reviews */}
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-neutral-500" /> Student Verification Reviews ({commentsList.length})
                    </h4>

                    {/* Submit Comment */}
                    <form onSubmit={handleCommentSubmit} className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-150 dark:border-neutral-800/80">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Add course verification feedback:</span>
                        
                        {/* Interactive stars selection */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <button
                              type="button"
                              key={starIdx}
                              onClick={() => setSelectedRating(starIdx)}
                              className="focus:outline-hidden"
                            >
                              <Star
                                className={`w-4 h-4 ${starIdx <= selectedRating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={currentUser ? "Share your learning progress..." : "Log in to add a review..."}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 transition-colors"
                        >
                          Submit
                        </button>
                      </div>
                    </form>

                    {/* Feed reviews scroll */}
                    <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                      {commentsList.length === 0 ? (
                        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 py-4">
                          No verification reviews yet. Be the first to add student feedback!
                        </p>
                      ) : (
                        commentsList.map((comm, idx) => (
                          <div key={comm.id || `comment-key-${idx}`} className="p-3 text-xs bg-white dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800/60 rounded-xl space-y-1">
                            <div className="flex items-center justify-between gap-2 text-neutral-500">
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200">@{comm.userName}</span>
                              <div className="flex gap-0.5 text-amber-500">
                                {Array.from({ length: comm.rating || 5 }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                                ))}
                              </div>
                            </div>
                            <p className="text-neutral-700 dark:text-neutral-300 font-light">{comm.text}</p>
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block text-right">{comm.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904z"
      />
    </svg>
  );
}
