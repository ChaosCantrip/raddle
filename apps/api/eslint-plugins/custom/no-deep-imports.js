const rule = {
    meta: {
        type: "suggestion",
        docs: { description: "Enforce imports from barrel files." },
        fixable: "code",
    },
    create(context) 
    {
        const restrictedDirs = ["@/middlewares", "@/lib", "@/error-handlers", "@/process-error-handlers"];
        return {
            ImportDeclaration(node) 
            {
                const importPath = node.source.value;
                const matchingDir = restrictedDirs.find(dir => importPath.startsWith(`${dir}/`));

                if (matchingDir) 
                {
                    context.report({
                        node,
                        message: `Deep import detected. Please import from the root of '${matchingDir}' instead.`,
                        fix(fixer) 
                        {
                            // Replaces the string literal with the base directory
                            return fixer.replaceText(node.source, `'${matchingDir}'`);
                        }
                    });
                }
            },
        };
    },
};

export default rule;
