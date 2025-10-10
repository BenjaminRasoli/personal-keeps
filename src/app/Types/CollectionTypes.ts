import { Timestamp } from "firebase/firestore";

export type TransportType = "drive" | "shipping" | "";

export interface Item {
  id?: string;
  title: string;
  boughtPrice: number;
  soldPrice?: number | null;
  dateBought?: Timestamp | null;
  dateSold?: Timestamp | null;
  marketBought?: string;
  marketSold?: string;
  transport?: TransportType;
  petrolCost?: number;
  fromAddress?: string;
  toAddress?: string;
  extra?: string;
  totalCost?: number;
  imageUrl?: string;
  isSold?: boolean;
}

export interface CollectionForm {
  name: string;
  boughtPrice: string;
  soldPrice: string;
  dateBought: string;
  dateSold: string;
  marketBought: string;
  marketSold: string;
  transport: TransportType;
  petrolCost: string;
  fromAddress: string;
  toAddress: string;
  extra: string;
  totalCost: string;
  imageUrl: string;
  isSold: boolean;
}

export const defaultForm: CollectionForm = {
  name: "",
  boughtPrice: "",
  soldPrice: "",
  dateBought: "",
  dateSold: "",
  marketBought: "",
  marketSold: "",
  transport: "",
  petrolCost: "",
  fromAddress: "",
  toAddress: "",
  extra: "",
  totalCost: "",
  imageUrl: "",
  isSold: false,
};

export interface CollectionInputProps {
  form: CollectionForm;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}
