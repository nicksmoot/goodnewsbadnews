export type SignalType = "GOOD" | "WARNING" | "OPPORTUNITY";
export type SignalStatus = "PENDING" | "PUBLISHED" | "REJECTED" | "RESOLVED";
export type ConfidenceLevel = "Community reported" | "Public record" | "Verified by editor" | "Needs more signal";

export type Signal = {
  id: string;
  title: string;
  body: string;
  signalType: SignalType;
  city: string;
  neighborhood: string;
  status: SignalStatus;
  confidenceLevel: ConfidenceLevel;
  responseRequested?: string;
  sourceNote: string;
  createdAt: string;
  helpfulVotes: number;
  civicScore: number;
};

export type Contributor = {
  name: string;
  neighborhood: string;
  role: string;
  civicScore: number;
  verifiedSignals: number;
};
