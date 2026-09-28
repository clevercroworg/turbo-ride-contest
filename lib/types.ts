export interface Contest {
  id: string
  title: string
  subtitle: string
  carName: string
  imageUrl: string
  worthDisplay: string
  targetTickets: number
  soldTickets: number
  ticketPrice: number
  creditsPerTicket: number
  status: "active" | "upcoming" | "completed"
  drawDate?: string
  winnerTicketNumber?: string
  winnerName?: string
}

export interface ContestTicket {
  id: string
  contestId: string
  userPhone: string
  userEmail: string
  userName?: string
  ticketNumber: string
  orderId?: string
  createdAt: string
  contestTitle?: string
  carName?: string
  contestStatus?: "active" | "upcoming" | "completed"
  winnerTicketNumber?: string
  drawDate?: string
}

export interface MemberSession {
  id?: string
  email: string
  phone: string
  name: string
  referralCode: string
}

export interface RewardItem {
  id: string
  category: "Supercar Drive" | "Experience" | "Media Experience"
  title: string
  specs: string
  creditsRequired: number
  imageUrl: string
  available: boolean
  bookingCarId?: string
  bookingLaps?: number
  addonType?: string
}

export interface ReferralProfile {
  userPhone: string
  userEmail: string
  userName: string
  referralCode: string
  totalReferredUsers: number
  totalCreditsEarned: number
  totalCashEarned: number
  ticketsBought: number
  isCashUnlocked: boolean
}

export interface ReferralRecord {
  id: string
  userName: string
  userEmail: string
  ticketCount: number
  amountPaid: number
  creditsEarned: number
  cashEarned: number
  createdAt: string
}

export interface ActiveVoucher {
  id: string
  code: string
  rewardId: string
  rewardTitle: string
  creditsSpent: number
  status: "pending_booking" | "scheduled" | "fulfilled" | "cancelled"
  createdAt: string
  bookingUrl: string
  bookingCarId?: string
  bookingLaps?: number
}

export interface AdminPlatformSettings {
  ticketPrice: number
  creditsPerTicket: number
  creditRewardPercent: number
  cashCommissionPercent: number
  cashUnlockThreshold: number
  fallbackPayoutPercent: number
  drawType: string
  isPaused: boolean
  isClosed: boolean
}

