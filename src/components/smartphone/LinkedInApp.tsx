import React, { useState } from 'react';
import { PersonalLifeState, LinkedInJobPost, LinkedInRecruiter } from '../../types/smartphone';
import { sendChatMessage } from '../../services/api';
import { 
  Briefcase, 
  Search, 
  MessageSquare, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Plus, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Award, 
  FileText,
  Calendar,
  ExternalLink,
  ThumbsUp,
  Share2
} from 'lucide-react';

interface LinkedInAppProps {
  personalLife: PersonalLifeState;
  onUpdatePersonalLife: (updater: (prev: PersonalLifeState) => PersonalLifeState) => void;
  onOpenGoogleMeet?: (meetingCode: string) => void;
}

export const LinkedInApp: React.FC<LinkedInAppProps> = ({
  personalLife,
  onUpdatePersonalLife,
  onOpenGoogleMeet,
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'messages' | 'network' | 'profile' | 'feed'>('jobs');
  const [selectedJob, setSelectedJob] = useState<LinkedInJobPost | null>(null);
  const [activeRecruiterId, setActiveRecruiterId] = useState<string>('recruiter-vikram');
  const [messageInput, setMessageInput] = useState<string>('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [showAddSkill, setShowAddSkill] = useState<boolean>(false);

  const recruiters = personalLife.linkedInRecruiters || [];
  const jobs = personalLife.linkedInJobs || [];
  const chats = personalLife.linkedInChats || {};

  const activeRecruiter = recruiters.find(r => r.id === activeRecruiterId) || recruiters[0];
  const activeMessages = chats[activeRecruiterId] || [];

  const handleApplyToJob = (job: LinkedInJobPost) => {
    if (appliedJobIds.includes(job.id)) return;

    setAppliedJobIds(prev => [...prev, job.id]);

    // Add notification and schedule Google Meet interview
    const meetId = `meet-${Date.now()}`;
    const newMeet = {
      id: meetId,
      jobId: job.id,
      companyName: job.company,
      roleTitle: job.role,
      roundName: 'Technical Round 1' as const,
      interviewerName: activeRecruiter ? activeRecruiter.name : 'Technical Hiring Lead',
      interviewerTitle: activeRecruiter ? activeRecruiter.title : 'Engineering Manager',
      interviewerAvatar: '👨‍💻',
      interviewerPersonality: 'Technical' as const,
      scheduledDay: 1,
      scheduledTime: '11:00 AM',
      status: 'SCHEDULED' as const,
      meetingCode: `meet-${job.id.slice(0, 8)}`,
    };

    onUpdatePersonalLife(prev => {
      const existingMeets = prev.googleMeetInterviews || [];
      const updatedNotifications = [
        {
          id: `notif-${Date.now()}`,
          app: 'work' as const,
          title: 'LinkedIn: Application Submitted!',
          message: `Your CV for ${job.role} at ${job.company} was selected! Google Meet interview scheduled.`,
          timestamp: 'Just now',
          isRead: false,
        },
        ...prev.notifications,
      ];

      return {
        ...prev,
        googleMeetInterviews: [...existingMeets, newMeet],
        notifications: updatedNotifications,
      };
    });
  };

  const playerName = personalLife.candidateName || 'Candidate';

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeRecruiter) return;

    const textToSend = messageInput.trim();
    setMessageInput('');

    const userMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'player',
      senderName: playerName,
      senderAvatar: '👨‍💼',
      text: textToSend,
      timestamp: 'Just now',
      isPlayer: true,
    };

    // Immediately update chat with player message
    onUpdatePersonalLife(prev => {
      const currentRecruiterChats = prev.linkedInChats || {};
      const existing = currentRecruiterChats[activeRecruiter.id] || [];
      return {
        ...prev,
        linkedInChats: {
          ...currentRecruiterChats,
          [activeRecruiter.id]: [...existing, userMsg],
        },
      };
    });

    try {
      const chatRes = await sendChatMessage({
        channel: { 
          id: activeRecruiter.id, 
          name: activeRecruiter.name, 
          type: 'direct', 
          topic: `Professional discussion about hiring for the role of ${activeRecruiter.title || 'Specialist'} at ${activeRecruiter.company}` 
        },
        activeCharacters: [{
          id: activeRecruiter.id,
          name: activeRecruiter.name,
          role: activeRecruiter.title,
          department: activeRecruiter.company,
          personality: activeRecruiter.personality || 'Professional',
          communicationStyle: activeRecruiter.specialty || 'Insightful',
          trust: 80,
          respect: 80,
          rapport: 80,
        }],
        conversationHistory: [...activeMessages, userMsg],
        playerMessage: textToSend,
        player: { name: playerName },
        reputation: { managerTrust: 80, teamTrust: 80, customerTrust: 80, hrReputation: 80 },
        memories: [],
        currentTime: { day: 1, hour: 10, minute: 0 },
        difficulty: 'Normal',
      });

      const replyText = chatRes.replies[0]?.text || `Thank you for details! Let's connect on a Google Meet. Open the 'Meet' app on your phone to join our call.`;

      const recruiterReply = {
        id: `reply-${Date.now() + 1}`,
        senderId: activeRecruiter.id,
        senderName: activeRecruiter.name,
        senderAvatar: activeRecruiter.avatar,
        text: replyText,
        timestamp: 'Just now',
        isPlayer: false,
      };

      onUpdatePersonalLife(prev => {
        const currentRecruiterChats = prev.linkedInChats || {};
        const existing = currentRecruiterChats[activeRecruiter.id] || [];
        return {
          ...prev,
          linkedInChats: {
            ...currentRecruiterChats,
            [activeRecruiter.id]: [...existing, recruiterReply],
          },
        };
      });
    } catch (err) {
      console.warn('LinkedIn Recruiter Chat AI error:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white font-sans text-xs">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-extrabold text-white text-xs">
            in
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-100">LinkedIn</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('jobs')}
            className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-bold border border-blue-500/30 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>ATS Auto-Match</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60">
        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 text-xs">
                <Search className="w-3.5 h-3.5" />
                <span>Search HR, Administration, MBA, Tech, Finance jobs...</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Top recommendations based on your Career CV</span>
                <span className="text-emerald-400 font-bold">90%+ Match Tier</span>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-2.5">
              {jobs.map(job => {
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <div 
                    key={job.id} 
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                          {job.logo}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 text-xs">{job.role}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{job.company}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                        {job.matchScore}% Match
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">{job.salaryRange}</span>
                      </div>
                      <p className="line-clamp-2 text-slate-400 text-[10px]">{job.description}</p>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skillsRequired.map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[9px] font-medium">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[9px] text-slate-500">{job.applicantsCount} applicants • Posted {job.postedDate}</span>
                      
                      <button
                        onClick={() => handleApplyToJob(job)}
                        disabled={isApplied}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          isApplied
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Applied (Interview Invited)</span>
                          </>
                        ) : (
                          <>
                            <span>1-Click Easy Apply</span>
                            <ChevronRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="h-full flex flex-col space-y-2">
            {/* Recruiter Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
              {recruiters.map(r => (
                <button
                  key={r.id}
                  onClick={() => setActiveRecruiterId(r.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 text-xs ${
                    r.id === activeRecruiterId
                      ? 'bg-blue-950 border-blue-600 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-sm">{r.avatar}</span>
                  <div className="text-left">
                    <div className="text-[10px] font-semibold truncate max-w-[80px]">{r.name}</div>
                    <div className="text-[8px] text-slate-400 truncate max-w-[80px]">{r.company}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Recruiter Header */}
            {activeRecruiter && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeRecruiter.avatar}</span>
                  <div>
                    <div className="font-bold text-slate-100 text-xs">{activeRecruiter.name}</div>
                    <div className="text-[10px] text-slate-400">{activeRecruiter.title} • {activeRecruiter.company}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-[9px] font-bold">
                  {activeRecruiter.personality} Recruiter
                </span>
              </div>
            )}

            {/* Chat History View */}
            <div className="flex-1 overflow-y-auto space-y-2 p-1 bg-slate-950 rounded-xl border border-slate-900 min-h-[220px]">
              {activeMessages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isPlayer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                      m.isPlayer
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="text-[9px] font-bold opacity-75 mb-0.5">{m.senderName}</div>
                    <p className="leading-relaxed">{m.text}</p>
                    <div className="text-[8px] text-right opacity-60 mt-1">{m.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Reply to ${activeRecruiter?.name || 'recruiter'}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* NETWORK TAB */}
        {activeTab === 'network' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-100 text-xs">Your Professional Connections</div>
                <div className="text-[10px] text-slate-400">540+ Tech Engineers & Hiring Leads</div>
              </div>
              <Users className="w-5 h-5 text-blue-400" />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400">Recruiter Connections & Headhunters</div>
              {recruiters.map(r => (
                <div key={r.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{r.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-200 text-xs">{r.name}</div>
                      <div className="text-[10px] text-slate-400">{r.title}</div>
                      <div className="text-[9px] text-emerald-400 font-medium">Specialty: {r.specialty}</div>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700">
                    Connected
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAREER PROFILE TAB */}
        {activeTab === 'profile' && (() => {
          const cp = personalLife.candidateProfile || {
            name: personalLife.candidateName || 'Candidate',
            education: 'Bachelor Degree / Professional',
            careerGoal: 'Professional Career',
            technicalSkills: ['Communication', 'Management', 'Problem Solving'],
            bioSummary: 'Ambitious professional seeking impactful career growth.',
            degree: 'B.E.',
            specialization: 'Engineering',
            college: 'COEP',
            experienceTier: 'Fresher',
            expectedSalary: 600000,
          };
          const initials = cp.name ? cp.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'CA';
          const skillsList = Array.isArray(cp.technicalSkills) ? cp.technicalSkills : ['Communication', 'Management'];

          return (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-900/80 rounded-2xl p-3.5 relative">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-800 shadow">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">{cp.name}</h3>
                    <p className="text-[11px] text-blue-300 font-medium">{cp.careerGoal || 'Professional Specialist'}</p>
                    <p className="text-[10px] text-slate-400">Pune / Remote • {cp.degree || cp.education} in {cp.specialization || 'Fields'}</p>
                    <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Experience Tier: {cp.experienceTier} • Expected: ₹{(cp.expectedSalary || 500000).toLocaleString()}/yr</p>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                  {cp.bioSummary}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CV Profile Verified
                  </span>
                  <span className="text-slate-400">95% ATS Search Index</span>
                </div>
              </div>

              {/* Education & Experience Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Education & Qualifications</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="border-l-2 border-blue-500 pl-2">
                    <div className="font-semibold text-slate-200">{cp.degree || 'Degree'} - {cp.specialization || 'Specialization'}</div>
                    <div className="text-[10px] text-slate-400">{cp.college || 'Pune University'} ({cp.graduationYear || 2024})</div>
                  </div>
                </div>
              </div>

              {/* Skills Stack */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 text-xs">Professional Skills Stack</div>
                  <button 
                    onClick={() => setShowAddSkill(!showAddSkill)}
                    className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-medium">
                      ⚡ {skill}
                    </span>
                  ))}
                  {Array.isArray(cp.softSkills) && cp.softSkills.map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-400 text-[10px] font-medium">
                      🤝 {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">👔</span>
                <div>
                  <div className="font-bold text-slate-200 text-xs">Vikram Sengupta • Nexora Global</div>
                  <div className="text-[9px] text-slate-400">Posted 3h ago</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                🚀 Big news! Nexora Global is expanding our Industrial Automation and SCADA team in Hinjawadi, Pune. Looking for engineers with strong Modbus TCP & telemetry architecture experience. Message me directly!
              </p>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <button className="flex items-center gap-1 hover:text-blue-400"><ThumbsUp className="w-3 h-3" /> 142 Likes</button>
                <button className="flex items-center gap-1 hover:text-blue-400"><MessageSquare className="w-3 h-3" /> 28 Comments</button>
                <button className="flex items-center gap-1 hover:text-blue-400"><Share2 className="w-3 h-3" /> Share</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom LinkedIn App Navigation */}
      <div className="bg-slate-950 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shrink-0 text-[10px]">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'jobs' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'messages' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Recruiters</span>
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'network' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <Users className="w-4 h-4" />
          <span>Network</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <Award className="w-4 h-4" />
          <span>My CV</span>
        </button>
      </div>
    </div>
  );
};
