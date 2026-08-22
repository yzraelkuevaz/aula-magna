export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agenda_eventos: {
        Row: {
          created_at: string
          descripcion: string | null
          fecha: string
          hora: string | null
          id: string
          tipo: string
          titulo: string
          todo_el_dia: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          fecha: string
          hora?: string | null
          id?: string
          tipo?: string
          titulo: string
          todo_el_dia?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          fecha?: string
          hora?: string | null
          id?: string
          tipo?: string
          titulo?: string
          todo_el_dia?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      alumnos: {
        Row: {
          created_at: string
          id: string
          nombre: string
          notas: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          notas?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          notas?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      asistencia: {
        Row: {
          alumno_id: string
          created_at: string
          estado: string
          fecha: string
          id: string
          nota: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alumno_id: string
          created_at?: string
          estado?: string
          fecha?: string
          id?: string
          nota?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alumno_id?: string
          created_at?: string
          estado?: string
          fecha?: string
          id?: string
          nota?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asistencia_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
        ]
      }
      bitacoras: {
        Row: {
          alumno_id: string | null
          alumno_nombre: string | null
          categoria: string
          created_at: string
          descripcion: string
          estado: string
          fecha: string
          id: string
          importancia: string
          observaciones: string | null
          seguimiento: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alumno_id?: string | null
          alumno_nombre?: string | null
          categoria?: string
          created_at?: string
          descripcion: string
          estado?: string
          fecha?: string
          id?: string
          importancia?: string
          observaciones?: string | null
          seguimiento?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alumno_id?: string | null
          alumno_nombre?: string | null
          categoria?: string
          created_at?: string
          descripcion?: string
          estado?: string
          fecha?: string
          id?: string
          importancia?: string
          observaciones?: string | null
          seguimiento?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bitacoras_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ciclo: string | null
          created_at: string
          escuela: string | null
          grado: string | null
          grupo: string | null
          hora_entrada: string | null
          hora_recreo: string | null
          hora_salida: string | null
          id: string
          is_demo: boolean
          nivel: string | null
          nombre: string
          nombre_grupo: string | null
          notificaciones: boolean
          onboarding_completed: boolean
          sonidos: boolean
          tema: string
          turno: string | null
          tutorial_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          ciclo?: string | null
          created_at?: string
          escuela?: string | null
          grado?: string | null
          grupo?: string | null
          hora_entrada?: string | null
          hora_recreo?: string | null
          hora_salida?: string | null
          id?: string
          is_demo?: boolean
          nivel?: string | null
          nombre?: string
          nombre_grupo?: string | null
          notificaciones?: boolean
          onboarding_completed?: boolean
          sonidos?: boolean
          tema?: string
          turno?: string | null
          tutorial_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          ciclo?: string | null
          created_at?: string
          escuela?: string | null
          grado?: string | null
          grupo?: string | null
          hora_entrada?: string | null
          hora_recreo?: string | null
          hora_salida?: string | null
          id?: string
          is_demo?: boolean
          nivel?: string | null
          nombre?: string
          nombre_grupo?: string | null
          notificaciones?: boolean
          onboarding_completed?: boolean
          sonidos?: boolean
          tema?: string
          turno?: string | null
          tutorial_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recordatorios: {
        Row: {
          activo: boolean
          created_at: string
          dias: number[]
          hora: string
          id: string
          mensaje: string | null
          nombre: string
          repetir: boolean
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          dias?: number[]
          hora?: string
          id?: string
          mensaje?: string | null
          nombre: string
          repetir?: boolean
          tipo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          dias?: number[]
          hora?: string
          id?: string
          mensaje?: string | null
          nombre?: string
          repetir?: boolean
          tipo?: string
          updated_at?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
