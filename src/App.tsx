import React, { useState, useEffect } from 'react';
import { GameState } from './types/game';
import { createInitialGameState } from './data/initialState';
import { DEFAULT_CANDIDATE_PROFILE } from './data/jobMarketData';
import { createInitialPersonalLifeState } from './data/personalLifeData';
import { generateDynamicJobsAndRecruiters } from './data/dynamicJobGenerator';
import { initializeWorkplaceData } from './data/jobRoleInitializer';
import { resolveRoleProfile } from './data/jobRoleProfiles';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MessagesView } from './components/MessagesView';
import { EmailView } from './components/EmailView';
import { TasksView } from './components/TasksView';
import { IncidentView } from './components/IncidentView';
import { CalendarView } from './components/CalendarView';
import { TeamView } from './components/TeamView';
import { PerformanceView } from './components/PerformanceView';
import { CareerView } from './components/CareerView';
import { AchievementsView } from './components/AchievementsView';
import { SettingsView } from './components/SettingsView';
import { CorporateNewsView } from './components/CorporateNewsView';
import { RecruitmentHubView } from './components/recruitment/RecruitmentHubView';
import { OnboardingModal } from './components/OnboardingModal';
import { SmartphoneModal } from './components/smartphone/SmartphoneModal';
import { Smartphone } from 'lucide-react';
import { JobApplication, JobOffer } from './types/jobMarket';
import { checkServerStatus, fetchCorporateNews } from './services/api';

const LOCAL_STORAGE_KEY = 'corporate_life_ai_mnc_save_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.player && parsed.characters) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to restore save from localStorage:', e);
    }
    return createInitialGameState('Rutwik Unhale');
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeChannelId, setActiveChannelId] = useState<string>('direct-sneha');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSmartphoneOpen, setIsSmartphoneOpen] = useState<boolean>(false);

  // Compute total unread phone notifications
  const totalUnreadPhonePings = gameState.personalLife
    ? gameState.personalLife.notifications.filter(n => !n.isRead).length
    : 0;

  // Check server connectivity & Gemini API Key on load
  useEffect(() => {
    checkServerStatus().then(status => {
      setHasGeminiKey(Boolean(status?.hasGeminiKey));
    });
  }, []);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auto-save to localStorage on updates when game has started
  useEffect(() => {
    if (gameState.gameStarted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
      } catch (e) {
        console.error('Auto-save error:', e);
      }
    }
  }, [gameState]);

  // Time advancement logic
  const handleAdvanceTime = (minutes: number) => {
    setGameState(prev => {
      let newMin = prev.currentMinute + minutes;
      let newHour = prev.currentHour + Math.floor(newMin / 60);
      newMin = newMin % 60;
      let newDay = prev.currentDay;

      // Handle incident SLA decay if incident is active
      let updatedIncident = { ...prev.incident };
      if (updatedIncident.active) {
        const newSla = Math.max(0, updatedIncident.slaMinutesRemaining - minutes);
        updatedIncident.slaMinutesRemaining = newSla;
        if (newSla === 0 && updatedIncident.status === 'ACTIVE') {
          // Breach penalty
          updatedIncident.logs = [
            `[${newHour}:${newMin.toString().padStart(2, '0')}] CRITICAL: SLA BREACHED! Apex Global executives escalated to Elena Rostova. Contractual penalties invoked.`,
            ...updatedIncident.logs,
          ];
        }
      }

      // If passing midnight
      if (newHour >= 24) {
        newDay += Math.floor(newHour / 24);
        newHour = newHour % 24;
      }

      // Proactive Workplace Background Messages as time advances
      let updatedMessages = { ...prev.messages };
      let updatedChannels = [...prev.channels];

      const addProactiveMessage = (channelId: string, senderId: string, senderName: string, text: string, emotion = 'neutral', intent = 'update') => {
        const existingInChannel = updatedMessages[channelId] || [];
        // Prevent duplicate proactive message on same day/hour
        const alreadySent = existingInChannel.some(m => m.text === text);
        if (!alreadySent) {
          const newMsg = {
            id: `proactive-${Date.now()}-${Math.random()}`,
            channelId,
            senderId,
            senderName,
            text,
            timestamp: `${newHour.toString().padStart(2, '0')}:${newMin.toString().padStart(2, '0')}`,
            emotion: emotion as any,
            intent: intent as any,
          };
          updatedMessages[channelId] = [...existingInChannel, newMsg];
          updatedChannels = updatedChannels.map(c =>
            c.id === channelId ? { ...c, unreadCount: c.unreadCount + 1 } : c
          );
        }
      };

      // 1. Daily Standup trigger at 09:15
      if (newHour === 9 && newMin >= 15 && newMin <= 30) {
        addProactiveMessage(
          'channel-standup',
          'sneha-rao',
          'Sneha Rao',
          'Daily Standup is starting now on the Teams bridge! Join in everyone to align on blockers.',
          'supportive',
          'request'
        );
      }

      // 2. Lunch Break invite around 13:00
      if (newHour >= 13 && newHour < 14) {
        addProactiveMessage(
          'direct-ananya',
          'ananya-iyer',
          'Ananya Iyer',
          'Hey! Heading down to the 4th floor cafeteria with Aisha and Karan. Grabbing lunch soon? 😂',
          'happy',
          'question'
        );
      }

      // 3. Client Escalation warning at 14:30
      if (newHour === 14 && newMin >= 30 && newMin <= 45) {
        addProactiveMessage(
          'direct-vikramaditya',
          'vikramaditya-singhania',
          'Vikramaditya Singhania',
          'Apex Global Reliability Review bridge is open on Webex. We need clarity on the telemetry latency drops.',
          'demanding',
          'question'
        );
      }

      // 4. Manager 1:1 check at 16:30
      if (newHour === 16 && newMin >= 30 && newMin <= 45) {
        addProactiveMessage(
          'direct-sneha',
          'sneha-rao',
          'Sneha Rao',
          'Ready for our weekly 1:1 manager sync. Let’s review your probation milestones and workload.',
          'supportive',
          'request'
        );
      }

      // 5. Sprint deadline check at 17:00 if tasks are in progress
      if (newHour >= 17 && prev.tasks.some(t => t.status === 'IN_PROGRESS')) {
        addProactiveMessage(
          'direct-sneha',
          'sneha-rao',
          'Sneha Rao',
          'Rutwik, it’s 5 PM. How are we looking on today’s sprint commit? Please share an update before EOD.',
          'concerned',
          'question'
        );
      }

      return {
        ...prev,
        currentDay: newDay,
        currentHour: newHour,
        currentMinute: newMin,
        incident: updatedIncident,
        messages: updatedMessages,
        channels: updatedChannels,
      };
    });
  };

  // End Day & start next morning
  const handleEndDay = () => {
    setGameState(prev => {
      const nextDay = prev.currentDay + 1;
      const probationLeft = Math.max(0, prev.player.probationDaysLeft - 1);

      // Add a dynamic morning email on new days
      const newEmail = {
        id: `email-day-${nextDay}`,
        fromId: 'sneha-rao',
        fromName: 'Sneha Rao',
        fromEmail: 'sneha.rao@nexoraglobal.com',
        toEmail: prev.player.email,
        subject: `Day ${nextDay} Priorities & Daily Standup Check-in`,
        body: `Hi ${prev.player.name.split(' ')[0]},\n\nGood morning. As we enter Day ${nextDay}, please ensure all your tickets on Jira are updated with latest status before the 09:15 AM standup.\n\nKeep up the pace.\n\nSneha`,
        timestamp: `Day ${nextDay}, 08:50 AM`,
        isRead: false,
        isFlagged: false,
        thread: [],
        requiresReply: true,
        replied: false,
      };

      const updatedState = {
        ...prev,
        currentDay: nextDay,
        currentHour: 9,
        currentMinute: 0,
        player: {
          ...prev.player,
          probationDaysLeft: probationLeft,
          probationPassed: probationLeft === 0,
        },
        emails: [newEmail, ...prev.emails],
      };

      // Asynchronously fetch fresh industry news for the new workday
      fetchCorporateNews({ currentDay: nextDay, playerTitle: prev.player.title })
        .then(res => {
          if (res.news && Array.isArray(res.news)) {
            setGameState(s => ({ ...s, newsItems: res.news }));
          }
        })
        .catch(err => console.warn('Could not auto-refresh news on day end:', err));

      return updatedState;
    });
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  const handleResetGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const freshState = createInitialGameState('Alex Morgan');
    freshState.gameStarted = false;
    freshState.isHired = false;
    setGameState(freshState);
    setCurrentTab('dashboard');
    setActiveChannelId('direct-priya');
    setIsSmartphoneOpen(false);
  };

  const handleStartCareer = (
    name: string, 
    currency: string, 
    isCandidateMode: boolean,
    educationDegree = 'MBA Human Resources',
    skillsString = 'Recruitment, HRIS, Talent Sourcing, Employee Relations, Office Admin',
    experienceTier = '1–3 Years',
    primaryCareerGoal = 'Human Resources & Talent Acquisition'
  ) => {
    const skillList = skillsString.split(',').map(s => s.trim()).filter(Boolean);

    // Generate tailored jobs, recruiters, and recruiter messages according to user's profile
    const { jobs: dynamicJobs, recruiters: dynamicRecruiters, chats: dynamicChats } = generateDynamicJobsAndRecruiters({
      name,
      currency,
      degree: educationDegree,
      skills: skillsString,
      experienceTier: experienceTier as any,
      primaryCareerGoal,
      careerGoal: primaryCareerGoal,
    });

    setGameState(prev => {
      const currentCand = prev.candidateProfile || DEFAULT_CANDIDATE_PROFILE;
      const updatedCand = {
        ...currentCand,
        name,
        education: educationDegree,
        degree: educationDegree,
        specialization: educationDegree,
        technicalSkills: skillList.length > 0 ? skillList : currentCand.technicalSkills,
        experienceTier: experienceTier as any,
        careerGoal: primaryCareerGoal,
        bioSummary: `${name} is an ambitious professional qualified in ${educationDegree} specializing in ${primaryCareerGoal} with skills in ${skillList.join(', ')}.`,
      };

      // Wipe out older remnants by generating a completely new initial personalLifeState
      const freshPersonalLife = createInitialPersonalLifeState(name);
      const updatedPersonalLife = {
        ...freshPersonalLife,
        candidateName: name,
        candidateProfile: updatedCand,
        linkedInJobs: dynamicJobs,
        linkedInRecruiters: dynamicRecruiters,
        linkedInChats: dynamicChats,
      };

      if (!isCandidateMode) {
        const topJob = dynamicJobs[0] || {
          role: primaryCareerGoal || 'Candidate Specialist',
          company: 'Nexora Global',
          department: 'Corporate Division',
          currency,
          location: 'Pune / Mumbai (Hybrid)',
        };

        const salaryNum = currency === '₹' ? 550000 : 75000;

        const workplaceData = initializeWorkplaceData({
          title: topJob.role,
          company: topJob.company,
          department: topJob.department,
          baseSalary: salaryNum,
          currency,
          location: topJob.location || 'Pune / Hybrid',
          probationMonths: 3,
        }, name);

        const conformingChannels = workplaceData.channels.map(c => ({
          ...c,
          type: c.type as any,
          conversationStatus: (c.conversationStatus === 'resolved' ? 'idle' : c.conversationStatus) as any
        }));

        const conformingTasks = workplaceData.tasks.map(t => ({
          ...t,
          status: (t.status === 'COMPLETED' ? 'DONE' : t.status) as any
        }));

        setActiveChannelId(conformingChannels[0]?.id || 'direct-priya');

        return {
          ...prev,
          player: {
            ...prev.player,
            name,
            currency,
            company: topJob.company,
            title: topJob.role,
            department: topJob.department,
            managerId: workplaceData.managerId,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@${topJob.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            salary: salaryNum,
            probationDaysLeft: 90,
            probationPassed: false,
            xp: 0,
            level: 1,
            performanceScore: 75,
            productivity: 78,
            quality: 82,
            communication: 74,
            technicalSkills: 76,
            leadership: 55,
            reliability: 80,
            teamwork: 78,
            achievements: [
              {
                id: 'ach-onboarding',
                title: 'Badge of Entry',
                description: `Completed corporate onboarding at ${topJob.company} as ${topJob.role}.`,
                icon: 'Building2',
                unlockedAt: 'Day 1',
              },
            ],
          },
          emails: workplaceData.emails,
          channels: conformingChannels,
          messages: workplaceData.messages,
          tasks: conformingTasks,
          candidateProfile: updatedCand,
          personalLife: updatedPersonalLife,
          applications: [],
          offers: [],
          reviews: [],
          memories: [],
          evaluations: [],
          isHired: true,
          gameStarted: true,
          careerStage: 'PROBATION',
          currentDay: 1,
          currentHour: 9,
          currentMinute: 0,
        };
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          name,
          currency,
          title: dynamicJobs[0] ? dynamicJobs[0].role : 'Candidate Specialist',
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
          xp: 0,
          level: 1,
          performanceScore: 75,
          productivity: 78,
          quality: 82,
          communication: 74,
          technicalSkills: 76,
          leadership: 55,
          reliability: 80,
          teamwork: 78,
          achievements: [
            {
              id: 'ach-onboarding',
              title: 'Badge of Entry',
              description: 'Completed onboarding profile setup.',
              icon: 'Building2',
              unlockedAt: 'Day 1',
            },
          ],
        },
        candidateProfile: updatedCand,
        personalLife: updatedPersonalLife,
        applications: [], // Reset previous applications
        offers: [], // Reset previous offers
        reviews: [], // Reset previous performance reviews
        memories: [], // Reset previous memory logs
        evaluations: [], // Reset previous evaluations
        isHired: false,
        gameStarted: true,
      };
    });
  };

  // Player joins an MNC after passing interviews and accepting an offer!
  const handleAcceptOfferAndJoin = (application: JobApplication, offer: JobOffer) => {
    const company = offer.company || 'Nexora Global';
    const playerClean = gameState.player.name.toLowerCase().replace(/\s+/g, '.');
    const companyClean = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const playerEmail = `${playerClean}@${companyClean}.com`;

    // Retrieve tailored managers, channels, emails, tasks, and welcome messages for this specific role
    const workplaceData = initializeWorkplaceData(offer, gameState.player.name);
    const { managerId, managerName, emails, tasks, messages } = workplaceData;
    const roleProfile = resolveRoleProfile(offer.title, offer.department);

    let teamName = roleProfile.department;
    const titleLower = (offer.title || '').toLowerCase();
    if (titleLower.includes('hr') || titleLower.includes('people') || titleLower.includes('talent')) {
      teamName = 'People Operations & Talent Acquisition';
    } else if (titleLower.includes('admin') || titleLower.includes('facility') || titleLower.includes('workplace')) {
      teamName = 'Corporate Services & Facilities';
    } else if (titleLower.includes('finance') || titleLower.includes('account') || titleLower.includes('treasury')) {
      teamName = 'Corporate Finance & Treasury';
    } else if (titleLower.includes('operation') || titleLower.includes('strategy') || titleLower.includes('analyst')) {
      teamName = 'Business Strategy & Operations';
    } else if (titleLower.includes('scada') || titleLower.includes('telemetry') || titleLower.includes('automation')) {
      teamName = 'SCADA & Industrial Automation Systems';
    } else if (titleLower.includes('software') || titleLower.includes('cloud') || titleLower.includes('engineer') || titleLower.includes('tech')) {
      teamName = 'Cloud Platform & Infrastructure';
    }

    // Conform channels to TypeScript Channel[] type exactly
    const conformingChannels = workplaceData.channels.map(c => ({
      ...c,
      type: c.type as any,
      conversationStatus: (c.conversationStatus === 'resolved' ? 'idle' : c.conversationStatus) as any
    }));

    // Conform tasks to TypeScript Task[] type exactly
    const conformingTasks = workplaceData.tasks.map(t => ({
      ...t,
      status: (t.status === 'COMPLETED' ? 'DONE' : t.status) as any
    }));

    // Determine the default active channel for the sidebar
    const firstChannelId = conformingChannels[0] ? conformingChannels[0].id : (managerId ? `direct-${managerId.split('-')[0]}` : 'direct-priya');
    setActiveChannelId(firstChannelId);

    setGameState(prev => {
      const updatedApplications = (prev.applications || []).map(a =>
        a.id === application.id
          ? {
              ...a,
              currentStage: 'OFFER_ACCEPTED' as const,
              offer: a.offer
                ? { ...a.offer, ...offer, status: 'ACCEPTED' as const }
                : { ...offer, status: 'ACCEPTED' as const },
            }
          : a
      );

      return {
        ...prev,
        player: {
          ...prev.player,
          company,
          title: offer.title,
          department: offer.department || roleProfile.department,
          team: teamName,
          salary: offer.baseSalary,
          currency: offer.currency,
          location: offer.location,
          email: playerEmail,
          managerId,
          roleProfile,
          probationDaysLeft: (offer.probationMonths || 6) * 30,
          probationPassed: false,
          achievements: [
            ...prev.player.achievements,
            {
              id: `ach-hired-${Date.now()}`,
              title: `Badge of Entry: ${company}`,
              description: `Cleared multi-round interviews and joined ${company} as ${offer.title}.`,
              icon: 'Building2',
              unlockedAt: 'Day 1',
            },
          ],
        },
        emails: emails,
        channels: conformingChannels,
        messages: messages,
        tasks: conformingTasks,
        applications: updatedApplications,
        isHired: true,
        gameStarted: true,
        careerStage: 'PROBATION',
        currentDay: 1,
        currentHour: 9,
        currentMinute: 0,
      };
    });

    setCurrentTab('dashboard');
  };

  const handleAcceptOfferFromMobile = (roleTitle: string, companyName: string, salary: number) => {
    const appId = `app-mobile-${Date.now()}`;
    const jobId = `job-${Date.now()}`;

    const jobOffer: JobOffer = {
      id: `offer-${Date.now()}`,
      jobId,
      company: companyName,
      title: roleTitle,
      department: 'Corporate Operations',
      location: 'Pune / Mumbai (Hybrid)',
      baseSalary: salary || (gameState.player.currency === '₹' ? 600000 : 80000),
      variableBonus: 50000,
      joiningBonus: 25000,
      probationMonths: 3,
      noticePeriodDays: 30,
      reportingManager: 'Priya Sharma',
      managerRole: 'Director of Operations',
      currency: gameState.player.currency || '₹',
      benefits: ['Health Insurance', 'Hybrid Work', 'Performance Bonus'],
      status: 'ACCEPTED',
      negotiationCount: 0,
    };

    const jobApplication: JobApplication = {
      id: appId,
      job: {
        id: jobId,
        title: roleTitle,
        company: companyName,
        companyLogo: companyName.slice(0, 2).toUpperCase(),
        companyTagline: 'Global Enterprise Solutions',
        companySize: '10,000+ Employees',
        industry: 'Enterprise Technology & Services',
        location: 'Pune / Mumbai (Hybrid)',
        workMode: 'Hybrid',
        experienceRequired: '0–2 Years',
        minExpYears: 0,
        salaryRange: `${salary ? '₹' + (salary / 100000).toFixed(1) + 'L' : '₹6.5L'}`,
        minSalary: salary || 500000,
        maxSalary: salary ? salary + 200000 : 800000,
        currency: gameState.player.currency || '₹',
        skillsRequired: ['Professional Communication', 'Role Excellence'],
        preferredDegree: ['Bachelor Degree', 'Master Degree'],
        department: 'Corporate Operations',
        reportingManager: 'Priya Sharma',
        managerRole: 'Director of Operations',
        interviewDifficulty: 2,
        interviewRounds: ['Technical Assessment', 'Manager Fit'],
        description: `Full-time corporate position as ${roleTitle} at ${companyName}.`,
        responsibilities: ['Drive project deliverables', 'Collaborate with cross-functional teams'],
        benefits: ['Health Insurance', 'Hybrid Work', 'Performance Bonus'],
      },
      appliedDate: 'Day 1',
      currentStage: 'OFFER_EXTENDED',
      currentRoundIndex: 2,
      matchScore: 92,
      matchBreakdown: {
        skillsMatch: 90,
        experienceMatch: 95,
        educationMatch: 100,
        verdict: 'Strong Match',
      },
      interviewerName: 'Hiring Lead',
      interviewerRole: 'Manager',
      interviewerPersonality: 'TECHNICAL',
      interviewChat: [],
      hiddenImpression: {
        technicalKnowledge: 88,
        communication: 90,
        confidence: 85,
        problemSolving: 88,
        cultureFit: 92,
      },
      offer: jobOffer,
      lastUpdated: 'Just now',
    };

    handleAcceptOfferAndJoin(jobApplication, jobOffer);
    setIsSmartphoneOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors relative">
      {/* Onboarding Setup Modal if Game Has Not Started */}
      {!gameState.gameStarted && (
        <OnboardingModal
          onStartCareer={handleStartCareer}
          hasGeminiKey={hasGeminiKey}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        gameState={gameState}
        onAdvanceTime={handleAdvanceTime}
        onEndDay={handleEndDay}
        onSaveGame={handleManualSave}
        hasGeminiKey={hasGeminiKey}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenIncident={() => setCurrentTab('incident')}
      />

      {/* If Candidate is not yet hired: Start with the Pre-Career Recruitment Portal */}
      {!gameState.isHired ? (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <RecruitmentHubView
            gameState={gameState}
            onUpdateGameState={setGameState}
            onAcceptOfferAndJoin={handleAcceptOfferAndJoin}
            hasGeminiKey={hasGeminiKey}
            initialStep="profile"
          />
        </div>
      ) : (
        /* Main Corporate Workplace: Sidebar + Dynamic Views */
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            gameState={gameState}
          />

          <main className="flex-1 overflow-hidden bg-slate-100/60 dark:bg-slate-950/60">
            {currentTab === 'dashboard' && (
              <DashboardView
                gameState={gameState}
                onNavigate={setCurrentTab}
                onOpenTask={taskId => {
                  setCurrentTab('tasks');
                }}
                onOpenChannel={channelId => {
                  setActiveChannelId(channelId);
                  setCurrentTab('messages');
                }}
              />
            )}

            {currentTab === 'messages' && (
              <MessagesView
                gameState={gameState}
                activeChannelId={activeChannelId}
                onSelectChannel={setActiveChannelId}
                onUpdateGameState={setGameState}
                hasGeminiKey={hasGeminiKey}
              />
            )}

            {currentTab === 'email' && (
              <EmailView
                gameState={gameState}
                onUpdateGameState={setGameState}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksView
                gameState={gameState}
                onUpdateGameState={setGameState}
                onAdvanceTime={handleAdvanceTime}
                onJumpToChat={channelId => {
                  setActiveChannelId(channelId);
                  setCurrentTab('messages');
                }}
              />
            )}

            {currentTab === 'news' && (
              <CorporateNewsView
                gameState={gameState}
                onUpdateGameState={setGameState}
                hasGeminiKey={hasGeminiKey}
              />
            )}

            {currentTab === 'incident' && (
              <IncidentView
                gameState={gameState}
                onUpdateGameState={setGameState}
                onJumpToWarRoom={() => {
                  setActiveChannelId('channel-incident-war-room');
                  setCurrentTab('messages');
                }}
                onAdvanceTime={handleAdvanceTime}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView
                gameState={gameState}
                onUpdateGameState={setGameState}
                onAdvanceTime={handleAdvanceTime}
                onEndDay={handleEndDay}
                onJumpToChat={channelId => {
                  setActiveChannelId(channelId);
                  setCurrentTab('messages');
                }}
                hasGeminiKey={hasGeminiKey}
              />
            )}

            {currentTab === 'team' && (
              <TeamView
                gameState={gameState}
                onJumpToChat={channelId => {
                  setActiveChannelId(channelId);
                  setCurrentTab('messages');
                }}
              />
            )}

            {currentTab === 'performance' && (
              <PerformanceView
                gameState={gameState}
                onUpdateGameState={setGameState}
              />
            )}

            {currentTab === 'career' && (
              <CareerView
                gameState={gameState}
                onUpdateGameState={setGameState}
              />
            )}

            {currentTab === 'job_market' && (
              <RecruitmentHubView
                gameState={gameState}
                onUpdateGameState={setGameState}
                onAcceptOfferAndJoin={handleAcceptOfferAndJoin}
                hasGeminiKey={hasGeminiKey}
                initialStep="jobs"
              />
            )}

            {currentTab === 'achievements' && (
              <AchievementsView
                gameState={gameState}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                gameState={gameState}
                onUpdateGameState={setGameState}
                onSaveGame={handleManualSave}
                onResetGame={handleResetGame}
                hasGeminiKey={hasGeminiKey}
              />
            )}
          </main>
        </div>
      )}

      {/* Persistent Mobile Phone Floating Button - ALWAYS VISIBLE */}
      <button
        onClick={() => setIsSmartphoneOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white border-2 border-emerald-500 shadow-2xl flex items-center gap-2 transition transform hover:scale-105 active:scale-95 group font-bold text-xs cursor-pointer"
      >
        <div className="relative">
          <Smartphone className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />
          {totalUnreadPhonePings > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
              {totalUnreadPhonePings}
            </span>
          )}
        </div>
        <span className="tracking-wide">📱 SMARTPHONE</span>
        {totalUnreadPhonePings > 0 && (
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            {totalUnreadPhonePings} new
          </span>
        )}
      </button>

      {/* Smartphone Interactive Device Modal - ALWAYS ACCESSIBLE */}
      {gameState.personalLife && (
        <SmartphoneModal
          isOpen={isSmartphoneOpen}
          onClose={() => setIsSmartphoneOpen(false)}
          personalLife={{
            ...gameState.personalLife,
            candidateProfile: gameState.candidateProfile,
            candidateName: gameState.player?.name,
          }}
          onUpdatePersonalLife={updater => {
            setGameState(prev => ({
              ...prev,
              personalLife: prev.personalLife ? updater(prev.personalLife) : prev.personalLife,
            }));
          }}
          currentDay={gameState.currentDay}
          currentHour={gameState.currentHour}
          currentMinute={gameState.currentMinute}
          onResetGame={handleResetGame}
          onAcceptOfferAndJoin={handleAcceptOfferFromMobile}
        />
      )}
    </div>
  );
}
