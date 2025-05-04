export interface Database {
  public: {
    Tables: {
      favorite_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorite_lists_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      
      favorite_artists: {
        Row: {
          id: string;
          list_id: string;
          user_id: string;
          artist_id: string;
          artist_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          user_id: string;
          artist_id: string;
          artist_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          user_id?: string;
          artist_id?: string;
          artist_name?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorite_artists_list_id_fkey";
            columns: ["list_id"];
            referencedRelation: "favorite_lists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorite_artists_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
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
          password_hash: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          email: string
          id: string
          last_name?: string | null
          name?: string | null
          password_hash?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_name?: string | null
          name?: string | null
          password_hash?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
