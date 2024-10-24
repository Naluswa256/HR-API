import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const employeeIdRegex = /^Emp[a-f0-9]{8}$/;

export function generateUniqueEmployeeId() {
  const uniqueId = crypto.randomBytes(4).toString('hex'); 
  return `Emp${uniqueId}`;
}
export const generateDepartmentCode = (): string => {
  return `DEP-${uuidv4().split('-')[0].toUpperCase()}`; // Generate a unique code, e.g., "DEP-1234ABCD"
};
