import React, { useState } from 'react';
import { PersonalLifeState, SocialPost } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { ThumbsUp, MessageSquare, Share2, Users, Heart, Sparkles, Send, MapPin, MoreHorizontal } from 'lucide-react';

interface FacebookAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
}

export const FacebookApp: React.FC<FacebookAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'family' | 'groups'>('feed');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isReplying, setIsReplying] = useState<Record<string, boolean>>({});

  const candidateName = personalLife.candidateName || 'Candidate';
  const facebookPosts = personalLife.socialPosts.filter(
    p => p.platform === 'facebook' || p.authorId.includes('mom') || p.authorId.includes('family')
  );

  const handleToggleLike = (postId: string) => {
    onUpdatePersonalLife(prev => ({
      ...prev,
      socialPosts: prev.socialPosts.map(p => {
        if (p.id === postId) {
          const liked = !p.isLikedByPlayer;
          return {
            ...p,
            isLikedByPlayer: liked,
            likesCount: p.likesCount + (liked ? 1 : -1),
          };
        }
        return p;
      }),
    }));
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const post = personalLife.socialPosts.find(p => p.id === postId);
    if (!post) return;

    const userComment = {
      id: `fb-c-${Date.now()}`,
      authorId: 'player',
      authorName: candidateName,
      authorAvatar: '👨‍💼',
      text: text.trim(),
      timestamp: 'Just now',
    };

    onUpdatePersonalLife(prev => ({
      ...prev,
      socialPosts: prev.socialPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, userComment],
          };
        }
        return p;
      }),
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setIsReplying(prev => ({ ...prev, [postId]: true }));

    // Generate dynamic comment response using universal AI engine!
    if (post.authorId !== 'player') {
      try {
        const contact: any = personalLife.contacts.find(c => c.id === post.authorId) || {
          id: post.authorId,
          name: post.authorName,
          relationshipType: 'Family Relatives',
          occupation: 'Homemaker',
          mood: 'warm',
          bio: 'Family circle member',
          trust: 90,
          closeness: 90,
          respect: 90,
          avatar: '👤',
        };

        const chatRes = await sendChatMessage({
          channel: { id: post.id, name: `Facebook Comment reply from ${post.authorName}`, type: 'channel', topic: post.caption },
          activeCharacters: [{
            id: contact.id,
            name: contact.name,
            role: contact.relationshipType,
            department: contact.occupation,
            personality: contact.mood,
            communicationStyle: contact.bio,
            trust: contact.trust,
            respect: contact.respect,
            rapport: contact.closeness,
          }],
          conversationHistory: [],
          playerMessage: `Replying to your Facebook post "${post.caption}". My comment is: "${text}"`,
          player: { name: candidateName },
          reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
          memories: [],
          currentTime: { day: 1, hour: 12, minute: 0 },
          difficulty: 'Normal',
        });

        const replyText = chatRes.replies[0]?.text || `Thank you so much! 😊`;

        setTimeout(() => {
          onUpdatePersonalLife(prev => ({
            ...prev,
            socialPosts: prev.socialPosts.map(p => {
              if (p.id === postId) {
                return {
                  ...p,
                  comments: [
                    ...p.comments,
                    {
                      id: `fb-c-reply-${Date.now()}`,
                      authorId: contact.id,
                      authorName: contact.name,
                      authorAvatar: contact.avatar || '👤',
                      text: replyText,
                      timestamp: 'Just now',
                    },
                  ],
                };
              }
              return p;
            }),
          }));
          setIsReplying(prev => ({ ...prev, [postId]: false }));
        }, 1200);
      } catch (err) {
        console.warn('Facebook AI comment reply error:', err);
        setIsReplying(prev => ({ ...prev, [postId]: false }));
      }
    } else {
      setIsReplying(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Facebook Header */}
      <div className="p-3 bg-blue-900 border-b border-blue-800 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-white text-base">
            f
          </div>
          <h2 className="font-extrabold text-base text-white tracking-tight">Facebook</h2>
        </div>
        <div className="flex bg-blue-950 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${activeTab === 'feed' ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${activeTab === 'family' ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
          >
            Family ❤️
          </button>
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-slate-950/40">
        {/* Family Wishes Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800/60 shadow">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Family & Relatives Network</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Aai (Mom) posted: "Made special Ukadiche Modak today for Ganesh Chaturthi preparations!"
          </p>
        </div>

        {/* Facebook Posts */}
        {facebookPosts.map(post => (
          <div key={post.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold border border-slate-700">
                  {post.authorAvatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{post.authorName}</h4>
                  <p className="text-[10px] text-slate-400">{post.timestamp} • Pune, India</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">{post.caption}</p>

            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-800">
                <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <button 
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center gap-1.5 hover:text-blue-400 font-bold transition transform active:scale-110 ${post.isLikedByPlayer ? 'text-blue-500' : ''}`}
              >
                <ThumbsUp className={`w-4 h-4 ${post.isLikedByPlayer ? 'fill-blue-500 text-blue-500' : ''}`} />
                <span>{post.likesCount} Likes</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-white">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments.length} Comments</span>
              </button>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {post.comments.map(c => (
                  <div key={c.id} className="text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
                    <span className="font-bold text-slate-200 mr-1.5">{c.authorName}</span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            )}

            {isReplying[post.id] && (
              <div className="text-[10px] text-slate-400 italic flex items-center gap-1 animate-pulse">
                <span>typing reply...</span>
              </div>
            )}

            {/* Comment Input Bar */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                disabled={!commentInputs[post.id]?.trim()}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 disabled:opacity-40"
              >
                Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
