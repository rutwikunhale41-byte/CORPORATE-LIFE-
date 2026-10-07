import React, { useState } from 'react';
import { SocialPost, SocialStory, PersonalLifeState } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  PlusSquare, 
  Compass, 
  User, 
  Sparkles, 
  X, 
  MapPin, 
  MoreHorizontal, 
  Image as ImageIcon 
} from 'lucide-react';

interface InstagramAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
}

export const InstagramApp: React.FC<InstagramAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'dms' | 'profile'>('feed');
  const [activeStory, setActiveStory] = useState<SocialStory | null>(null);
  const [storyReplyText, setStoryReplyText] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [selectedDmContact, setSelectedDmContact] = useState<string>('contact-neha');
  const [dmInputText, setDmInputText] = useState<string>('');

  const candidateName = personalLife.candidateName || 'Candidate';

  const [dmThreads, setDmThreads] = useState<Record<string, Array<{ id: string; senderName: string; text: string; timestamp: string; isPlayer: boolean }>>>({
    'contact-neha': [
      { id: 'dm-1', senderName: 'Neha Joshi', text: 'Hey! Saw your Pune photo post, super cool lighting! ✨', timestamp: '08:40 AM', isPlayer: false },
      { id: 'dm-2', senderName: candidateName, text: 'Thanks Neha! It was taken near Koregaon Park cafe.', timestamp: '08:42 AM', isPlayer: true },
    ],
    'contact-rohan': [
      { id: 'dm-3', senderName: 'Rohan Deshmukh', text: 'Yo bro, check out this Sinhagad night trek reel 🔥', timestamp: 'Yesterday', isPlayer: false },
    ],
    'contact-rahul': [
      { id: 'dm-4', senderName: 'Rahul Sharma', text: 'Bro Bangalore startup weather is crazy today 🌧️', timestamp: '2 days ago', isPlayer: false },
    ],
  });

  const handleSelectDmContact = (contactId: string) => {
    setSelectedDmContact(contactId);
    onUpdatePersonalLife(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.app === 'instagram' ? { ...n, isRead: true } : n
      ),
    }));
  };

  const handleSendDm = async () => {
    if (!dmInputText.trim() || !selectedDmContact) return;

    const contact = personalLife.contacts.find(c => c.id === selectedDmContact);
    const contactName = contact ? contact.name : 'Friend';
    const typedText = dmInputText.trim();

    const userMsg = {
      id: `dm-${Date.now()}`,
      senderName: candidateName,
      text: typedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPlayer: true,
    };

    setDmThreads(prev => ({
      ...prev,
      [selectedDmContact]: [...(prev[selectedDmContact] || []), userMsg],
    }));

    setDmInputText('');

    try {
      const chatRes = await sendChatMessage({
        channel: { id: selectedDmContact, name: contactName, type: 'direct', topic: contact?.bio || 'Instagram Chat' },
        activeCharacters: [{
          id: selectedDmContact,
          name: contactName,
          role: contact?.relationshipType || 'Friend',
          department: contact?.occupation || 'Associate',
          personality: contact?.mood || 'friendly',
          communicationStyle: contact?.bio || 'social media user',
          trust: contact?.trust || 80,
          respect: contact?.respect || 80,
          rapport: contact?.closeness || 80,
        }],
        conversationHistory: [...(dmThreads[selectedDmContact] || []).map(m => ({
          id: m.id,
          senderName: m.senderName,
          text: m.text,
          timestamp: m.timestamp,
          isPlayer: m.isPlayer,
        })), userMsg],
        playerMessage: typedText,
        player: { name: candidateName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 12, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `Got it! 🙌`;

      const replyMsg = {
        id: `dm-${Date.now() + 1}`,
        senderName: contactName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPlayer: false,
      };

      setDmThreads(prev => ({
        ...prev,
        [selectedDmContact]: [...(prev[selectedDmContact] || []), replyMsg],
      }));
    } catch (e) {
      console.warn('Instagram DM AI error:', e);
    }
  };

  const handleToggleLike = (postId: string) => {
    onUpdatePersonalLife(prev => ({
      ...prev,
      socialPosts: prev.socialPosts.map(p => {
        if (p.id === postId) {
          const newLiked = !p.isLikedByPlayer;
          return {
            ...p,
            isLikedByPlayer: newLiked,
            likesCount: p.likesCount + (newLiked ? 1 : -1),
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
      id: `c-${Date.now()}`,
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
            comments: [
              ...p.comments,
              userComment,
            ],
          };
        }
        return p;
      }),
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    // Generate dynamic comment response from post author using AI!
    if (post.authorId !== 'player') {
      try {
        const contact = personalLife.contacts.find(c => c.id === post.authorId) || {
          id: post.authorId,
          name: post.authorName,
          relationshipType: 'Friend',
          occupation: 'Associate',
          mood: 'happy',
          bio: 'Social media user',
          trust: 70,
          closeness: 70,
          respect: 70,
        };

        const chatRes = await sendChatMessage({
          channel: { id: post.id, name: `Comment on ${post.authorName}'s post`, type: 'channel', topic: post.caption },
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
          playerMessage: `Replying to your Instagram post "${post.caption}". My comment is: "${text}"`,
          player: { name: candidateName },
          reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
          memories: [],
          currentTime: { day: 1, hour: 12, minute: 0 },
          difficulty: 'Normal',
        });

        const replyText = chatRes.replies[0]?.text || `Thanks! 🙌`;

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
                      id: `c-reply-${Date.now()}`,
                      authorId: contact.id,
                      authorName: contact.name,
                      authorAvatar: '👤',
                      text: replyText,
                      timestamp: 'Just now',
                    },
                  ],
                };
              }
              return p;
            }),
          }));
        }, 1200);
      } catch (e) {
        console.warn('Comment reply AI error:', e);
      }
    }
  };

  const handleCreatePost = () => {
    if (!newCaption.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      platform: 'instagram',
      authorId: 'player',
      authorName: candidateName,
      authorAvatar: '👨‍💻',
      caption: newCaption,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      timestamp: 'Just now',
      likesCount: 1,
      isLikedByPlayer: true,
      comments: [],
      locationTag: 'Pune, Maharashtra',
    };

    onUpdatePersonalLife(prev => ({
      ...prev,
      socialPosts: [newPost, ...prev.socialPosts],
    }));

    setNewCaption('');
    setShowUploadModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden relative">
      {/* Instagram Header */}
      <div className="p-3 bg-black border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 bg-clip-text text-transparent italic">
          Instagram
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <button onClick={() => setShowUploadModal(true)} className="p-1 hover:text-white" title="New Post">
            <PlusSquare className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('feed')} className={`p-1 ${activeTab === 'feed' ? 'text-white' : 'hover:text-white'}`} title="Activity">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('dms')} className={`p-1 relative ${activeTab === 'dms' ? 'text-rose-500' : 'hover:text-white'}`} title="Direct Messages">
            <Send className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 right-0 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Container Viewport */}
      {activeTab === 'dms' ? (
        /* INSTAGRAM DIRECT MESSAGES (DMs) TAB */
        <div className="flex-1 flex flex-col bg-zinc-950 text-white font-sans text-xs overflow-hidden">
          {/* DM Contact Selector Bar */}
          <div className="p-2 bg-zinc-900 border-b border-zinc-800 flex gap-2 overflow-x-auto shrink-0">
            {personalLife.contacts.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedDmContact(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shrink-0 text-xs ${
                  c.id === selectedDmContact
                    ? 'bg-gradient-to-r from-rose-600 to-purple-600 border-rose-500 text-white font-bold shadow'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                <span className="text-sm">{c.avatar}</span>
                <span>{c.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* DM Chat Thread */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-black">
            <div className="text-[10px] text-zinc-500 text-center font-medium my-1">
              Instagram End-to-End Encrypted Direct Messages
            </div>

            {(dmThreads[selectedDmContact] || []).map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isPlayer ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                    m.isPlayer
                      ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-tr-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div className="text-[8px] opacity-60 text-right mt-1">{m.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {/* DM Message Input Bar */}
          <div className="p-2 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={dmInputText}
              onChange={e => setDmInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendDm()}
              placeholder="Message..."
              className="flex-1 bg-black border border-zinc-800 rounded-full px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={handleSendDm}
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* MAIN INSTAGRAM FEED */
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
        {/* Stories Tray */}
        <div className="p-3 border-b border-zinc-900 bg-zinc-950 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0">
          {/* Player Story */}
          <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
            <div className="w-13 h-13 rounded-full p-0.5 bg-zinc-800 flex items-center justify-center relative">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center font-bold text-white text-xs border border-zinc-800">
                You
              </div>
              <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold absolute bottom-0 right-0 border border-black">
                +
              </div>
            </div>
            <span className="text-[10px] text-zinc-400">Your Story</span>
          </div>

          {/* Contact Stories */}
          {personalLife.socialStories.map(story => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            >
              <div className={`w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr ${story.isViewed ? 'from-zinc-700 to-zinc-800' : 'from-amber-500 via-rose-500 to-purple-600'} flex items-center justify-center`}>
                <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center font-bold text-base border border-black">
                  {story.authorAvatar}
                </div>
              </div>
              <span className="text-[10px] text-zinc-300 truncate max-w-[56px] text-center">
                {story.authorName.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Social Posts Stream */}
        <div className="p-0">
          {personalLife.socialPosts.map(post => (
            <div key={post.id} className="border-b border-zinc-900 pb-4">
              {/* Post Author Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-sm font-bold">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                      <span>{post.authorName}</span>
                    </h4>
                    {post.locationTag && (
                      <p className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{post.locationTag}</span>
                      </p>
                    )}
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-zinc-500 cursor-pointer" />
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="w-full aspect-square bg-zinc-900 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-zinc-300">
                  <button onClick={() => handleToggleLike(post.id)} className="transition transform active:scale-125">
                    <Heart className={`w-5 h-5 ${post.isLikedByPlayer ? 'text-rose-500 fill-rose-500' : 'hover:text-white'}`} />
                  </button>
                  <button className="hover:text-white">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="hover:text-white">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <button className="hover:text-white text-zinc-300">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Likes Count & Caption */}
              <div className="px-3 space-y-1">
                <div className="text-xs font-bold text-zinc-200">
                  {post.likesCount} likes
                </div>
                <div className="text-xs text-zinc-300 leading-normal">
                  <span className="font-bold text-white mr-1.5">{post.authorName}</span>
                  <span>{post.caption}</span>
                </div>

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {post.comments.map(c => (
                      <div key={c.id} className="text-[11px] text-zinc-400">
                        <span className="font-bold text-zinc-300 mr-1.5">{c.authorName}</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-zinc-500 uppercase tracking-wide pt-1">
                  {post.timestamp}
                </div>

                {/* Comment Input */}
                <div className="pt-2 flex items-center gap-2 border-t border-zinc-900 mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-zinc-500"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    className="text-xs font-bold text-blue-500 hover:text-blue-400 disabled:opacity-40"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Fullscreen Story Viewer Modal */}
      {activeStory && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col justify-between p-3 animate-fade-in">
          {/* Top Story Header */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center font-bold">
                {activeStory.authorAvatar}
              </div>
              <div>
                <div className="text-xs font-bold">{activeStory.authorName}</div>
                <div className="text-[10px] text-zinc-400">{activeStory.timestamp}</div>
              </div>
            </div>
            <button onClick={() => setActiveStory(null)} className="p-1 hover:bg-zinc-800 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Story Image */}
          <div className="absolute inset-0 my-12 flex items-center justify-center bg-zinc-950 overflow-hidden">
            <img
              src={activeStory.imageUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
            {activeStory.caption && (
              <div className="absolute bottom-6 inset-x-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-xs text-white font-medium text-center">
                {activeStory.caption}
              </div>
            )}
          </div>

          {/* Story Reply Bar */}
          <div className="z-10 flex items-center gap-2 bg-black/80 p-2 rounded-full border border-zinc-800">
            <input
              type="text"
              placeholder={`Send message to ${activeStory.authorName}...`}
              value={storyReplyText}
              onChange={e => setStoryReplyText(e.target.value)}
              className="flex-1 bg-transparent px-3 text-xs text-white focus:outline-none placeholder-zinc-500"
            />
            <button
              onClick={() => {
                setActiveStory(null);
                setStoryReplyText('');
              }}
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Post Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>New Instagram Post</span>
            </h3>
            <button onClick={() => setShowUploadModal(false)} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 my-auto">
            <div className="aspect-video rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
              <ImageIcon className="w-8 h-8 mb-2 text-zinc-400" />
              <p className="text-xs font-medium text-zinc-300">Monsoon Coffee & Office Life Photo Selected</p>
              <p className="text-[10px] text-zinc-500 mt-1">Pune, Maharashtra</p>
            </div>

            <textarea
              placeholder="Write a caption..."
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              rows={3}
              className="w-full p-3 bg-zinc-900 text-xs text-white rounded-xl border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newCaption.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg"
          >
            Share Post
          </button>
        </div>
      )}
    </div>
  );
};
