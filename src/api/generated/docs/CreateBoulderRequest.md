
# CreateBoulderRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`grade` | string
`description` | string
`wallImageId` | number
`createdBy` | number
`holds` | [Array&lt;CreateHoldRequest&gt;](CreateHoldRequest.md)

## Example

```typescript
import type { CreateBoulderRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "grade": null,
  "description": null,
  "wallImageId": null,
  "createdBy": null,
  "holds": null,
} satisfies CreateBoulderRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateBoulderRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


