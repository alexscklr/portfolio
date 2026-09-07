namespace Portfolio.Api.Services;

public interface IStorageService
{
    /// <summary>
    /// Loads a file from the storage service and returns a public URL.
    /// </summary>
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);

    /// <summary>
    /// Deletes a file from the storage service via url.
    /// </summary>
    Task DeleteFileAsync(string fileUrl);
}