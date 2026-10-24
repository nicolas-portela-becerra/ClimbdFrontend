
# WallImageDetail


## Properties

Name | Type
------------ | -------------
`id` | number
`gymId` | number
`wallName` | string
`isActual` | boolean
`mimeType` | string
`widthPx` | number
`heightPx` | number
`uploadedBy` | number
`uploadedDate` | Date
`thumbnailUrl` | string
`imageUrl` | string

## Example

```typescript
import type { WallImageDetail } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "gymId": null,
  "wallName": null,
  "isActual": null,
  "mimeType": null,
  "widthPx": null,
  "heightPx": null,
  "uploadedBy": null,
  "uploadedDate": null,
  "thumbnailUrl": null,
  "imageUrl": null,
} satisfies WallImageDetail

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WallImageDetail
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


