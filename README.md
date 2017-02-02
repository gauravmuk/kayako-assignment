# Flatten Array

Flattens nested array into a single array

# File Uploader

- Configurable upload URL and param name.
- Show live preview on the browser if the file is an image.
- Customize file extensions to be allowed. For example: [‘image/png’, ‘image/jpg’]
- Ability to send extra data when uploading the file. For example Sending user_id with each file.

## Options
- el: The container in which the file uploader should be appended.
- previewEl: The container in which image previews should be shown.
- allowMultiple: Allow uploading multiple files
- accept: File types to be allowed
- extraData: Send extra data along with files
- filesParam: Parameter name for file upload
- id: ID of the container to be appended
- url: URL to which the upload is to take place

# Run Tests
```
npm test
```
# Usage

Run `index.html` in browser to test file uploader.