export interface Medal {
  id: string;
  title: string;
  type: "honor" | "penalty";
  icon: string;
  color: string;
  description: string;
}

export interface User {
  id: string;
  emailUsername: string;
  emailDomain: string;
  fullName: string;
  contact: string;
  avatarUrl?: string;
  role: "admin" | "user";
  storageQuota: string;
  storageUsed: string;
  verified: boolean;
  verificationType: "identity" | "payment";
  banned: boolean;
  banReason?: string;
  banExpiry?: string | null;
  medals: Medal[];
  activeBackground: string;
}

export interface Attachment {
  name: string;
  size: string;
  dataUrl?: string;
}

export interface Email {
  id: string;
  senderUsername: string;
  senderDomain: string;
  senderName: string;
  receiverUsername: string;
  receiverDomain: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  folder: "inbox" | "sent" | "draft" | "trash" | "deleted" | "archive" | "spam";
  category: "work" | "personal" | "social" | "promotions";
  tags: string[];
  attachments: Attachment[];
  sensitivityReport?: string;
  aiSummary?: string;
}

export interface BlogComment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}

export interface Blog {
  id: string;
  author: string;
  authorEmail: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  timestamp: string;
  likes: number;
  comments: BlogComment[];
}

export interface FriendshipRecord {
  id: string;
  name: string;
  content: string;
  photoUrl: string;
  fontFamily?: string;
  opacity?: number;
  borderStyle?: string;
  timestamp: string;
}

export interface CustomButton {
  id: string;
  label: string;
  actionUrl: string; // anchor or path
  page: "home" | "work";
  visibility: "all" | "logined" | "specified";
  specifiedUsers: string[]; // usernames or emails
  styling: {
    bgColor: string;
    textColor: string;
  };
  banned: boolean;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  shippingAddress: string;
  shippingLogistics: string;
  assignedTo: string;
  timestamp: string;
}

export interface BackgroundTheme {
  id: string;
  name: string;
  color: string;
  price: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
}

export interface SubPage {
  id: string;
  titleEn: string;
  titleZh: string;
  contentEn: string;
  contentZh: string;
  externalLink?: string; // If it's an external URL
  isExternal: boolean; // true if it's an external link
  isVisible: boolean; // whether to show in top nav
  order: number;
}

export interface PageBrowserCheck {
  id: string;
  pageId: string;
  requireFullscreen: boolean;
  minWidth: number;
  minHeight: number;
  notMetAction: "warning" | "block_with_message" | "redirect";
  actionMessage: string;
  redirectUrl: string;
}

export interface SystemState {
  activeDomain: string;
  oldDomain: string;
  dualDomainOverlap: boolean;
  dualDomainDays: number;
  customButtons: CustomButton[];
  backgrounds: BackgroundTheme[];
  users: User[];
  blogs: Blog[];
  friendshipRecords: FriendshipRecord[];
  chatMessages: ChatMessage[];
  navPages?: SubPage[];
  aiAuthorizedUsers?: string[];
  pageBrowserChecks?: PageBrowserCheck[];
  settings: {
    knowledgeBase: { question: string; answer: string }[];
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string; // HTML formatted content
}

export interface EmailSignature {
  id: string;
  name: string;
  content: string; // HTML formatted content
  isDefault: boolean;
}

