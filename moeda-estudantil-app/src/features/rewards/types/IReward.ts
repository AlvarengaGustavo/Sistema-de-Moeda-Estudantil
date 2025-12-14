export type TTransactionType = "DONATION" | "REWARD" | "RECHARGE";

export interface IReward {
  id: string;
  name: string;
  description: string;
  amount: number;
  createdAt: string;
  imageUrl: string;
  isActive: boolean;
  companyId: string;
}

export interface IRewardsResponse {
  rewards: IReward[];
  balance?: number | null;
}

export interface IInstitutionStudent {
  id: string;
  name: string;
  course: string;
  email: string;
}

export interface ITransaction {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  type: TTransactionType;
  studentId?: string | null;
  teacherId?: string | null;
  rewardId?: string | null;
  studentName?: string | null;
  studentEmail?: string | null;
  teacherName?: string | null;
  teacherEmail?: string | null;
}

export interface ITransactionsResponse {
  transactions: ITransaction[];
  balance?: number | null;
}

export interface IDonateCoinsPayload {
  studentId: string;
  amount: number;
  reason: string;
}

export interface IRedeemRewardPayload {
  rewardId: string;
}

export interface ICreateCompanyRewardPayload {
  name: string;
  description: string;
  amount: number;
  imageUrl: string;
  isActive?: boolean;
}

export interface IUpdateCompanyRewardPayload {
  id: string;
  name?: string;
  description?: string;
  amount?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface IBaseSuccessResponse {
  success: boolean;
}
