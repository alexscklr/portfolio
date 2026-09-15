namespace Portfolio.Api.Common;

public static class TranslationInputValidator
{
    public static bool TryNormalize<TParent, TTranslation>(
        IEnumerable<TParent> parents,
        Func<TParent, IEnumerable<TTranslation>> translationsSelector,
        Func<TTranslation, string?> languageSelector,
        Action<TTranslation, string> languageSetter,
        out string? error)
    {
        foreach (var parent in parents)
        {
            if (!TryNormalize(
                    translationsSelector(parent),
                    languageSelector,
                    languageSetter,
                    out error))
            {
                return false;
            }
        }

        error = null;
        return true;
    }

    public static bool TryNormalize<TTranslation>(
        IEnumerable<TTranslation> translations,
        Func<TTranslation, string?> languageSelector,
        Action<TTranslation, string> languageSetter,
        out string? error)
    {
        var languageCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var translation in translations)
        {
            var languageCode = languageSelector(translation);
            if (!SupportedLanguages.IsValidLanguageCode(languageCode))
            {
                error = $"Invalid language code '{languageCode}'.";
                return false;
            }

            var normalizedLanguageCode = SupportedLanguages.Resolve(languageCode);
            if (!languageCodes.Add(normalizedLanguageCode))
            {
                error = $"Duplicate translation for language '{normalizedLanguageCode}'.";
                return false;
            }

            languageSetter(translation, normalizedLanguageCode);
        }

        error = null;
        return true;
    }
}
