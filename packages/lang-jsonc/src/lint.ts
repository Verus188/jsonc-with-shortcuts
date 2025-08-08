import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Text } from '@codemirror/state';
import { parseTree, ParseError, ParseErrorCode } from 'jsonc-parser';

/// Linter for JSON with comments (JSONC) using jsonc-parser
export const jsoncParseLinter =
  () =>
  (view: EditorView): Diagnostic[] => {
    const text = view.state.doc.toString().trim();

    if (text.length === 0) {
      // If the document is empty, no errors to report
      return [];
    }

    const errors: ParseError[] = [];

    // Parse the document and collect errors
    parseTree(text, errors, {
      allowTrailingComma: false,
      disallowComments: false, // Явно разрешаем комментарии
    });

    if (errors.length > 0) {
      return errors.map((error) => {
        const pos = getErrorPosition(error, view.state.doc);
        const endPos = getErrorEndPosition(error, pos, view.state.doc);
        const message = getErrorMessage(error);

        return {
          from: pos,
          to: endPos,
          message: message,
          severity: 'error',
        };
      });
    }

    return [];
  };

function getErrorPosition(error: ParseError, doc: Text): number {
  // Убедимся, что позиция не превышает длину документа
  return Math.max(0, Math.min(error.offset, doc.length));
}

function getErrorEndPosition(error: ParseError, fromPos: number, doc: Text): number {
  // Если есть длина ошибки, используем её, иначе указываем на один символ
  if (error.length && error.length > 0) {
    return Math.min(fromPos + error.length, doc.length);
  }

  // Если fromPos уже в конце документа, не увеличиваем позицию
  if (fromPos >= doc.length) {
    return doc.length;
  }

  // Иначе указываем на следующий символ
  return Math.min(fromPos + 1, doc.length);
}

function getErrorMessage(error: ParseError): string {
  switch (error.error) {
    case ParseErrorCode.InvalidSymbol:
      return 'Invalid symbol';
    case ParseErrorCode.InvalidNumberFormat:
      return 'Invalid number format';
    case ParseErrorCode.PropertyNameExpected:
      return 'Property name expected';
    case ParseErrorCode.ValueExpected:
      return 'Value expected';
    case ParseErrorCode.ColonExpected:
      return 'Colon expected after property name';
    case ParseErrorCode.CommaExpected:
      return 'Comma expected';
    case ParseErrorCode.CloseBraceExpected:
      return 'Closing brace "}" expected';
    case ParseErrorCode.CloseBracketExpected:
      return 'Closing bracket "]" expected';
    case ParseErrorCode.EndOfFileExpected:
      return 'Unexpected characters after JSON';
    case ParseErrorCode.InvalidCommentToken:
      return 'Invalid comment token';
    case ParseErrorCode.UnexpectedEndOfComment:
      return 'Unexpected end of comment';
    case ParseErrorCode.UnexpectedEndOfString:
      return 'Unexpected end of string';
    case ParseErrorCode.UnexpectedEndOfNumber:
      return 'Unexpected end of number';
    case ParseErrorCode.InvalidUnicode:
      return 'Invalid unicode escape sequence';
    case ParseErrorCode.InvalidEscapeCharacter:
      return 'Invalid escape character in string';
    case ParseErrorCode.InvalidCharacter:
      return 'Invalid character';
    default:
      return 'JSON syntax error';
  }
}
