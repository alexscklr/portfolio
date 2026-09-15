namespace Portfolio.Api.Common;

public static class TranslationResolver
{
    public static TTranslation? Resolve<TTranslation>(
        IEnumerable<TTranslation> translations,
        string languageCode,
        Func<TTranslation, string> languageSelector)
    {
        return translations.FirstOrDefault(translation =>
                   string.Equals(languageSelector(translation), languageCode, StringComparison.OrdinalIgnoreCase))
               ?? translations.FirstOrDefault(translation =>
                   string.Equals(languageSelector(translation), SupportedLanguages.Default, StringComparison.OrdinalIgnoreCase));
    }
}
