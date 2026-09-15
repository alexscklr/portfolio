namespace Portfolio.Api.Common;

public static class SupportedLanguages
{
    public const string Default = "de";
    public static readonly string[] All = [ "de", "en" ];

    public static string Resolve(string? requested)
    {
        if (!string.IsNullOrWhiteSpace(requested) && All.Contains(requested, StringComparer.OrdinalIgnoreCase))
        {
            return requested.ToLowerInvariant();
        }

        return Default;
    }

    public static bool IsValidLanguageCode(string? lang)
    {
        return !string.IsNullOrWhiteSpace(lang) && All.Contains(lang, StringComparer.OrdinalIgnoreCase);
    }
}