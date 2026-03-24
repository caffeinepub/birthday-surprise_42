# Birthday Surprise

## Current State
Customizations (letter paragraphs and memories/photos) are saved only to browser localStorage. When the live link is opened on another device, default placeholder content is shown instead of the personalized content.

## Requested Changes (Diff)

### Add
- Backend storage for letter paragraphs (4 text fields)
- Backend storage for memories (up to 6 entries with base64 image data + caption)
- Backend functions: setLetter, getLetter, setMemories, getMemories

### Modify
- CustomizeModal: save letter and memories to backend instead of localStorage
- LetterPage: load letter paragraphs from backend (fallback to defaults)
- MemoriesPage: load memories from backend (fallback to defaults)

### Remove
- localStorage usage for letter and memories

## Implementation Plan
1. Update main.mo with letter and memories storage + getter/setter functions
2. Regenerate backend.d.ts
3. Update CustomizeModal.tsx to call backend on save
4. Update LetterPage.tsx to fetch from backend
5. Update MemoriesPage.tsx to fetch from backend
