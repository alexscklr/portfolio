using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Portfolio.Api.Services;

public class AzureBlobStorageService : IStorageService
{
    private readonly BlobContainerClient _containerClient;
    private const string ContainerName = "portfolio-media";

    public AzureBlobStorageService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("AzureBlobStorage");

        var blobServiceClient = new BlobServiceClient(connectionString);
        _containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
        _containerClient.CreateIfNotExists(PublicAccessType.Blob);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var blobClient = _containerClient.GetBlobClient(uniqueFileName);

        var httpHeaders = new BlobHttpHeaders { ContentType = contentType };

        await blobClient.UploadAsync(fileStream, new BlobUploadOptions { HttpHeaders = httpHeaders });
        return blobClient.Uri.ToString();
    }

    public async Task DeleteFileAsync(string fileUrl)
    {
        var uri = new Uri(fileUrl);
        var fileName = Path.GetFileName(uri.LocalPath);
        var blobClient = _containerClient.GetBlobClient(fileName);

        await blobClient.DeleteIfExistsAsync();
    }
}