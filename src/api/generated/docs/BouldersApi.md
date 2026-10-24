# BouldersApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBoulder**](BouldersApi.md#createboulderoperation) | **POST** /api/gyms/{gymId}/boulders | Create a boulder with inline holds |
| [**deleteBoulder**](BouldersApi.md#deleteboulder) | **DELETE** /api/boulders/{boulderId} | Delete boulder (creator or admin) |
| [**getBoulderById**](BouldersApi.md#getboulderbyid) | **GET** /api/boulders/{boulderId} | Get boulder detail with holds |
| [**listBoulders**](BouldersApi.md#listboulders) | **GET** /api/gyms/{gymId}/boulders | List boulders for a gym |
| [**listBouldersByWall**](BouldersApi.md#listbouldersbywall) | **GET** /api/wall-images/{wallImageId}/boulders | List boulders for a wall image |
| [**updateBoulder**](BouldersApi.md#updateboulderoperation) | **PUT** /api/boulders/{boulderId} | Update boulder (creator only) |



## createBoulder

> BoulderDto createBoulder(gymId, createBoulderRequest)

Create a boulder with inline holds

### Example

```ts
import {
  Configuration,
  BouldersApi,
} from '';
import type { CreateBoulderOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BouldersApi(config);

  const body = {
    // number
    gymId: 56,
    // CreateBoulderRequest
    createBoulderRequest: ...,
  } satisfies CreateBoulderOperationRequest;

  try {
    const data = await api.createBoulder(body);
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
| **createBoulderRequest** | [CreateBoulderRequest](CreateBoulderRequest.md) |  | |

### Return type

[**BoulderDto**](BoulderDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Boulder created |  -  |
| **400** | Invalid input |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteBoulder

> deleteBoulder(boulderId)

Delete boulder (creator or admin)

### Example

```ts
import {
  Configuration,
  BouldersApi,
} from '';
import type { DeleteBoulderRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BouldersApi(config);

  const body = {
    // number
    boulderId: 56,
  } satisfies DeleteBoulderRequest;

  try {
    const data = await api.deleteBoulder(body);
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
| **boulderId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Boulder deleted |  -  |
| **403** | Forbidden |  -  |
| **404** | Boulder not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getBoulderById

> BoulderDetailDto getBoulderById(boulderId)

Get boulder detail with holds

### Example

```ts
import {
  Configuration,
  BouldersApi,
} from '';
import type { GetBoulderByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BouldersApi(config);

  const body = {
    // number
    boulderId: 56,
  } satisfies GetBoulderByIdRequest;

  try {
    const data = await api.getBoulderById(body);
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
| **boulderId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**BoulderDetailDto**](BoulderDetailDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Boulder details with holds |  -  |
| **404** | Boulder not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listBoulders

> BoulderPageResponse listBoulders(gymId, page, size)

List boulders for a gym

### Example

```ts
import {
  Configuration,
  BouldersApi,
} from '';
import type { ListBouldersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BouldersApi(config);

  const body = {
    // number
    gymId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies ListBouldersRequest;

  try {
    const data = await api.listBoulders(body);
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

[**BoulderPageResponse**](BoulderPageResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated list of boulders |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listBouldersByWall

> BoulderWithUserPageResponse listBouldersByWall(wallImageId, page, size)

List boulders for a wall image

### Example

```ts
import {
  Configuration,
  BouldersApi,
} from '';
import type { ListBouldersByWallRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BouldersApi(config);

  const body = {
    // number
    wallImageId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies ListBouldersByWallRequest;

  try {
    const data = await api.listBouldersByWall(body);
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
| **page** | `number` |  | [Optional] [Defaults to `0`] |
| **size** | `number` |  | [Optional] [Defaults to `20`] |

### Return type

[**BoulderWithUserPageResponse**](BoulderWithUserPageResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated list of boulders on the wall image |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateBoulder

> BoulderDto updateBoulder(boulderId, updateBoulderRequest)

Update boulder (creator only)

### Example

```ts
import {
  Configuration,
  BouldersApi,
} from '';
import type { UpdateBoulderOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BouldersApi(config);

  const body = {
    // number
    boulderId: 56,
    // UpdateBoulderRequest
    updateBoulderRequest: ...,
  } satisfies UpdateBoulderOperationRequest;

  try {
    const data = await api.updateBoulder(body);
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
| **boulderId** | `number` |  | [Defaults to `undefined`] |
| **updateBoulderRequest** | [UpdateBoulderRequest](UpdateBoulderRequest.md) |  | |

### Return type

[**BoulderDto**](BoulderDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Boulder updated |  -  |
| **403** | Forbidden - not the creator |  -  |
| **404** | Boulder not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

