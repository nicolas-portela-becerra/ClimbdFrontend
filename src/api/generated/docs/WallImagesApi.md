# WallImagesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getWallImageById**](WallImagesApi.md#getwallimagebyid) | **GET** /api/wall-images/{wallImageId} | Get wall image metadata |
| [**getWallImageData**](WallImagesApi.md#getwallimagedata) | **GET** /api/wall-images/{wallImageId}/data | Download full wall image |
| [**getWallImageThumbnail**](WallImagesApi.md#getwallimagethumbnail) | **GET** /api/wall-images/{wallImageId}/thumbnail | Download wall image thumbnail |
| [**listWallImages**](WallImagesApi.md#listwallimages) | **GET** /api/gyms/{gymId}/wall-images | List wall images for a gym |
| [**uploadWallImage**](WallImagesApi.md#uploadwallimage) | **POST** /api/gyms/{gymId}/wall-images | Upload a wall image (admin or gym owner) |



## getWallImageById

> WallImageDetail getWallImageById(wallImageId)

Get wall image metadata

### Example

```ts
import {
  Configuration,
  WallImagesApi,
} from '';
import type { GetWallImageByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WallImagesApi(config);

  const body = {
    // number
    wallImageId: 56,
  } satisfies GetWallImageByIdRequest;

  try {
    const data = await api.getWallImageById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **wallImageId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**WallImageDetail**](WallImageDetail.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Wall image metadata |  -  |
| **404** | Wall image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWallImageData

> Blob getWallImageData(wallImageId)

Download full wall image

### Example

```ts
import {
  Configuration,
  WallImagesApi,
} from '';
import type { GetWallImageDataRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WallImagesApi(config);

  const body = {
    // number
    wallImageId: 56,
  } satisfies GetWallImageDataRequest;

  try {
    const data = await api.getWallImageData(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **wallImageId** | `number` |  | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `image/jpeg`, `image/png`, `image/webp`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Wall image binary data |  -  |
| **404** | Wall image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWallImageThumbnail

> Blob getWallImageThumbnail(wallImageId)

Download wall image thumbnail

### Example

```ts
import {
  Configuration,
  WallImagesApi,
} from '';
import type { GetWallImageThumbnailRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WallImagesApi(config);

  const body = {
    // number
    wallImageId: 56,
  } satisfies GetWallImageThumbnailRequest;

  try {
    const data = await api.getWallImageThumbnail(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **wallImageId** | `number` |  | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `image/jpeg`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Thumbnail binary data |  -  |
| **404** | Wall image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listWallImages

> WallImagePageResponse listWallImages(gymId, page, size)

List wall images for a gym

### Example

```ts
import {
  Configuration,
  WallImagesApi,
} from '';
import type { ListWallImagesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WallImagesApi(config);

  const body = {
    // number
    gymId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies ListWallImagesRequest;

  try {
    const data = await api.listWallImages(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **gymId** | `number` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `0`] |
| **size** | `number` |  | [Optional] [Defaults to `20`] |

### Return type

[**WallImagePageResponse**](WallImagePageResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated list of wall image summaries |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## uploadWallImage

> uploadWallImage(gymId, image, wallName, uploadedBy)

Upload a wall image (admin or gym owner)

### Example

```ts
import {
  Configuration,
  WallImagesApi,
} from '';
import type { UploadWallImageRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WallImagesApi(config);

  const body = {
    // number
    gymId: 56,
    // Blob | Wall photo file (JPEG, PNG, or WebP)
    image: BINARY_DATA_HERE,
    // string | Name of the physical wall (e.g. \\\"Cave\\\", \\\"Slab Left\\\")
    wallName: wallName_example,
    // number | ID of the user who uploaded the image
    uploadedBy: 56,
  } satisfies UploadWallImageRequest;

  try {
    const data = await api.uploadWallImage(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **gymId** | `number` |  | [Defaults to `undefined`] |
| **image** | `Blob` | Wall photo file (JPEG, PNG, or WebP) | [Defaults to `undefined`] |
| **wallName** | `string` | Name of the physical wall (e.g. \\\&quot;Cave\\\&quot;, \\\&quot;Slab Left\\\&quot;) | [Defaults to `undefined`] |
| **uploadedBy** | `number` | ID of the user who uploaded the image | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Image uploaded successfully |  -  |
| **400** | Invalid file |  -  |
| **403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

