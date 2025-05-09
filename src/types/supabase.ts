export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      favorite_artists: {
        Row: {
          artist_id: string
          artist_name: string
          created_at: string | null
          id: string
          list_id: string
          user_id: string
        }
        Insert: {
          artist_id: string
          artist_name: string
          created_at?: string | null
          id?: string
          list_id: string
          user_id: string
        }
        Update: {
          artist_id?: string
          artist_name?: string
          created_at?: string | null
          id?: string
          list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_artists_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "favorite_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_artists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      favorite_lists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          verified: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          verified?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string
          id: string
          last_name: string | null
          name: string | null
          updated_at: string | null
          avatar_url: string | null
          phone: string | null
          location: string | null
          city: string | null
          province: string | null
          favorite_genres: string[]
          preferred_artist_types: string[]
          onboarding_status: 'pending' | 'completed' | 'skipped'
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          email: string
          id: string
          last_name?: string | null
          name?: string | null
          updated_at?: string | null
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          city?: string | null
          province?: string | null
          favorite_genres?: string[]
          preferred_artist_types?: string[]
          onboarding_status?: 'pending' | 'completed' | 'skipped'
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_name?: string | null
          name?: string | null
          updated_at?: string | null
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          city?: string | null
          province?: string | null
          favorite_genres?: string[]
          preferred_artist_types?: string[]
          onboarding_status?: 'pending' | 'completed' | 'skipped'
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_artist_count: {
        Args: {
          list_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TableUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
