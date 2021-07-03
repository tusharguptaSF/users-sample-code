export class ManageUserReq {
  firstName: string;
  lastName: string;
  email: string;
  org: number;
  role: number;
  status: number;
  profileImage: string;
  loginAttempt: number;
}

export class UserOrgsReq {
  userid: number;
  orgids: string;
}

export class SetStatusReq {
  userid: number;
  status: number;
}
