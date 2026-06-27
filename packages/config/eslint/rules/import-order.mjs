import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const GROUP = {
  npm: 1,
  raddle: 2,
  alias: 3,
  relative: 4,
  cssModule: 5
};

function isResolvablePackage(source, filename) 
{
  if (!filename || filename.startsWith("<")) 
  {
    return false;
  }

  const require = createRequire(pathToFileURL(filename).href);

  try 
  {
    require.resolve(source);
    return true;
  }
  catch 
  {
    return false;
  }
}

function classifyImport(source, filename) 
{
  if (source.endsWith(".module.css")) 
  {
    return GROUP.cssModule;
  }

  if (source.startsWith("@raddle/")) 
  {
    return GROUP.raddle;
  }

  if (source.startsWith("./") || source.startsWith("../")) 
  {
    return GROUP.relative;
  }

  if (source.startsWith("@") && !isResolvablePackage(source, filename)) 
  {
    return GROUP.alias;
  }

  return GROUP.npm;
}

function compareImports(left, right) 
{
  if (left.group !== right.group) 
  {
    return left.group - right.group;
  }

  if (left.source === right.source && left.isType !== right.isType) 
  {
    return left.isType ? 1 : -1;
  }

  return left.index - right.index;
}

function hasOnlyWhitespace(text) 
{
  return /^\s*$/.test(text);
}

function buildFixedImportBlock(importEntries, sourceCode) 
{
  let fixedText = "";

  for (let index = 0; index < importEntries.length; index += 1) 
  {
    const currentImport = importEntries[index];
    const nextImport = importEntries[index + 1];

    fixedText += sourceCode.getText(currentImport.node);

    if (!nextImport) 
    {
      continue;
    }

    fixedText += currentImport.group === nextImport.group ? "\n" : "\n\n";
  }

  return fixedText;
}

function needsOrderingFix(importEntries) 
{
  const desiredOrder = [...importEntries].sort(compareImports);

  return desiredOrder.some((entry, index) => entry.node !== importEntries[index].node);
}

function reportOrderingIssues(context, imports, importEntries, filename) 
{
  let previousImport = null;
  let previousGroup = null;

  for (const currentImport of imports) 
  {
    const sourceValue = currentImport.source.value;

    if (typeof sourceValue !== "string") 
    {
      continue;
    }

    const currentGroup = classifyImport(sourceValue, filename);

    if (previousImport && previousGroup !== null) 
    {
      if (currentGroup < previousGroup) 
      {
        context.report({
          node: currentImport,
          messageId: "normalizeImports"
        });

        return;
      }

      if (currentGroup !== previousGroup) 
      {
        const gap = currentImport.loc.start.line - previousImport.loc.end.line - 1;

        if (gap < 1) 
        {
          context.report({
            node: currentImport,
            messageId: "normalizeImports"
          });

          return;
        }
      }
    }

    previousImport = currentImport;
    previousGroup = currentGroup;
  }

  const importsBySource = new Map();

  importEntries.forEach((entry, index) => 
  {
    if (!importsBySource.has(entry.source)) 
    {
      importsBySource.set(entry.source, []);
    }

    importsBySource.get(entry.source).push({
      node: entry.node,
      index,
      isType: entry.isType
    });
  });

  for (const sourceImports of importsBySource.values()) 
  {
    const hasTypeImport = sourceImports.some((item) => item.isType);
    const hasValueImport = sourceImports.some((item) => !item.isType);

    if (!hasTypeImport || !hasValueImport) 
    {
      continue;
    }

    const firstImport = sourceImports[0];

    if (firstImport.isType) 
    {
      context.report({
        node: firstImport.node,
        messageId: "normalizeImports"
      });

      return;
    }

    for (let index = 1; index < sourceImports.length; index += 1) 
    {
      const previous = sourceImports[index - 1];
      const current = sourceImports[index];

      if (current.index !== previous.index + 1) 
      {
        context.report({
          node: current.node,
          messageId: "normalizeImports"
        });

        return;
      }
    }

    let seenTypeImport = false;

    for (const currentImport of sourceImports) 
    {
      if (currentImport.isType) 
      {
        seenTypeImport = true;
        continue;
      }

      if (seenTypeImport) 
      {
        context.report({
          node: currentImport.node,
          messageId: "normalizeImports"
        });

        return;
      }
    }
  }
}

const importOrderRule = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description: "Enforce Raddle import group order and grouping for type imports"
    },
    schema: [],
    messages: {
      normalizeImports: "Imports must be ordered as npm, @raddle, aliases, relative paths, then .module.css, with value imports before type imports and blank lines between groups."
    }
  },

  create(context) 
  {
    const filename = context.filename ?? context.getFilename?.();
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const text = sourceCode.getText();

    return {
      Program(node) 
      {
        const imports = node.body.filter((statement) => statement.type === "ImportDeclaration");

        if (imports.length === 0) 
        {
          return;
        }

        const importEntries = imports.map((importNode, index) => 
        {
          const sourceValue = importNode.source.value;

          return {
            node: importNode,
            index,
            source: typeof sourceValue === "string" ? sourceValue : "",
            group: typeof sourceValue === "string" ? classifyImport(sourceValue, filename) : GROUP.npm,
            isType: importNode.importKind === "type"
          };
        });

        let blockIsWhitespaceOnly = true;

        for (let index = 1; index < imports.length; index += 1) 
        {
          const previousImport = imports[index - 1];
          const currentImport = imports[index];
          const gapText = text.slice(previousImport.range[1], currentImport.range[0]);

          if (!hasOnlyWhitespace(gapText)) 
          {
            blockIsWhitespaceOnly = false;
            break;
          }
        }

        const desiredOrder = [...importEntries].sort(compareImports);

        let hasGroupSpacingIssue = false;

        for (let index = 1; index < desiredOrder.length; index += 1) 
        {
          const previousImport = desiredOrder[index - 1];
          const currentImport = desiredOrder[index];

          const expectedBlankLines = previousImport.group === currentImport.group ? 0 : 1;
          const actualBlankLines = currentImport.node.loc.start.line - previousImport.node.loc.end.line - 1;

          if (actualBlankLines !== expectedBlankLines) 
          {
            hasGroupSpacingIssue = true;
            break;
          }
        }

        const hasOrderingIssue = needsOrderingFix(importEntries);

        let hasTypeValueIssue = false;

        for (let index = 1; index < desiredOrder.length; index += 1) 
        {
          const previousImport = desiredOrder[index - 1];
          const currentImport = desiredOrder[index];

          if (previousImport.source === currentImport.source && previousImport.isType && !currentImport.isType) 
          {
            hasTypeValueIssue = true;
            break;
          }
        }

        if (!hasOrderingIssue && !hasGroupSpacingIssue && !hasTypeValueIssue) 
        {
          return;
        }

        if (blockIsWhitespaceOnly) 
        {
          context.report({
            node: imports[0],
            messageId: "normalizeImports",
            fix(fixer) 
            {
              return fixer.replaceTextRange(
                [imports[0].range[0], imports[imports.length - 1].range[1]],
                buildFixedImportBlock(desiredOrder, sourceCode)
              );
            }
          });

          return;
        }

        reportOrderingIssues(context, imports, importEntries, filename);
      }
    };
  }
};

export default importOrderRule;
