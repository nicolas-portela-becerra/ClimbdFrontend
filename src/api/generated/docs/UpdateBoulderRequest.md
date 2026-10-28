
# UpdateBoulderRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`grade` | string
`description` | string
`creatorId` | number
`gymId` | number
`wallImageId` | number
`holds` | [Array&lt;HoldDto&gt;](HoldDto.md)

## Example

```typescript
import type { UpdateBoulderRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "grade": null,
  "description": null,
  "creatorId": null,
  "gymId": null,
  "wallImageId": null,
  "holds": null,
} satisfies UpdateBoulderRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateBoulderRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


