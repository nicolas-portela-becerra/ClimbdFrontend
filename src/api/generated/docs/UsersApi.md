# UsersApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**activateUsers**](UsersApi.md#activateusers) | **POST** /api/users/activate-users | Activate users by their IDs |
| [**getDeactivated**](UsersApi.md#getdeactivated) | **GET** /api/users/deactivated | Get all deactivated users |



## activateUsers

> ActivateUsers200Response activateUsers(requestBody)

Activate users by their IDs

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { ActivateUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  const body = {
    // Array<number>
    requestBody: ...,
  } satisfies ActivateUsersRequest;

  try {
    const data = await api.activateUsers(body);
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
| **requestBody** | `Array<number>` |  | |

### Return type

[**ActivateUsers200Response**](ActivateUsers200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Users activated successfully |  -  |
| **400** | Invalid input |  -  |
| **401** | Missing or invalid access token |  -  |
| **403** | Forbidden - admin only |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDeactivated

> DeactivatedUsersResponse getDeactivated()

Get all deactivated users

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { GetDeactivatedRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  try {
    const data = await api.getDeactivated();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**DeactivatedUsersResponse**](DeactivatedUsersResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of deactivated users |  -  |
| **400** | Invalid request |  -  |
| **401** | Missing or invalid access token |  -  |
| **403** | Forbidden - admin only |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

