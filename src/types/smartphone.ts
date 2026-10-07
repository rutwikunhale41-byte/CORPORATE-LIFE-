export type RelationshipType = 
  | 'Family'
  | 'Best Friend'
  | 'Close Friend'
  | 'Friend'
  | 'Acquaintance'
  | 'Colleague'
  | 'Romantic Interest'
  | 'Partner'
  | 'Ex-Partner'
  | 'Former Friend';

export interface PersonalContact {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  phone: string;
  avatar: string;
  color?: string;
  bio: string;
  occupation: string;
  age: number;
  location: string;
  trust: number; // 0-100
  closeness: number; // 0-100
  respect: number; // 0-100
  romanticInterest?: number; // 0-100
  memories: string[];
  interests: string[];
  birthday?: string;
  mood: string;
  isOnline: boolean;
  lastSeen: string;
  instagramHandle?: string;
}

export interface DirectChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isPlayer: boolean;
  mediaUrl?: string;
  replyToId?: string;
  read: boolean;
  deliveryStatus?: 'sent' | 'delivered' | 'read';
  readAtTimestamp?: string;
}

export interface PersonalCallRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  durationSeconds?: number;
  summaryNote?: string;
}

export interface SocialPostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'snapchat' | 'facebook' | 'linkedin';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  caption: string;
  imageUrl?: string;
  timestamp: string;
  likesCount: number;
  isLikedByPlayer: boolean;
  comments: SocialPostComment[];
  locationTag?: string;
  streakDays?: number; // for snapchat
}

export interface SocialStory {
  id: string;
  platform: 'instagram' | 'snapchat';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption?: string;
  timestamp: string;
  isViewed: boolean;
  replies: Array<{ senderName: string; text: string }>;
}

export interface DatingProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  photos: string[];
  interests: string[];
  hobbies: string[];
  location: string;
  compatibilityScore: number; // 0-100
  relationshipPreference: 'Long-term' | 'Casual' | 'Friends First' | 'Marriage Minded';
  status: 'SUGGESTED' | 'MATCHED' | 'PASSED' | 'DATING' | 'REJECTED';
  matchedAt?: string;
  lastChatText?: string;
}

export interface DateScenario {
  id: string;
  matchId: string;
  matchName: string;
  matchAvatar: string;
  venueName: string;
  venueType: 'Coffee Shop' | 'Rooftop Restaurant' | 'Trekking Trail' | 'Bookstore Cafe' | 'Concert' | 'Street Food Walk';
  dateTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  chemistryScore?: number;
  outcomeSummary?: string;
}

export interface PersonalCalendarEvent {
  id: string;
  title: string;
  category: 'DINNER' | 'DATE' | 'BIRTHDAY' | 'GYM' | 'FAMILY' | 'TRIP' | 'MOVIE' | 'FESTIVAL' | 'WORK_CONFLICT';
  dateTimeString: string;
  location: string;
  attendees: string[];
  conflictWithWork?: boolean;
}

export interface BillItem {
  id: string;
  title: string;
  category: 'ELECTRICITY' | 'BROADBAND' | 'RENT' | 'WATER' | 'CREDIT_CARD';
  amount: number;
  dueDate: string;
  status: 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED';
  paidDate?: string;
  transactionId?: string;
  providerName: string;
}

export interface WalletTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  title: string;
  category: 'SALARY' | 'RENT' | 'FOOD' | 'SHOPPING' | 'ENTERTAINMENT' | 'BILLS' | 'DATING' | 'TRAVEL' | 'REPAYMENT' | 'GIFT';
  amount: number;
  currency: string;
  timestamp: string;
  recipientId?: string;
  recipientName?: string;
  purposeNote?: string;
  transactionId?: string;
  status?: 'COMPLETED' | 'FAILED';
}

export interface PhoneNotification {
  id: string;
  app: 'whatsapp' | 'instagram' | 'snapchat' | 'facebook' | 'dating' | 'calls' | 'calendar' | 'wallet' | 'work' | 'messages' | 'email' | 'linkedin';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetAppId?: string;
  actionPayload?: any;
}

export interface LinkedInRecruiter {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  specialty: string;
  personality: 'Friendly' | 'Professional' | 'Strict' | 'Skeptical' | 'Executive';
  hiringRoles: string[];
  connectionStatus: 'NONE' | 'PENDING' | 'CONNECTED';
}

export interface LinkedInJobPost {
  id: string;
  company: string;
  logo: string;
  role: string;
  location: string;
  salaryRange: string;
  department: string;
  experienceLevel: string;
  matchScore: number;
  skillsRequired: string[];
  description: string;
  postedDate: string;
  applicantsCount: number;
  isSaved?: boolean;
}

export interface LinkedInMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isPlayer: boolean;
  jobOpportunityId?: string;
}

export interface GoogleMeetInterview {
  id: string;
  jobId: string;
  companyName: string;
  roleTitle: string;
  roundName: 'Recruiter Screening' | 'Technical Round 1' | 'Technical Round 2' | 'Hiring Manager Round' | 'HR Round';
  interviewerName: string;
  interviewerTitle: string;
  interviewerAvatar: string;
  interviewerPersonality: 'Friendly' | 'Strict' | 'Technical' | 'Skeptical' | 'Executive' | 'Detail-Oriented';
  scheduledDay: number;
  scheduledTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'PASSED' | 'REJECTED' | 'EXPIRED';
  meetingCode: string;
  scorecard?: {
    technicalScore: number;
    communicationScore: number;
    roleFitScore: number;
    confidenceScore: number;
    feedbackSummary: string;
    passed: boolean;
  };
}

export interface PersonalLifeState {
  candidateName?: string;
  candidateProfile?: any;
  walletBalance: number;
  currency: string;
  contacts: PersonalContact[];
  whatsappChats: Record<string, DirectChatMessage[]>;
  callHistory: PersonalCallRecord[];
  activeCall?: {
    contact: PersonalContact;
    status: 'RINGING' | 'CONNECTED' | 'ENDED';
    durationSeconds: number;
    dialogueHistory: Array<{ speaker: string; text: string }>;
  };
  socialPosts: SocialPost[];
  socialStories: SocialStory[];
  snapchatStreaks: Record<string, number>;
  datingProfiles: DatingProfile[];
  dates: DateScenario[];
  personalCalendar: PersonalCalendarEvent[];
  walletTransactions: WalletTransaction[];
  notifications: PhoneNotification[];
  playerDatingProfile: {
    bio: string;
    interests: string[];
    lookingFor: string;
    photos: string[];
  };
  notes: Array<{ id: string; title: string; content: string; updatedAt: string }>;
  galleryPhotos: Array<{ id: string; title: string; url: string; category: string; date: string }>;
  // Utility Bills State Machine & Debts
  utilityBills?: BillItem[];
  debts?: Array<{ id: string; contactId: string; amount: number; direction: 'PLAYER_OWES' | 'CONTACT_OWES'; reason: string; dueDate?: string }>;
  // LinkedIn & Google Meet Ecosystem
  linkedInRecruiters?: LinkedInRecruiter[];
  linkedInJobs?: LinkedInJobPost[];
  linkedInChats?: Record<string, LinkedInMessage[]>;
  googleMeetInterviews?: GoogleMeetInterview[];
  activeMeetSession?: {
    interview: GoogleMeetInterview;
    chatHistory: Array<{ speaker: string; text: string; isPlayer: boolean }>;
    isMuted: boolean;
    isVideoOff: boolean;
    turnCount: number;
  };
}
