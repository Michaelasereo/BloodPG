/**
 * Format medication string to ensure dosage has "mg" unit
 * Handles formats like:
 * - "Lisinopril 10 12hrly" -> "Lisinopril 10mg 12hrly"
 * - "Tabs Lisinopril 10 12hrly" -> "Tabs Lisinopril 10mg 12hrly"
 * - "Lisinopril 10mg 12hrly" -> "Lisinopril 10mg 12hrly" (no change)
 * - "Lisinopril 10" -> "Lisinopril 10mg" (handles missing frequency)
 */
export function formatMedicationWithDosage(medication: string): string {
  if (!medication || medication.trim() === '') {
    return medication;
  }

  const trimmed = medication.trim();

  // Check if dosage already has "mg" (case insensitive)
  if (/\b\d+\s*mg\b/i.test(trimmed)) {
    return trimmed;
  }

  // Pattern 1: Match medication with name, dosage number, and frequency
  // Example: "Lisinopril 10 12hrly" or "Tabs Lisinopril 10 12hrly"
  // This pattern matches: (name with possible spaces) (number) (frequency)
  const patternWithFrequency = /^(.+?)\s+(\d+)\s+(.+)$/;
  const matchWithFreq = trimmed.match(patternWithFrequency);

  if (matchWithFreq) {
    const [, name, dosage, frequency] = matchWithFreq;
    const dosageNum = parseInt(dosage);
    // Check if dosage is reasonable (1-1000) and frequency doesn't start with a number
    if (dosageNum >= 1 && dosageNum <= 1000 && /^[a-zA-Z]/.test(frequency.trim())) {
      return `${name.trim()} ${dosage}mg ${frequency.trim()}`;
    }
  }

  // Pattern 2: Match medication with name and dosage number only (no frequency)
  // Example: "Lisinopril 10" or "Tabs Lisinopril 10"
  const patternWithoutFrequency = /^(.+?)\s+(\d+)$/;
  const matchWithoutFreq = trimmed.match(patternWithoutFrequency);

  if (matchWithoutFreq) {
    const [, name, dosage] = matchWithoutFreq;
    const dosageNum = parseInt(dosage);
    // Check if dosage is reasonable (1-1000)
    if (dosageNum >= 1 && dosageNum <= 1000) {
      return `${name.trim()} ${dosage}mg`;
    }
  }

  // Pattern 3: More flexible - find any number that's likely a dosage
  // This handles cases like "Lisinopril 10 " (with trailing space) or other edge cases
  const flexiblePattern = /^(.+?)\s+(\d+)(?:\s+(.+))?$/;
  const flexibleMatch = trimmed.match(flexiblePattern);

  if (flexibleMatch) {
    const [, name, dosage, frequency] = flexibleMatch;
    const dosageNum = parseInt(dosage);
    if (dosageNum >= 1 && dosageNum <= 1000) {
      if (frequency && frequency.trim() && /^[a-zA-Z]/.test(frequency.trim())) {
        return `${name.trim()} ${dosage}mg ${frequency.trim()}`;
      } else {
        return `${name.trim()} ${dosage}mg`;
      }
    }
  }

  // If no pattern matches, return as is
  return trimmed;
}

