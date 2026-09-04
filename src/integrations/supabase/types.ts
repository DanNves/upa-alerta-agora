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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string | null
          criado_em: string | null
          id: string
          nota: number | null
          tempo_real_min: number | null
          upa_id: string | null
        }
        Insert: {
          comentario?: string | null
          criado_em?: string | null
          id?: string
          nota?: number | null
          tempo_real_min?: number | null
          upa_id?: string | null
        }
        Update: {
          comentario?: string | null
          criado_em?: string | null
          id?: string
          nota?: number | null
          tempo_real_min?: number | null
          upa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_upa_id_fkey"
            columns: ["upa_id"]
            isOneToOne: false
            referencedRelation: "upas"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          ativo: boolean | null
          data_fim: string | null
          data_inicio: string
          descricao: string | null
          icone: string | null
          id: string
          titulo: string
          upa_ids: string[] | null
        }
        Insert: {
          ativo?: boolean | null
          data_fim?: string | null
          data_inicio: string
          descricao?: string | null
          icone?: string | null
          id?: string
          titulo: string
          upa_ids?: string[] | null
        }
        Update: {
          ativo?: boolean | null
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          titulo?: string
          upa_ids?: string[] | null
        }
        Relationships: []
      }
      historico_ocupacao: {
        Row: {
          id: string
          ocupacao: number | null
          registrado_em: string | null
          upa_id: string | null
        }
        Insert: {
          id?: string
          ocupacao?: number | null
          registrado_em?: string | null
          upa_id?: string | null
        }
        Update: {
          id?: string
          ocupacao?: number | null
          registrado_em?: string | null
          upa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_ocupacao_upa_id_fkey"
            columns: ["upa_id"]
            isOneToOne: false
            referencedRelation: "upas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      upa_servicos: {
        Row: {
          id: string
          servico_id: string | null
          upa_id: string | null
        }
        Insert: {
          id?: string
          servico_id?: string | null
          upa_id?: string | null
        }
        Update: {
          id?: string
          servico_id?: string | null
          upa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upa_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upa_servicos_upa_id_fkey"
            columns: ["upa_id"]
            isOneToOne: false
            referencedRelation: "upas"
            referencedColumns: ["id"]
          },
        ]
      }
      upas: {
        Row: {
          aberta: boolean | null
          atualizado_em: string | null
          bairro: string
          capacidade_max: number
          cep: string
          cidade: string
          criado_em: string | null
          endereco: string
          estado: string
          fotos: string[] | null
          id: string
          latitude: number
          longitude: number
          nome: string
          ocupacao_atual: number
          referencia: string | null
          telefone: string | null
          tempo_estimado: number | null
        }
        Insert: {
          aberta?: boolean | null
          atualizado_em?: string | null
          bairro: string
          capacidade_max?: number
          cep: string
          cidade: string
          criado_em?: string | null
          endereco: string
          estado: string
          fotos?: string[] | null
          id?: string
          latitude: number
          longitude: number
          nome: string
          ocupacao_atual?: number
          referencia?: string | null
          telefone?: string | null
          tempo_estimado?: number | null
        }
        Update: {
          aberta?: boolean | null
          atualizado_em?: string | null
          bairro?: string
          capacidade_max?: number
          cep?: string
          cidade?: string
          criado_em?: string | null
          endereco?: string
          estado?: string
          fotos?: string[] | null
          id?: string
          latitude?: number
          longitude?: number
          nome?: string
          ocupacao_atual?: number
          referencia?: string | null
          telefone?: string | null
          tempo_estimado?: number | null
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
