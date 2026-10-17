export const SUPPORTED_LANGUAGES = ['de', 'en'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'de';

export function isSupportedLanguage(value: string | null | undefined): value is Language {
  return value !== null && value !== undefined && SUPPORTED_LANGUAGES.includes(value as Language);
}

export function resolveLanguage(value: string | null | undefined): Language {
  const normalizedValue = value?.toLowerCase().split(/[-_]/, 1)[0];

  if (isSupportedLanguage(normalizedValue)) {
    return normalizedValue;
  }

  return DEFAULT_LANGUAGE;
}
