# GymsApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addGymStaff**](GymsApi.md#addgymstaffoperation) | **POST** /api/gyms/{gymId}/staff | Add a user to the gym staff, or change their role (admin or gym owner) |
| [**createGym**](GymsApi.md#creategymoperation) | **POST** /api/gyms | Create a new gym (admin only) |
| [**deleteGym**](GymsApi.md#deletegym) | **DELETE** /api/gyms/{gymId} | Delete gym (admin) |
| [**getGymById**](GymsApi.md#getgymbyid) | **GET** /api/gyms/{gymId} | Get gym by ID |
| [**listGymStaff**](GymsApi.md#listgymstaff) | **GET** /api/gyms/{gymId}/staff | List the owners and setters of a gym (admin or gym owner) |
| [**listGyms**](GymsApi.md#listgyms) | **GET** /api/gyms | List all gyms |
| [**removeGymStaff**](GymsApi.md#removegymstaff) | **DELETE** /api/gyms/{gymId}/staff/{userId} | Remove a user from the gym staff (admin or gym owner; only admins remove owners) |
| [**updateGym**](GymsApi.md#updategymoperation) | **PUT** /api/gyms/{gymId} | Update gym, including its logo (admin or gym owner) |



## addGymStaff

> GymStaffDto addGymStaff(gymId, addGymStaffRequest)

Add a user to the gym staff, or change their role (admin or gym owner)

Gym owners can only add or change SETTERs. Only an admin can grant, change or remove the OWNER role.

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { AddGymStaffOperationRequest } from '';

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
    // AddGymStaffRequest
    addGymStaffRequest: ...,
  } satisfies AddGymStaffOperationRequest;

  try {
    const data = await api.addGymStaff(body);
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
| **addGymStaffRequest** | [AddGymStaffRequest](AddGymStaffRequest.md) |  | |

### Return type

[**GymStaffDto**](GymStaffDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Staff member added or updated |  -  |
| **403** | Forbidden |  -  |
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


## listGymStaff

> Array&lt;GymStaffDto&gt; listGymStaff(gymId)

List the owners and setters of a gym (admin or gym owner)

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { ListGymStaffRequest } from '';

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
  } satisfies ListGymStaffRequest;

  try {
    const data = await api.listGymStaff(body);
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

[**Array&lt;GymStaffDto&gt;**](GymStaffDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Gym staff |  -  |
| **403** | Forbidden - admin or gym owner only |  -  |
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


## removeGymStaff

> removeGymStaff(gymId, userId)

Remove a user from the gym staff (admin or gym owner; only admins remove owners)

### Example

```ts
import {
  Configuration,
  GymsApi,
} from '';
import type { RemoveGymStaffRequest } from '';

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
    // number
    userId: 56,
  } satisfies RemoveGymStaffRequest;

  try {
    const data = await api.removeGymStaff(body);
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
| **userId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Staff member removed |  -  |
| **403** | Forbidden |  -  |
| **404** | The user is not staff of this gym |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateGym

> GymDto updateGym(gymId, updateGymRequest)

Update gym, including its logo (admin or gym owner)

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

