
# CreateGymRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`location` | string
`description` | string
`createdBy` | number
`logo` | string

## Example

```typescript
import type { CreateGymRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "location": null,
  "description": null,
  "createdBy": null,
  "logo": null,
} satisfies CreateGymRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateGymRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


