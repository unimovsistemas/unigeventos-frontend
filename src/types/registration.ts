// Base interface for common entity properties
interface BaseEntity {
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
  id: string;
}

// Contact information
export interface Contact extends BaseEntity {
  email: string;
  phoneNumber: string;
}

// Document information
export interface Document extends BaseEntity {
  number: string;
  documentType: string;
}

// Authority information
export interface Authority {
  authority: string;
}

// Role information
export interface Role extends BaseEntity {
  role: string;
}

// Login information
export interface Login extends BaseEntity {
  username: string;
  lastLogin: string;
  roles: Role[];
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  authorities: Authority[];
}

// Person information
export interface Person extends BaseEntity {
  name: string;
  birthdate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  photo: string | null;
  church: string;
  clothingSize: string;
  choralVoiceType: 'SOPRANO' | 'ALTO' | 'TENOR' | 'BASS' | 'NOT_INFORMED';
  isLeader: boolean;
  contact: Contact;
  document: Document;
  login: Login;
  personalDocumentNumber: string;
  personalContactEmail: string;
  validToSendEmail: boolean;
  personalContactPhoneNumber: string;
}

// Organizer information
export interface Organizer extends BaseEntity {
  name: string;
  contact: Contact;
  additionalDetails: string;
}

// Batch information
export interface Batch extends BaseEntity {
  name: string;
  capacity: number;
  numberOfSubscribers: number;
  price: number;
  startDate: string;
  endDate: string;
}

// Event information
export interface Event extends BaseEntity {
  name: string;
  description: string;
  banner: string | null;
  startDatetime: string;
  endDatetime: string;
  registrationStartDate: string;
  registrationDeadline: string;
  finalDatePayment: string;
  location: string;
  capacity: number;
  numberOfSubscribers: number;
  hasTransport: boolean;
  termIsRequired: boolean;
  type: 'EVANGELISM' | 'CONFERENCE' | 'RETREAT' | 'WORSHIP' | 'OTHER';
  organizer: Organizer;
  batches: Batch[];
  current: boolean;
  isPublished: boolean;
  isFree: boolean;
}

// Discount Coupon information
export interface DiscountCoupon extends BaseEntity {
  code: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

// Attachment information
export interface Attachment extends BaseEntity {
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// Child Registration information
export interface ChildRegistration extends BaseEntity {
  childName: string;
  childAge: number;
  childGender: 'MALE' | 'FEMALE' | 'OTHER';
  specialNeeds: string;
  parentRegistrationId: string;
}

// Transportation type enum
export type TransportationType = 'BUS' | 'PERSONAL' | 'AIRPLANE' | 'OTHER';

// Registration status enum
export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID';

// Complete Registration information
export interface Registration extends BaseEntity {
  person: Person;
  event: Event;
  batch: Batch;
  transportationType: TransportationType;
  ministries: string;
  additionalInfo: string;
  registrationDate: string;
  status: RegistrationStatus;
  qrCodeBase64: string;
  checkedIn: boolean;
  checkinDate: string | null;
  childrenRegistration: ChildRegistration[];
  holderRegistration: Registration | null;
  discountCouponApplied: DiscountCoupon | null;
  attachments: Attachment[];
  
  // Computed properties for easier access
  personContactEmail: string;
  eventEndDate: string;
  eventStartDate: string;
  eventLocation: string;
  personGender: 'MALE' | 'FEMALE' | 'OTHER';
  personAge: number;
  eventDescription: string;
  eventName: string;
  personName: string;
}

// Registration response type
export interface RegistrationResponse {
  registration: Registration;
  message?: string;
  success: boolean;
}

// Registration existence check response
export interface RegistrationExistsResponse {
  exists: boolean;
  id?: string;
}