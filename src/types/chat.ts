export type InterviewStep = 
  | 'welcome'
  | 'destination'
  | 'dates'
  | 'budget'
  | 'travellers'
  | 'interests'
  | 'mode'
  | 'summary_confirm'
  | 'generating'
  | 'completed';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  step?: InterviewStep;
  quickOptions?: {
    label: string;
    value: any;
    icon?: string;
    sublabel?: string;
  }[];
  customUI?: 'destination_picker' | 'date_picker' | 'budget_slider' | 'traveller_selector' | 'interest_selector' | 'mode_selector' | 'summary_review';
}
