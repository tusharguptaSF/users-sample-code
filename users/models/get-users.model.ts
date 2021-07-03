export class GetUsersModel {
  data: object;
  message?: string;
  org?: number;
  total?: number;
}

export class ManageUser {
  firstNm?: string;
  lastNm?: string;
  email?: string;
  org?: number;
  role?: number;
  status?: number;
  profileImage?: string;
  error?: string;
  errorMesaage?: string[];
  id?: string;
  orgKey?: string;
  org2?: any;
  userOrgs?: number;
  loginAttempt:number;
}

export class UserOrgs {
  userId: number;
  orgIds: string;
}

export class SetStaus {
  userid: number;
  status: number;
  message?: string;
}
