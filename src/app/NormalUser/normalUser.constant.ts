import { TBloodGroup, TGender } from './normalUser.interface';

export const Gender: TGender[] = ['male', 'female', 'other'];

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const NormalUserSearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name',
];
