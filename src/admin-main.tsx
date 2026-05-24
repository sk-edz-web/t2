import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AdminPanel from './components/AdminPanel';
import { subscribeToSkills, saveSkillToFirestore, deleteSkillFromFirestore } from './data';
import { SkillCardType } from './types';
import './admin-index.css';

function AdminApp() {
  const [skills, setSkills] = useState<SkillCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Synchronize administrative view with Firestore active skill collection
    const unsubscribe = subscribeToSkills((data) => {
      setSkills(data);
      setLoading(false);
    }, []);
    return () => unsubscribe();
  }, []);

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

  const handleEditManualCard = async (updatedCard: SkillCardType) => {
    try {
      await saveSkillToFirestore(updatedCard);
    } catch (err) {
      console.error("Failed to update manual skill in real-time DB:", err);
    }
  };

  const handleDeleteManualCard = async (cardId: string) => {
    try {
      await deleteSkillFromFirestore(cardId);
    } catch (err) {
      console.error("Failed to delete manual skill from Firestore:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-8 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-500 font-mono tracking-wider">Syncing SECURE CONTROL PANELS...</p>
          </div>
        ) : (
          <AdminPanel 
            skills={skills}
            onAddCard={handleAddManualCard}
            onEditCard={handleEditManualCard}
            onDeleteCard={handleDeleteManualCard}
            onClose={() => {
              // Return safely to main index student portfolio
              window.location.href = "/";
            }}
          />
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
