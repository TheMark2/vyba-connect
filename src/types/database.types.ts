export interface Database {
  public: {
    Tables: {
      // ... existing tables
      
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
      
      profiles: {
        Row: {
          id: string;
          email: string;
          name?: string;
          last_name?: string;
          birth_date?: string;
          created_at?: string;
          updated_at?: string;
          avatar_url?: string;
          phone?: string;
          location?: string;
          city?: string;
          province?: string;
          favorite_genres?: string[];
          preferred_artist_types?: string[];
          onboarding_status: 'pending' | 'completed' | 'skipped';
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          last_name?: string;
          birth_date?: string;
          created_at?: string;
          updated_at?: string;
          avatar_url?: string;
          phone?: string;
          location?: string;
          city?: string;
          province?: string;
          favorite_genres?: string[];
          preferred_artist_types?: string[];
          onboarding_status?: 'pending' | 'completed' | 'skipped';
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          last_name?: string;
          birth_date?: string;
          created_at?: string;
          updated_at?: string;
          avatar_url?: string;
          phone?: string;
          location?: string;
          city?: string;
          province?: string;
          favorite_genres?: string[];
          preferred_artist_types?: string[];
          onboarding_status?: 'pending' | 'completed' | 'skipped';
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    
    // ... rest of the schema
  };
} 