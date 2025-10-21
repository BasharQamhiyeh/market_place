import { Attribute, Category } from "../admin/models";


export interface ItemAttributeValue {
  id?: number;
  attribute_id: number;
  value: string;
  attribute_name: string;
  attribute?: Attribute;
}

export interface Photo {
  id?: number;
  url: string;
}

export interface User {
  user_id: number;
  username: string;
  phone?: string;
}

export interface Item {
  id?: number;
  title: string;
  description?: string;
  price?: number;
  category_id: number;
  category?: Category;
  created_at?: string;
  owner?: User;
  photos?: Photo[];
  attribute_values?: ItemAttributeValue[];
}
