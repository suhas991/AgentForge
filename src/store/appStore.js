import { create } from 'zustand';

/**
 * Global application state management using Zustand
 * Handles: agents, modals, user config, theme, UI state
 */
export const useAppStore = create((set) => ({
  // ==================== AGENTS ====================
  agents: [],
  setAgents: (agents) => set({ agents }),

  // ==================== USER CONFIG ====================
  userConfig: null,
  setUserConfig: (config) => set({ userConfig: config }),

  // ==================== THEME ====================
  theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light',
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      return { theme: newTheme };
    }),

  // ==================== MODAL STATES ====================
  showFormModal: false,
  setShowFormModal: (show) => set({ showFormModal: show }),

  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),

  showImportModal: false,
  setShowImportModal: (show) => set({ showImportModal: show }),

  showOnboarding: false,
  setShowOnboarding: (show) => set({ showOnboarding: show }),

  // ==================== EDITING STATE ====================
  editingAgent: null,
  setEditingAgent: (agent) => set({ editingAgent: agent }),

  // ==================== RUNNING AGENT ====================
  runningAgent: null,
  setRunningAgent: (agent) => set({ runningAgent: agent }),

  // ==================== CHATBOT ====================
  isChatBotOpen: false,
  setIsChatBotOpen: (isOpen) => set({ isChatBotOpen: isOpen }),

  // ==================== LOADING STATE ====================
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // ==================== UI STATE ====================
  showUserMenu: false,
  setShowUserMenu: (show) => set({ showUserMenu: show }),

  isMobile: typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
  setIsMobile: (isMobile) => set({ isMobile }),

  // ==================== NAVIGATION ====================
  currentPage: 'landing', // 'landing' | 'dashboard'
  setCurrentPage: (page) => set({ currentPage: page }),

  // ==================== HELPER FUNCTIONS ====================
  closeAllModals: () =>
    set({
      showFormModal: false,
      showSettings: false,
      showImportModal: false,
      showOnboarding: false,
      editingAgent: null,
      runningAgent: null,
    }),

  reset: () =>
    set({
      agents: [],
      userConfig: null,
      showFormModal: false,
      showSettings: false,
      showImportModal: false,
      showOnboarding: false,
      editingAgent: null,
      runningAgent: null,
      isChatBotOpen: false,
      isLoading: true,
      showUserMenu: false,
      currentPage: 'landing',
    }),
}));
