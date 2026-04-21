const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

// Add all files in src/app
project.addSourceFilesAtPaths('src/app/**/*.ts');

const sourceFiles = project.getSourceFiles();

let modifiedCount = 0;

for (const sourceFile of sourceFiles) {
  let hasChanges = false;

  const classes = sourceFile.getClasses();
  if (classes.length === 0) continue;

  for (const classDec of classes) {
    // Only process classes with @Component decorator
    const componentDecorator = classDec.getDecorator('Component');
    if (!componentDecorator) continue;

    // Check if the file has any subscribe calls
    const subscribeCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter(callExpr => {
        const expression = callExpr.getExpression();
        if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
          return expression.getName() === 'subscribe';
        }
        return false;
      });

    if (subscribeCalls.length === 0) continue;

    console.log(`Processing file: ${sourceFile.getBaseName()}`);

    // Ensure ChangeDetectorRef and inject are imported from @angular/core
    let angularCoreImport = sourceFile.getImportDeclaration(dec => dec.getModuleSpecifierValue() === '@angular/core');
    
    if (angularCoreImport) {
      if (!angularCoreImport.getNamedImports().some(ni => ni.getName() === 'ChangeDetectorRef')) {
        angularCoreImport.addNamedImport('ChangeDetectorRef');
        hasChanges = true;
      }
      if (!angularCoreImport.getNamedImports().some(ni => ni.getName() === 'inject')) {
        angularCoreImport.addNamedImport('inject');
        hasChanges = true;
      }
    } else {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '@angular/core',
        namedImports: ['ChangeDetectorRef', 'inject']
      });
      hasChanges = true;
    }

    // Check if ChangeDetectorRef is already injected
    let cdrPropertyName = null;
    
    // Check properties
    const properties = classDec.getProperties();
    for (const prop of properties) {
      const init = prop.getInitializer();
      if (init && init.getKind() === SyntaxKind.CallExpression) {
        const expr = init.getExpression();
        if (expr.getText() === 'inject') {
          const args = init.getArguments();
          if (args.length > 0 && args[0].getText() === 'ChangeDetectorRef') {
            cdrPropertyName = prop.getName();
            break;
          }
        }
      }
    }

    // Check constructor parameters
    if (!cdrPropertyName) {
      const constructors = classDec.getConstructors();
      for (const ctor of constructors) {
        for (const param of ctor.getParameters()) {
          const typeNode = param.getTypeNode();
          if (typeNode && typeNode.getText() === 'ChangeDetectorRef') {
            cdrPropertyName = param.getName();
            break;
          }
        }
      }
    }

    // Add private cdr = inject(ChangeDetectorRef) if not found
    if (!cdrPropertyName) {
      classDec.insertProperty(0, {
        name: 'cdr',
        initializer: 'inject(ChangeDetectorRef)',
        scope: 'private' // Optional, could use SyntaxKind.PrivateKeyword but string is easier
      });
      cdrPropertyName = 'cdr';
      hasChanges = true;
    }

    // Now inject this.cdr.detectChanges(); into all subscribe callbacks
    for (const callExpr of subscribeCalls) {
      const args = callExpr.getArguments();
      if (args.length === 0) continue;

      const arg = args[0];
      
      // Case 1: .subscribe({ next: (res) => {}, error: () => {} })
      if (arg.getKind() === SyntaxKind.ObjectLiteralExpression) {
        const props = arg.getProperties();
        for (const prop of props) {
          if (prop.getKind() === SyntaxKind.PropertyAssignment) {
            const name = prop.getName();
            if (name === 'next' || name === 'error') {
              const initializer = prop.getInitializer();
              injectDetectChanges(initializer, cdrPropertyName);
              hasChanges = true;
            }
          }
        }
      } 
      // Case 2: .subscribe((res) => { ... }, (err) => { ... })
      else if (arg.getKind() === SyntaxKind.ArrowFunction || arg.getKind() === SyntaxKind.FunctionExpression) {
        for (let i = 0; i < args.length; i++) { // next, error, complete
            injectDetectChanges(args[i], cdrPropertyName);
            hasChanges = true;
        }
      }
    }
  }

  if (hasChanges) {
    sourceFile.saveSync();
    modifiedCount++;
  }
}

console.log(`\nModified ${modifiedCount} files successfully.`);

function injectDetectChanges(funcNode, cdrPropertyName) {
  if (!funcNode) return;
  
  if (funcNode.getKind() === SyntaxKind.ArrowFunction || funcNode.getKind() === SyntaxKind.FunctionExpression) {
    const body = funcNode.getBody();
    if (!body) return;
    
    if (body.getKind() === SyntaxKind.Block) {
      // Check if detectChanges is already there
      const text = body.getText();
      if (!text.includes(`${cdrPropertyName}.detectChanges()`)) {
        body.addStatements(`this.${cdrPropertyName}.detectChanges();`);
      }
    } else {
      // Concise arrow function body
      const text = body.getText();
      if (!text.includes(`${cdrPropertyName}.detectChanges()`)) {
        const paramsText = funcNode.getParameters().map(p => p.getText()).join(', ');
        const isAsync = funcNode.isAsync() ? 'async ' : '';
        const newBody = `{\n  ${text};\n  this.${cdrPropertyName}.detectChanges();\n}`;
        funcNode.replaceWithText(`${isAsync}(${paramsText}) => ${newBody}`);
      }
    }
  }
}
