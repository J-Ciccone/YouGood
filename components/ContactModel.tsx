export interface ContactModel {
    displayName: string;
    phoneNumber: string;
    pushToken: string;
  }
export interface EmailsEntity {
    email: string;
    id: string;
    isPrimary: number;
    label: string;
    type: string;
}
  
export interface ContactItem {
    item: ContactModel
}