# Birthday Surprise

## Current State
The app has a Motoko backend with variables for boyfriendName, birthdayMonth, birthdayDay, letter paragraphs, and memories (with imageData as base64 text). All variables are `var` (not `stable`), meaning data is erased every time the canister is upgraded/redeployed. Photos are stored as base64 strings directly in the backend, which can also exceed message size limits.

## Requested Changes (Diff)

### Add
- Make all backend variables `stable` so they survive redeployments
- Add blob-storage integration for photo uploads in the Memories customize panel
- Backend APIs: uploadMemoryPhoto(blobId, caption) and getMemoryPhotos()

### Modify
- Backend: change `var` to `stable var` for all state variables
- Backend: replace imageData:Text memory storage with blobId references to blob-storage
- Frontend CustomizeModal: use blob-storage upload API for photo slots instead of base64 FileReader
- Frontend MemoriesPage: load photos via blob-storage URLs instead of base64 data

### Remove
- Base64 image data storage in backend memories array

## Implementation Plan
1. Rewrite backend with stable variables and blob-storage-based memory photo storage
2. Update CustomizeModal to upload files via blob-storage and store blob IDs + captions
3. Update MemoriesPage to load photos via blob-storage HTTP URLs
