# GymsApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**assignGymOwner**](GymsApi.md#assigngymowner) | **POST** /api/gyms/{gymId}/owners | Assign a gym owner (admin only) |
| [**createGym**](GymsApi.md#creategymoperation) | **POST** /api/gyms | Create a new gym (admin only) |
| [**deleteGym**](GymsApi.md#deletegym) | **DELETE** /api/gyms/{gymId} | Delete gym (admin) |
| [**getGymById**](GymsApi.md#getgymbyid) | **GET** /api/gyms/{gymId} | Get gym by ID |
| [**listGyms**](GymsApi.md#listgyms) | **GET** /api/gyms | List all gyms |
| [**updateGym**](GymsApi.md#updategymoperation) | **PUT** /api/gyms/{gymId} | Update gym (admin or gym owner) |



## assignGymOwner

> assignGymOwner(gymId, assignOwnerRequest)

Assign a gym owner (admin only)

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { AssignGymOwnerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GymsApi(config);

  const body = {
    // number
    gymId: 56,
    // AssignOwnerRequest
    assignOwnerRequest: ...,
  } satisfies AssignGymOwnerRequest;

  try {
    const data = await api.assignGymOwner(body);
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
| **assignOwnerRequest** | [AssignOwnerRequest](AssignOwnerRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Owner assigned |  -  |
| **403** | Forbidden - admin only |  -  |
| **404** | Gym or user not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createGym

> GymDto createGym(createGymRequest)

Create a new gym (admin only)

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { CreateGymOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GymsApi(config);

  const body = {
    // CreateGymRequest
    createGymRequest: ...,
  } satisfies CreateGymOperationRequest;

  try {
    const data = await api.createGym(body);
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
| **createGymRequest** | [CreateGymRequest](CreateGymRequest.md) |  | |

### Return type

[**GymDto**](GymDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Gym created |  -  |
| **403** | Forbidden - admin only |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteGym

> deleteGym(gymId)

Delete gym (admin)

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { DeleteGymRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GymsApi(config);

  const body = {
    // number
    gymId: 56,
  } satisfies DeleteGymRequest;

  try {
    const data = await api.deleteGym(body);
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
| **204** | Gym deleted |  -  |
| **403** | Forbidden |  -  |
| **404** | Gym not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getGymById

> GymDto getGymById(gymId)

Get gym by ID

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { GetGymByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GymsApi(config);

  const body = {
    // number
    gymId: 56,
  } satisfies GetGymByIdRequest;

  try {
    const data = await api.getGymById(body);
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

### Return type

[**GymDto**](GymDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Gym details |  -  |
| **404** | Gym not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listGyms

> GymPageResponse listGyms(page, size)

List all gyms

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { ListGymsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GymsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies ListGymsRequest;

  try {
    const data = await api.listGyms(body);
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
| **page** | `number` |  | [Optional] [Defaults to `0`] |
| **size** | `number` |  | [Optional] [Defaults to `20`] |

### Return type

[**GymPageResponse**](GymPageResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated list of gyms |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateGym

> GymDto updateGym(gymId, updateGymRequest)

Update gym (admin or gym owner)

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { UpdateGymOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new GymsApi(config);

  const body = {
    // number
    gymId: 56,
    // UpdateGymRequest
    updateGymRequest: ...,
  } satisfies UpdateGymOperationRequest;

  try {
    const data = await api.updateGym(body);
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
| **updateGymRequest** | [UpdateGymRequest](UpdateGymRequest.md) |  | |

### Return type

[**GymDto**](GymDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Gym updated |  -  |
| **403** | Forbidden |  -  |
| **404** | Gym not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

