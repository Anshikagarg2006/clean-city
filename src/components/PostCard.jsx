import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  AlertTriangle,
  PlusCircle, 
  Send, 
  Trash2, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Radio,
  FileText
} from 'lucide-react';
import { generateAuthorityEmailDraft, cleanPhoneNumber, sanitizeUrl } from '../utils/authorityUtils';

export function PostCard({
  post,
  darkMode,
  userLocation,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onDeleteComment,
  onAddInformation,
  isSaved,
  onOpenLocationModal
}) {
  const [showComments, setShowComments] = useState(false);
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [showAuthority, setShowAuthority] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [infoText, setInfoText] = useState("");
  const [infoAuthor, setInfoAuthor] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Check if authority contact details exist
  const hasAuthorityDetails = Boolean(
    post.authorityContact && (
      post.authorityContact.name ||
      post.authorityContact.phone ||
      post.authorityContact.email ||
      post.authorityContact.websiteUrl
    )
  );

  const cleanPhone = post.authorityContact?.phone ? cleanPhoneNumber(post.authorityContact.phone) : '';
  const cleanWeb = post.authorityContact?.websiteUrl ? sanitizeUrl(post.authorityContact.websiteUrl) : '';
  const emailDraft = hasAuthorityDetails && post.authorityContact?.email 
    ? generateAuthorityEmailDraft(post, post.authorityContact) 
    : null;

  // Handle Share Post
  const handleShare = async () => {
    const shareData = {
      title: `CleanCity AI: ${post.category} at ${post.locality}, ${post.city}`,
      text: `${post.caption}\nLocation: ${post.locality}, ${post.city}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed, using clipboard copy:', err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (err) {
      console.warn('Failed to copy link:', err);
    }
  };

  // Submit comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: commentAuthor.trim() || 'Local Resident',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(commentAuthor.trim() || 'Resident')}`,
      text: commentText.trim(),
      timestamp: 'Just now',
      isOwn: true
    };

    onAddComment(post.id, newComment);
    setCommentText("");
  };

  // Submit community update
  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!infoText.trim()) return;

    const newInfo = {
      id: `info-${Date.now()}`,
      author: infoAuthor.trim() || 'Neighbor',
      text: infoText.trim(),
      timestamp: 'Just now'
    };

    onAddInformation(post.id, newInfo);
    setInfoText("");
    setShowAddInfo(false);
  };

  return (
    <article 
      id={`post-${post.id}`} 
      className={`rounded-3xl border shadow-lg transition-all duration-200 overflow-hidden ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* 1. Post Header: Author Avatar, Name, Location, Distance, Category */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <img 
            src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'Citizen'}`} 
            alt={post.author?.name || 'Citizen'} 
            className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0 bg-slate-800"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Civic${post.id}`;
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className={`font-bold text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {post.author?.name || 'Local Resident'}
              </span>
              {post.isSynthetic ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  Community Member
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  You
                </span>
              )}
            </div>

            {/* Location & Time info */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium text-slate-300">
                {post.locality}, {post.city}
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.postedAt || post.reportedAt || 'Recent'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Distance Badge & Category Pill */}
        <div className="flex flex-col items-end space-y-1.5 shrink-0">
          {post.distanceFormatted ? (
            <span 
              onClick={onOpenLocationModal}
              title="Click to view your reference area"
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 cursor-pointer hover:bg-emerald-500/25 transition-colors"
            >
              <MapPin className="w-3 h-3" />
              <span>{post.distanceFormatted}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">—</span>
          )}

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 max-w-[150px] truncate">
            {post.category}
          </span>
        </div>
      </div>

      {/* 2. Post Photo */}
      {post.photo && (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 overflow-hidden group">
          <img 
            src={post.photo} 
            alt={post.category || 'Civic issue photo'} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 cursor-pointer"
            onClick={() => setImageModalOpen(true)}
            onError={(e) => {
              e.target.src = "/assets/dark-streetlight.jpg";
            }}
          />
          {/* Zoom Indicator */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-sm text-[11px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Click to view photo
          </div>

          {post.isSynthetic && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-slate-300 font-medium border border-white/10">
              Demo Sample
            </div>
          )}
        </div>
      )}

      {/* Image Modal for Full View */}
      {imageModalOpen && (
        <div 
          onClick={() => setImageModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <img 
              src={post.photo} 
              alt={post.category} 
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl" 
            />
            <button 
              onClick={() => setImageModalOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. Action Bar: Like, Comment, Community Updates, Share, Save */}
      <div className="px-4 sm:px-5 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2">
          
          {/* Like Button */}
          <button 
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-90 ${
              post.isLikedByUser 
                ? 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25' 
                : darkMode 
                  ? 'hover:bg-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Like post"
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${post.isLikedByUser ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="font-bold">{post.likes || 0}</span>
          </button>

          {/* Comment Button */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              showComments 
                ? 'bg-emerald-500/15 text-emerald-400' 
                : darkMode 
                  ? 'hover:bg-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Comment on post"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-bold">{(post.comments || []).length}</span>
          </button>

          {/* Community Updates Button */}
          <button 
            onClick={() => setShowAddInfo(!showAddInfo)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              showAddInfo 
                ? 'bg-cyan-500/15 text-cyan-400' 
                : darkMode 
                  ? 'hover:bg-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="View or add community updates"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Updates</span>
            {(post.additionalInfo || []).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-bold">
                {post.additionalInfo.length}
              </span>
            )}
          </button>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              copiedShare 
                ? 'bg-emerald-500 text-white' 
                : darkMode 
                  ? 'hover:bg-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Share post"
          >
            {copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span className="hidden sm:inline">{copiedShare ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>

        {/* Save Bookmark Button */}
        <button 
          onClick={() => onToggleSave(post.id)}
          className={`p-2 rounded-xl transition-all active:scale-90 ${
            isSaved 
              ? 'text-amber-400 bg-amber-500/15' 
              : darkMode 
                ? 'hover:bg-slate-800 text-slate-400' 
                : 'hover:bg-slate-100 text-slate-500'
          }`}
          title={isSaved ? "Saved in Bookmarks" : "Save post"}
          aria-label="Save post"
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* 4. Post Caption */}
      <div className="px-4 sm:px-5 pb-3">
        <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          <span className="font-bold mr-2 text-emerald-400">
            {post.author?.name || 'Local Resident'}:
          </span>
          {post.caption || post.description}
        </p>
      </div>

      {/* 5. Notification Reach Badge */}
      <div className="px-4 sm:px-5 pb-3.5">
        <div className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
          darkMode ? 'bg-slate-800/50 border-slate-700/80 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Notified:</strong> ~{post.notifiedCommunityCount || 0} community members nearby
            </span>
          </div>
          <span className="font-bold text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {post.notificationRadiusKm >= 1 ? `${post.notificationRadiusKm} km radius` : `${(post.notificationRadiusKm || 1) * 1000} m radius`}
          </span>
        </div>
      </div>

      {/* 6. Contact Your Local Authority */}
      {hasAuthorityDetails && (
        <div className="px-4 sm:px-5 pb-4">
          <div className={`rounded-2xl border overflow-hidden ${
            darkMode ? 'bg-slate-800/30 border-slate-700/70' : 'bg-slate-50 border-slate-200'
          }`}>
            <button 
              onClick={() => setShowAuthority(!showAuthority)}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-bold transition-colors hover:bg-emerald-500/5"
            >
              <div className="flex items-center space-x-2 text-emerald-400">
                <Phone className="w-4 h-4" />
                <span>Contact Your Local Authority</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  Community-Added Contact
                </span>
              </div>
              {showAuthority ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showAuthority && (
              <div className="p-3.5 pt-0 space-y-3 text-xs border-t border-slate-700/50">
                <div className="pt-2">
                  <span className="text-slate-400 text-[11px] block">Authority / Department:</span>
                  <span className="font-bold text-sm text-white">
                    {post.authorityContact?.name || 'Local Municipal Department'}
                  </span>
                </div>

                {/* Authority Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  
                  {/* Call Authority */}
                  {cleanPhone ? (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 active:scale-95 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Authority ({cleanPhone})</span>
                    </a>
                  ) : null}

                  {/* Email Authority */}
                  {emailDraft && emailDraft.mailtoLink ? (
                    <a
                      href={emailDraft.mailtoLink}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 active:scale-95 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Authority</span>
                    </a>
                  ) : null}

                  {/* Visit Website */}
                  {cleanWeb ? (
                    <a
                      href={cleanWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 active:scale-95 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  ) : null}
                </div>

                {/* Important Disclaimer */}
                <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-700/50 leading-relaxed">
                  CleanCity AI does not contact authorities automatically. Clicking Call, Email, or Website opens your own app so you can reach out directly.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Community Updates Section */}
      {(showAddInfo || (post.additionalInfo && post.additionalInfo.length > 0)) && (
        <div className={`px-4 sm:px-5 py-3 border-t ${
          darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
              <FileText className="w-4 h-4" />
              <span>Community Updates ({(post.additionalInfo || []).length})</span>
            </div>
            <button
              onClick={() => setShowAddInfo(!showAddInfo)}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              {showAddInfo ? 'Cancel' : '+ Add an Update'}
            </button>
          </div>

          {/* Existing Updates */}
          {post.additionalInfo && post.additionalInfo.length > 0 ? (
            <div className="space-y-2 mb-3">
              {post.additionalInfo.map((info) => (
                <div 
                  key={info.id} 
                  className={`p-2.5 rounded-xl border text-xs ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">{info.author}</span>
                    <span>{info.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{info.text}</p>
                </div>
              ))}
            </div>
          ) : !showAddInfo ? (
            <p className="text-xs text-slate-500 italic">No community updates yet. Share an update if you have more details.</p>
          ) : null}

          {/* Add Info Form */}
          {showAddInfo && (
            <form onSubmit={handleInfoSubmit} className="space-y-2 pt-2 border-t border-slate-800">
              <input 
                type="text"
                value={infoAuthor}
                onChange={(e) => setInfoAuthor(e.target.value)}
                placeholder="Your Name (e.g. Ward Resident)"
                className={`w-full px-3 py-1.5 rounded-xl text-xs border ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <textarea 
                value={infoText}
                onChange={(e) => setInfoText(e.target.value)}
                rows={2}
                placeholder="Share an update, e.g. 'Road crew arrived at 2 PM', 'Water level rose after rain'..."
                className={`w-full px-3 py-1.5 rounded-xl text-xs border ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-400 active:scale-95 transition-all"
              >
                Post Update
              </button>
            </form>
          )}
        </div>
      )}

      {/* 8. Comments Section */}
      {showComments && (
        <div className={`px-4 sm:px-5 py-4 border-t ${
          darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Comments ({(post.comments || []).length})
          </h4>

          {/* Comments List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto mb-3.5 pr-1">
            {(!post.comments || post.comments.length === 0) ? (
              <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
            ) : (
              post.comments.map((comment) => (
                <div 
                  key={comment.id}
                  className={`p-2.5 rounded-2xl border text-xs flex items-start justify-between gap-2 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <img 
                      src={comment.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`}
                      alt={comment.author}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-300">{comment.author}</span>
                        <span className="text-[10px] text-slate-500">• {comment.timestamp}</span>
                      </div>
                      <p className={`mt-0.5 leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {comment.text}
                      </p>
                    </div>
                  </div>

                  {comment.isOwn && (
                    <button
                      onClick={() => onDeleteComment(post.id, comment.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Your name"
              className={`sm:w-36 px-3 py-2 rounded-xl text-xs border ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <div className="flex-1 flex gap-2">
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className={`flex-1 px-3 py-2 rounded-xl text-xs border ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all shrink-0 flex items-center space-x-1"
              >
                <span>Comment</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      )}

    </article>
  );
}
