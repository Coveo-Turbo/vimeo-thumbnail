# VimeoThumbnail

Vimeo Thumbnail with its own modal preview box

Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Getting Started

1. Install the component into your project.

```
npm i @coveops/vimeo-thumbnail
```

2. Use the Component or extend it

Typescript:

```javascript
import { VimeoThumbnail, IVimeoThumbnailOptions } from '@coveops/vimeo-thumbnail';
```

Javascript

```javascript
const VimeoThumbnail = require('@coveops/vimeo-thumbnail').VimeoThumbnail;
```

3. You can also expose the component alongside other components being built in your project.

```javascript
export * from '@coveops/vimeo-thumbnail'
```

4. Or for quick testing, you can add the script from unpkg

```html
<script src="https://unpkg.com/@coveops/vimeo-thumbnail@latest/dist/index.min.js"></script>
```

> Disclaimer: Unpkg should be used for testing but not for production.

5. Include the component in your template as follows:

Place the component in your markup:

```html
<div class="CoveoVimeoThumbnail"></div>
```

## Extending

Extending the component can be done as follows:

```javascript
import { VimeoThumbnail, IVimeoThumbnailOptions } from "@coveops/vimeo-thumbnail";

export interface IExtendedVimeoThumbnailOptions extends IVimeoThumbnailOptions {}

export class ExtendedVimeoThumbnail extends VimeoThumbnail {}
```

## Options

The following options can be configured:

| Option | Required | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `width` | No | string | `220px` | Width of the thumbnail |
| `height` | No | string | `112px` | Height of the thumbnail |
| `embed` | No | boolean | `true` | Specifies whether clicking on the Vimeo thumbnail loads the video in a modal box |
| `fieldThumbnail` | No | string | `ytthumbnailurl` | Field containing the location of the thumbnail image |
| `fieldVideoId` | No | string | `uri` | Field containing the ID of the video like: `https://vimeo.com/85905904` |
  
## Contribute

1. Clone the project
2. Copy `.env.dist` to `.env` and update the COVEO_ORG_ID and COVEO_TOKEN fields in the `.env` file to use your Coveo credentials and SERVER_PORT to configure the port of the sandbox - it will use 8080 by default.
3. Build the code base: `npm run build`
4. Serve the sandbox for live development `npm run serve`
