import React, { useState } from "react";
import { User, Copy, Check, Eye, EyeOff, Mail, Phone, Users, ShieldAlert } from "lucide-react";
import { UserProfile } from "../types";

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  publicMode?: boolean; // If true, view ONLY (cannot edit), supports follow
  onFollow?: () => void;
  isFollowing?: boolean;
}

export default function ProfileView({ profile, onUpdateProfile, publicMode = false, onFollow, isFollowing = false }: ProfileViewProps) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [contact, setContact] = useState(profile.contact);
  const [hideContact, setHideContact] = useState(profile.hideContactPublic);
  const [profileImg, setProfileImg] = useState(profile.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleUsernameChange = (val: string) => {
    // Restricted characters validation: & ! ? / } { ] [ \ |
    const regex = /[&!?/}{\[\]\\|]/g;
    if (regex.test(val)) {
      setValidationError("Usernames cannot contain specific symbols like & ! ? / } { ] [ \\ |");
    } else {
      setValidationError("");
    }
    // Clean string by stripping illegal elements
    const filtered = val.replace(/[&!?/}{\[\]\\|]/g, "");
    setUsername(filtered);
  };

  const handleSave = () => {
    if (validationError) return;
    onUpdateProfile({
      name,
      username,
      bio,
      contact,
      hideContactPublic: hideContact,
      profileImage: profileImg
    });
  };

  const publicUrl = `${window.location.origin}/?user=${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6 shadow-xs max-w-lg mx-auto">
      {/* Portfolio visual header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div className="relative group shrink-0">
          <img
            src={profileImg}
            alt={profile.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500"
          />
          {!publicMode && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity cursor-pointer">
              <span 
                onClick={() => {
                  const url = prompt("Enter profile image URL (e.g., Unsplash):", profileImg);
                  if (url) {
                    setProfileImg(url);
                    onUpdateProfile({ profileImage: url });
                  }
                }}
                className="text-[10px] font-bold text-white uppercase text-center"
              >
                Change
              </span>
            </div>
          )}
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {profile.name}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              @{profile.username}
            </span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-xs leading-relaxed">
            {profile.bio || "No professional bio added yet."}
          </p>

          <div className="flex justify-center sm:justify-start items-center gap-4 text-xs font-semibold text-neutral-500 pt-1">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-emerald-500" /> {profile.followers?.length || 0} followers
            </span>
            <span>
              {profile.following?.length || 0} following
            </span>
          </div>
        </div>
      </div>

      {publicMode ? (
        // PUBLIC VIEW PORTFOLIO (Other users see this)
        <div className="space-y-4">
          <div className="space-y-1 text-xs font-medium">
            <span className="text-neutral-400 uppercase tracking-wide text-[10px] block">Public Bio Portfolio</span>
            <div className="bg-neutral-50 dark:bg-neutral-800/25 border border-neutral-150 dark:border-neutral-800 p-3.5 rounded-2xl">
              <p className="text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                {profile.bio || "Hi, I am exploring skills to get ready with the team!"}
              </p>
            </div>
          </div>

          {/* Contact Details (Conditional visibility) */}
          {(!profile.hideContactPublic || profile.contact) && (
            <div className="space-y-1 text-xs font-medium">
              <span className="text-neutral-400 uppercase tracking-wide text-[10px] block">Contact Info</span>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/25 p-3 rounded-xl border border-neutral-150 dark:border-neutral-800">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span className="font-light truncate">{profile.contact || "e.g. user@verified.com"}</span>
              </div>
            </div>
          )}

          {/* Follow toggle button */}
          {onFollow && (
            <button
              onClick={onFollow}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition duration-200 shadow-xs ${isFollowing ? "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10"}`}
            >
              {isFollowing ? "✓ Friend Following" : "Follow Professional"}
            </button>
          )}
        </div>
      ) : (
        // EDITABLE LOGGED-IN PANEL
        <div className="space-y-5 text-xs font-medium">
          <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 tracking-tight">
            Configure Profile Portfolio
          </h3>

          {validationError && (
            <div className="p-3 bg-red-100/10 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-500/10 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-500 mb-10.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); onUpdateProfile({ name: e.target.value }); }}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-neutral-500 mb-10.5">Username (restricted characters filter)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-500 mb-10.5">Professional Biography</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => { setBio(e.target.value); onUpdateProfile({ bio: e.target.value }); }}
              placeholder="Tell other students what skills you're currently mastering..."
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-500 mb-10.5">Contact Detail (Email/Phone)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => { setContact(e.target.value); onUpdateProfile({ contact: e.target.value }); }}
                placeholder="e.g., student@getready.com"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => {
                  const updatedValue = !hideContact;
                  setHideContact(updatedValue);
                  onUpdateProfile({ hideContactPublic: updatedValue });
                }}
                className={`w-full py-2 px-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between gap-2 ${hideContact ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"}`}
              >
                <span className="flex items-center gap-1.5">
                  {hideContact ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {hideContact ? "Contact is Hidden" : "Contact is Public"}
                </span>
                <span className="text-[9px] uppercase font-bold text-neutral-400">Toggle Visibility</span>
              </button>
            </div>
          </div>

          {/* Copyable Public URL segment */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-500 block mb-1">Your Portfolio Public Link:</span>
            <div className="flex gap-2 bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5">
              <span className="flex-1 font-mono text-[10px] text-neutral-500 truncate self-center">
                {publicUrl}
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg flex items-center gap-1 font-bold text-[10px] shrink-0"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
