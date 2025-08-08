# @verus188/lang-jsonc

This is a fork of @shopify/lang-jsonc. Added a linter and shortcut for comments. Traling commas not allowed.

## Usage

```tsx
import ReactCodeMirror, {
  EditorView,
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror';
import { codeMirrorJsonStyle } from '../constantsColors/codeMirrorJsonStyle';
import { forwardRef } from 'react';
import { linter, lintGutter } from '@codemirror/lint';
import { jsonc, jsoncParseLinter } from '@verus188/lang-jsonc';

export const JsonEditor = forwardRef<ReactCodeMirrorRef, ReactCodeMirrorProps>(
  ({ ...props }, ref) => {
    return (
      <ReactCodeMirror
        {...props}
        ref={ref}
        extensions={[jsonc(), linter(jsoncParseLinter()), lintGutter(), EditorView.lineWrapping]}
        theme={codeMirrorJsonStyle}
      />
    );
  },
);
```

## Credits

This project includes code from the following repositories. Thank you for your work!

1. [@yettoapp/jsonc](https://github.com/yettoapp/lezer-jsonc)
2. [@lezer/json](https://github.com/lezer-parser/json)
3. [@codemirror/lang-json](https://github.com/codemirror/lang-json)

See [ThirdPartyNotices.txt](../../ThirdPartyNotices.txt) for their licenses.

## License

MIT.
