/**
 * Format medication string to ensure dosage has "mg" unit
 * Handles formats like:
 * - "Lisinopril 10 12hrly" -> "Lisinopril 10mg 12hrly"
 * - "Tabs Lisinopril 10 12hrly" -> "Tabs Lisinopril 10mg 12hrly"
 * - "Lisinopril 10mg 12hrly" -> "Lisinopril 10mg 12hrly" (no change)
 */
export function formatMedicationWithDosage(medication: string): string {
  if (!medication || medication.trim() === '') {
    return medication;
  }

  // Check if dosage already has "mg" (case insensitive)
  if (/\b\d+\s*mg\b/i.test(medication)) {
    return medication;
  }

  // Pattern to match: any text, then a number (dosage), then any text (frequency)
  // This handles: "Lisinopril 10 12hrly", "Tabs Lisinopril 10 12hrly", etc.
  // Match: (text) (number) (text) where number is likely dosage
  const pattern = /^(.+?)\s+(\d+)\s+(.+)$/;
  const match = medication.match(pattern);

  if (match) {
    const [, name, dosage, frequency] = match;
    // Check if dosage is reasonable (1-1000) and frequency doesn't start with a number
    const dosageNum = parseInt(dosage);
    if (dosageNum >= 1 && dosageNum <= 1000 && /^[a-zA-Z]/.test(frequency.trim())) {
      // Reconstruct with "mg" added to dosage
      return `${name} ${dosage}mg ${frequency}`;
    }
  }

  // If no pattern matches, return as is
  return medication;
}

