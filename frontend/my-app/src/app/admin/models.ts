// src/app/admin/models.ts
export interface Category {
  id: number;
  name: string;
  // optional metadata
  description?: string | null;
}

export type InputType = 'text' | 'select' | 'number' | 'other' | null;

export interface Attribute {
  id: number;
  category_id: number;
  name: string;
  input_type: InputType;
  is_required: boolean;
  options?: AttributeOption[]; // when returning aggregated options from backend
}

export interface AttributeOption {
  id: number;
  attribute_id: number;
  value: string;
}
