
# BoulderWithUserPageResponse


## Properties

Name | Type
------------ | -------------
`content` | [Array&lt;BoulderResponseDto&gt;](BoulderResponseDto.md)
`totalElements` | number
`totalPages` | number
`number` | number
`size` | number
`first` | boolean
`last` | boolean
`empty` | boolean

## Example

```typescript
import type { BoulderWithUserPageResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "content": null,
  "totalElements": null,
  "totalPages": null,
  "number": null,
  "size": null,
  "first": null,
  "last": null,
  "empty": null,
} satisfies BoulderWithUserPageResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BoulderWithUserPageResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


