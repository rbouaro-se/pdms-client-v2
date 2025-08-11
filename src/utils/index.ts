// List of valid Ghanaian phone number prefixes (after 233)
const VALID_PHONE_PREFIXES = [
  '24',
  '59',
  '55',
  '20',
  '26',
  '27',
  '53',
  '57',
  '50',
  '54',
]

/**
 * Validates a Ghanaian phone number according to the same rules as the Java validator
 * @param phoneNumber The phone number to validate
 * @returns Validation result object
 */
export const validateGhanaianPhoneNumber = (phoneNumber: string) => {
  // Basic null/empty check
  if (!phoneNumber) {
    return {
      isValid: false,
      error: 'Phone number is required',
      formatted: '',
    }
  }

  // Clean the input - remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Check starts with 233
  if (!cleaned.startsWith('233')) {
    return {
      isValid: false,
      error: 'Phone number must start with 233',
      formatted: cleaned,
    }
  }

  // Check length
  if (cleaned.length !== 12) {
    return {
      isValid: false,
      error: 'Phone number must be 12 digits long',
      formatted: cleaned,
    }
  }

  // Check valid prefix
  const prefix = cleaned.substring(3, 5)
  if (!VALID_PHONE_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      error: 'Invalid Ghanaian phone number prefix',
      formatted: cleaned,
    }
  }

  // If all checks pass
  return {
    isValid: true,
    error: null,
    formatted: cleaned,
  }
}

/**
 * Formats a Ghanaian phone number for display
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number string
 */
export const formatGhanaianPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return ''

  // Clean the input first
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Format as 233 XX XXX XXXX
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 5) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
  if (cleaned.length <= 8)
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
}

/**
 * Formats user input while typing
 * @param input Current input value
 * @returns Formatted value for the input field
 */
export const formatPhoneInput = (input: string): string => {
  // Remove all non-digit characters
  let digits = input.replace(/\D/g, '')

  // Auto-prepend 233 if user starts typing without it
  if (digits.length > 0 && !digits.startsWith('233')) {
    digits = '233' + digits
  }

  // Limit to 12 characters (233 + 9 digits)
  return digits.slice(0, 12)
}
