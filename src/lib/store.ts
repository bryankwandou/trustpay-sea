import { create } from 'zustand'
import { Deal, DealStatus, Milestone, MilestoneStatus, User, Notification, CreateDealForm } from './types'

// === DEAL STORE ===

interface DealState {
  deals: Deal[]
  currentDeal: Deal | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setDeals: (deals: Deal[]) => void
  setCurrentDeal: (deal: Deal | null) => void
  addDeal: (deal: Deal) => void
  updateDeal: (dealId: string, updates: Partial<Deal>) => void
  updateMilestone: (dealId: string, milestoneId: string, updates: Partial<Milestone>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDealStore = create<DealState>((set, get) => ({
  deals: [],
  currentDeal: null,
  isLoading: false,
  error: null,
  
  setDeals: (deals) => set({ deals }),
  
  setCurrentDeal: (deal) => set({ currentDeal: deal }),
  
  addDeal: (deal) => set((state) => ({
    deals: [deal, ...state.deals]
  })),
  
  updateDeal: (dealId, updates) => set((state) => ({
    deals: state.deals.map(d => 
      d.id === dealId ? { ...d, ...updates } : d
    ),
    currentDeal: state.currentDeal?.id === dealId 
      ? { ...state.currentDeal, ...updates }
      : state.currentDeal
  })),
  
  updateMilestone: (dealId, milestoneId, updates) => set((state) => ({
    deals: state.deals.map(d => 
      d.id === dealId ? {
        ...d,
        milestones: d.milestones.map(m =>
          m.id === milestoneId ? { ...m, ...updates } : m
        )
      } : d
    ),
    currentDeal: state.currentDeal?.id === dealId 
      ? {
          ...state.currentDeal,
          milestones: state.currentDeal.milestones.map(m =>
            m.id === milestoneId ? { ...m, ...updates } : m
          )
        }
      : state.currentDeal
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}))

// === CREATE DEAL FORM STORE ===

interface CreateDealFormState {
  // Step tracking
  currentStep: number
  totalSteps: number
  
  // Form data
  formData: CreateDealForm
  
  // Validation
  errors: Record<string, string>
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (data: Partial<CreateDealForm>) => void
  addMilestone: () => void
  updateMilestone: (index: number, data: Partial<CreateDealForm['milestones'][0]>) => void
  removeMilestone: (index: number) => void
  setErrors: (errors: Record<string, string>) => void
  resetForm: () => void
}

const initialFormData: CreateDealForm = {
  title: '',
  description: '',
  counterpartyEmail: '',
  counterpartyAddress: '',
  milestones: [
    {
      title: '',
      description: '',
      amount: 0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    }
  ],
  mediatorAddress: '',
  currency: 'USDC'
}

export const useCreateDealStore = create<CreateDealFormState>((set, get) => ({
  currentStep: 1,
  totalSteps: 4,
  formData: initialFormData,
  errors: {},
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),
  
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  addMilestone: () => set((state) => ({
    formData: {
      ...state.formData,
      milestones: [
        ...state.formData.milestones,
        {
          title: '',
          description: '',
          amount: 0,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  })),
  
  updateMilestone: (index, data) => set((state) => ({
    formData: {
      ...state.formData,
      milestones: state.formData.milestones.map((m, i) =>
        i === index ? { ...m, ...data } : m
      )
    }
  })),
  
  removeMilestone: (index) => set((state) => ({
    formData: {
      ...state.formData,
      milestones: state.formData.milestones.filter((_, i) => i !== index)
    }
  })),
  
  setErrors: (errors) => set({ errors }),
  
  resetForm: () => set({
    currentStep: 1,
    formData: initialFormData,
    errors: {}
  })
}))

// === USER STORE ===

interface UserState {
  user: User | null
  isConnected: boolean
  
  setUser: (user: User | null) => void
  setConnected: (connected: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isConnected: false,
  
  setUser: (user) => set({ user, isConnected: !!user }),
  setConnected: (connected) => set({ isConnected: connected })
}))

// === NOTIFICATION STORE ===

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0
  })
}))
