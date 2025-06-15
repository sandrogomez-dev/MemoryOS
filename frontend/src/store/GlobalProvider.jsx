import React, { createContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

// Initial state
const initialStore = () => ({
  user: null,
  isAuthenticated: false,
  memories: [],
  reminders: [],
  subscription: 'free',
  isLoading: false,
  error: null,
  success: null,
  aiAssistant: { 
    isActive: false, 
    messages: [] 
  },
  dashboard: {
    stats: null,
    recentMemories: [],
    upcomingReminders: []
  }
})

// Action types
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_SUCCESS: 'CLEAR_SUCCESS',
  
  // Auth actions
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  
  // Memory actions
  SET_MEMORIES: 'SET_MEMORIES',
  ADD_MEMORY: 'ADD_MEMORY',
  UPDATE_MEMORY: 'UPDATE_MEMORY',
  DELETE_MEMORY: 'DELETE_MEMORY',
  
  // Reminder actions
  SET_REMINDERS: 'SET_REMINDERS',
  ADD_REMINDER: 'ADD_REMINDER',
  UPDATE_REMINDER: 'UPDATE_REMINDER',
  DELETE_REMINDER: 'DELETE_REMINDER',
  TOGGLE_REMINDER_COMPLETE: 'TOGGLE_REMINDER_COMPLETE',
  
  // Dashboard actions
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  
  // AI Assistant actions
  TOGGLE_AI_ASSISTANT: 'TOGGLE_AI_ASSISTANT',
  ADD_AI_MESSAGE: 'ADD_AI_MESSAGE',
  CLEAR_AI_MESSAGES: 'CLEAR_AI_MESSAGES'
}

// Reducer function
const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ACTIONS.SET_SUCCESS:
      return { ...state, success: action.payload, error: null }
    
    case ACTIONS.CLEAR_SUCCESS:
      return { ...state, success: null }
    
    // Auth actions
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        subscription: action.payload.subscription_type || 'free',
        isLoading: false,
        error: null
      }
    
    case ACTIONS.LOGOUT:
      return {
        ...initialStore(),
        isLoading: false
      }
    
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        subscription: action.payload.subscription_type || state.subscription
      }
    
    // Memory actions
    case ACTIONS.SET_MEMORIES:
      return { ...state, memories: action.payload }
    
    case ACTIONS.ADD_MEMORY:
      return { 
        ...state, 
        memories: [action.payload, ...state.memories] 
      }
    
    case ACTIONS.UPDATE_MEMORY:
      return {
        ...state,
        memories: state.memories.map(memory =>
          memory.id === action.payload.id ? action.payload : memory
        )
      }
    
    case ACTIONS.DELETE_MEMORY:
      return {
        ...state,
        memories: state.memories.filter(memory => memory.id !== action.payload)
      }
    
    // Reminder actions
    case ACTIONS.SET_REMINDERS:
      return { ...state, reminders: action.payload }
    
    case ACTIONS.ADD_REMINDER:
      return { 
        ...state, 
        reminders: [action.payload, ...state.reminders] 
      }
    
    case ACTIONS.UPDATE_REMINDER:
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        )
      }
    
    case ACTIONS.DELETE_REMINDER:
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload)
      }
    
    case ACTIONS.TOGGLE_REMINDER_COMPLETE:
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        )
      }
    
    // Dashboard actions
    case ACTIONS.SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboard: action.payload
      }
    
    // AI Assistant actions
    case ACTIONS.TOGGLE_AI_ASSISTANT:
      return {
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          isActive: !state.aiAssistant.isActive
        }
      }
    
    case ACTIONS.ADD_AI_MESSAGE:
      return {
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          messages: [...state.aiAssistant.messages, action.payload]
        }
      }
    
    case ACTIONS.CLEAR_AI_MESSAGES:
      return {
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          messages: []
        }
      }
    
    default:
      return state
  }
}

// Create context
export const GlobalContext = createContext()

// Provider component
export const GlobalProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore())

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const user = await authService.getCurrentUser()
        if (user) {
          dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: user })
        }
      } catch (error) {
        console.log('No authenticated user found')
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    }

    checkAuth()
  }, [])

  const value = {
    store,
    dispatch,
    actions: ACTIONS
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
} 