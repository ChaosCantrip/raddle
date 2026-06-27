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

function getGapBetween(previousImport, currentImport) 
{
  if (!previousImport.loc || !currentImport.loc) 
  {
    return 0;
  }

  return currentImport.loc.start.line - previousImport.loc.end.line - 1;
}

const importOrderRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce Raddle import group order and grouping for type imports"
    },
    schema: [
      {
        type: "object",
        properties: {
          aliasPrefixes: {
            type: "array",
            items: { type: "string" }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      invalidGroupOrder: "Imports must be grouped in this order: npm, @raddle, aliased paths, relative paths, then .module.css.",
      missingGroupSpacing: "Leave one blank line between different import groups.",
      valueImportBeforeTypeImport: "When importing from the same module, place value imports before type imports.",
      keepTypeAndValueTogether: "Type and value imports from the same module must be adjacent."
    }
  },

  create(context) 
  {
    const filename = context.filename ?? context.getFilename?.();

    return {
      Program(node) 
      {
        const imports = node.body.filter((statement) => statement.type === "ImportDeclaration");

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
                messageId: "invalidGroupOrder"
              });
            }

            if (currentGroup !== previousGroup) 
            {
              const gap = getGapBetween(previousImport, currentImport);

              if (gap < 1) 
              {
                context.report({
                  node: currentImport,
                  messageId: "missingGroupSpacing"
                });
              }
            }
          }

          previousImport = currentImport;
          previousGroup = currentGroup;
        }

        const importsBySource = new Map();

        imports.forEach((importNode, index) => 
        {
          const sourceValue = importNode.source.value;

          if (typeof sourceValue !== "string") 
          {
            return;
          }

          if (!importsBySource.has(sourceValue)) 
          {
            importsBySource.set(sourceValue, []);
          }

          importsBySource.get(sourceValue).push({
            node: importNode,
            index,
            isType: importNode.importKind === "type"
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
              messageId: "valueImportBeforeTypeImport"
            });
          }

          for (let index = 1; index < sourceImports.length; index += 1) 
          {
            const previous = sourceImports[index - 1];
            const current = sourceImports[index];

            if (current.index !== previous.index + 1) 
            {
              context.report({
                node: current.node,
                messageId: "keepTypeAndValueTogether"
              });
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
                messageId: "valueImportBeforeTypeImport"
              });
            }
          }
        }
      }
    };
  }
};

export default importOrderRule;
