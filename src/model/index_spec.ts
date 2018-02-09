import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from '@schematics/angular/utility/test';
import { Schema as ServiceOptions } from './schema';


describe('Pipe Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../collection.json'),
  );
  const defaultOptions: ServiceOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: true,
    module: undefined,
    flat: false,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should create a service', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/src/app/foo/foo.service.spec.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo/foo.service.ts')).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).not.toMatch(/import { FooService } from '.\/foo\/foo.service'/);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).toMatch(/import { FooService } from '.\/foo\/foo.service'/);
  });

  it('should fail if specified module does not exist', () => {
    const options = { ...defaultOptions, module: '/src/app/app.moduleXXX.ts' };
    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('model', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should respect the spec flag', () => {
    const options = { ...defaultOptions, spec: false };

    const tree = schematicRunner.runSchematic('model', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/src/app/foo/foo.service.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo/foo.service.spec.ts')).toEqual(-1);
  });
});