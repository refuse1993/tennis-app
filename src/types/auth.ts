export interface UserProfile {
    id: string
    email: string
    name: string
    experience: number
    title: string
  }
  
  export interface AuthState {
    user: UserProfile | null
    loading: boolean
  }