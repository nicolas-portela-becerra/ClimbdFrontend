
# BoulderResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`gymId` | number
`wallImageId` | number
`creator` | string
`name` | string
`grade` | string
`description` | string

## Example

```typescript
import type { BoulderResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "gymId": null,
  "wallImageId": null,
  "creator": null,
  "name": null,
  "grade": null,
  "description": null,
} satisfies BoulderResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BoulderResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


