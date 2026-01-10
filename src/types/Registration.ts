export interface Registration {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  whoInvited: string;
  heardFrom: string;
  createdAt: string | Date;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  whoInvited: string;
  heardFrom: string;
}
