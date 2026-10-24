
# BoulderDto


## Properties

Name | Type
------------ | -------------
`id` | number
`gymId` | number
`wallImageId` | number
`creatorId` | number
`name` | string
`grade` | string
`description` | string
`createdDate` | Date
`updatedDate` | Date

## Example

```typescript
import type { BoulderDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "gymId": null,
  "wallImageId": null,
  "creatorId": null,
  "name": null,
  "grade": null,
  "description": null,
  "createdDate": null,
  "updatedDate": null,
} satisfies BoulderDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BoulderDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


