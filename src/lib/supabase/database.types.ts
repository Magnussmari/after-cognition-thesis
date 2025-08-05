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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'reviewer' | 'guest'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'reviewer' | 'guest'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'reviewer' | 'guest'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      thesis_access: {
        Row: {
          id: string
          user_id: string
          thesis_id: string
          access_level: 'read' | 'comment' | 'admin'
          granted_by: string | null
          granted_at: string
          expires_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          thesis_id?: string
          access_level?: 'read' | 'comment' | 'admin'
          granted_by?: string | null
          granted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          thesis_id?: string
          access_level?: 'read' | 'comment' | 'admin'
          granted_by?: string | null
          granted_at?: string
          expires_at?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "thesis_access_granted_by_fkey"
            columns: ["granted_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_access_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_thesis_access: {
        Args: {
          p_user_id: string
          p_thesis_id: string
          p_required_level?: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id: string
          p_details?: Json | null
          p_ip_address?: string | null
          p_user_agent?: string | null
        }
        Returns: void
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
