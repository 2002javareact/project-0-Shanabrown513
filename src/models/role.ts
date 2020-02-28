 export class role{
    roleId: number // primary key
    role: string // not null, unique
    constructor(roleId: number, role: string) {
        this.roleId = roleId
        this.role = role
    }
  }