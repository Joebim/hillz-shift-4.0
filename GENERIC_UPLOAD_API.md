# Generic Upload API Specification

This document outlines a standardized API for handling file uploads, including creating, retrieving, and deleting media assets. It is designed to be reusable across different projects.

## 1. Create (Upload)

### Definition

- **Endpoint:** `POST /api/uploads`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Authentication:** Required (Bearer Token)

### Request Body (Multipart)

| Key      | Type     | Required | Description                                     |
| :------- | :------- | :------- | :---------------------------------------------- |
| `file`   | `File`   | **Yes**  | The binary file data (Image or Video).          |
| `folder` | `String` | No       | Target directory path for storage organization. |

### Constraints

- **Supported Images:** JPEG, JPG, PNG, GIF
- **Supported Videos:** MP4, MKV, AVI, MOV
- **Max File Size:** 20 MB

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "public_id": "project_name/uploads/filename_123",
    "url": "http://storage-provider.com/project_name/uploads/filename_123.jpg",
    "secure_url": "https://storage-provider.com/project_name/uploads/filename_123.jpg",
    "format": "jpg",
    "folder": "project_name/uploads",
    "resource_type": "image",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## 2. Read (Get All)

### Definition

- **Endpoint:** `GET /api/uploads`
- **Method:** `GET`
- **Authentication:** Required (Admin level recommended)

Retrieves a list of all uploaded files.

### Success Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "public_id": "project_name/uploads/img1",
      "secure_url": "https://storage-provider.com/project_name/uploads/img1.jpg",
      "format": "jpg",
      "resource_type": "image",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "isUsed": true
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "public_id": "project_name/uploads/vid1",
      "secure_url": "https://storage-provider.com/project_name/uploads/vid1.mp4",
      "format": "mp4",
      "resource_type": "video",
      "createdAt": "2024-01-02T15:30:00.000Z",
      "isUsed": false
    }
  ]
}
```

_Note: `isUsed` is an optional boolean indicating if the asset is referenced in other collections._

## 3. Delete

### Definition

- **Endpoint:** `DELETE /api/uploads/:id`
- **Method:** `DELETE`
- **Authentication:** Required (Admin level recommended)

Deletes a file from both the storage provider and the local database.

### Parameters

| Parameter | Type   | Description                                                                     |
| :-------- | :----- | :------------------------------------------------------------------------------ |
| `id`      | String | The local Database ID (`_id`) OR the Storage Provider's Asset ID (`public_id`). |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {}
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "Upload not found"
}
```

## 4. Data Types

### Multipart File Object

The structure of the file object sent in the `POST` request.

| Property       | Type   | Description                             |
| :------------- | :----- | :-------------------------------------- |
| `originalname` | String | Name of the file on the user's computer |
| `mimetype`     | String | MIME type (e.g., `image/jpeg`).         |
| `size`         | Number | Size of the file in bytes.              |

### UploadData Object

The standardized data object returned within the `data` field of the responses.

| Property        | Type    | Description                                            |
| :-------------- | :------ | :----------------------------------------------------- |
| `_id`           | String  | (Optional) Internal Database ID.                       |
| `public_id`     | String  | Unique identifier for the asset in the storage system. |
| `url`           | String  | Standard HTTP URL for accessing the asset.             |
| `secure_url`    | String  | Secure HTTPS URL for accessing the asset.              |
| `format`        | String  | File extension/format (e.g., `png`, `mp4`).            |
| `resource_type` | String  | Type of asset: `"image"` or `"video"`.                 |
| `folder`        | String  | The folder path where the asset is stored.             |
| `createdAt`     | String  | ISO 8601 Timestamp of upload.                          |
| `isUsed`        | Boolean | (Optional) Whether the asset is in use.                |
