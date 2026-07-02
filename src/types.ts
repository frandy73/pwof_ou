export type Subject = 
  | 'Matematik' 
  | 'Fizik' 
  | 'Chimi' 
  | 'Biyoloji' 
  | 'Angle' 
  | 'Kreyòl' 
  | 'Fransè' 
  | 'Istwa' 
  | 'Jewografi'
  | 'Tout';

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatHistory {
  role: 'user' | 'model';
  text: string;
}
