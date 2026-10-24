
# GymDto


## Properties

Name | Type
------------ | -------------
`id` | number
`logo` | string
`name` | string
`location` | string
`description` | string
`createdByAdminId` | number
`createdDate` | Date
`updatedDate` | Date

## Example

```typescript
import type { GymDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "logo": null,
  "name": null,
  "location": null,
  "description": null,
  "createdByAdminId": null,
  "createdDate": null,
  "updatedDate": null,
} satisfies GymDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GymDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


