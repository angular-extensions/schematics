"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const testing_1 = require("@angular-devkit/schematics/testing");
const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0'
};
const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
    skipPackageJson: false
};
const defaultOptions = {
    name: 'foo',
    spec: true,
    flat: false,
    project: 'bar'
};
const collectionPath = path.join(__dirname, '../collection.json');
const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
let appTree;
describe('Model Schematic', () => {
    beforeEach(() => {
        appTree = runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    });
    it('should create a model service', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = runner.runSchematic('model', options, appTree);
        expect(tree.files).toContain('/projects/bar/src/app/foo/foo.service.ts');
        expect(tree.files).toContain('/projects/bar/src/app/foo/foo.service.spec.ts');
    });
    it('should create a model service respecting path as part of name', () => {
        const options = Object.assign({}, defaultOptions, { name: 'path/foo' });
        const tree = runner.runSchematic('model', options, appTree);
        expect(tree.files).toContain('/projects/bar/src/app/path/foo/foo.service.ts');
        expect(tree.files).toContain('/projects/bar/src/app/path/foo/foo.service.spec.ts');
    });
    it('should create a model service respecting path as param', () => {
        const options = Object.assign({}, defaultOptions, { name: 'foo', path: 'path' });
        const tree = runner.runSchematic('model', options, appTree);
        expect(tree.files).toContain('/path/foo/foo.service.ts');
        expect(tree.files).toContain('/path/foo/foo.service.spec.ts');
    });
    it('should respect the flat flag', () => {
        const options = Object.assign({}, defaultOptions, { flat: true });
        const tree = runner.runSchematic('model', options, appTree);
        expect(tree.files).toContain('/projects/bar/src/app/foo.service.ts');
        expect(tree.files).toContain('/projects/bar/src/app/foo.service.spec.ts');
    });
    it('should respect the spec flag', () => {
        const options = Object.assign({}, defaultOptions, { spec: false });
        const tree = runner.runSchematic('model', options, appTree);
        expect(tree.files).toContain('/projects/bar/src/app/foo/foo.service.ts');
        expect(tree.files).not.toContain('/projects/bar/src/app/foo/foo.service.spec.ts');
    });
    it('should respect the sourceRoot value', () => {
        const config = JSON.parse(appTree.readContent('/angular.json'));
        config.projects.bar.sourceRoot = 'projects/bar/custom';
        appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));
        const tree = runner.runSchematic('model', defaultOptions, appTree);
        expect(tree.files).toContain('/projects/bar/custom/app/foo/foo.service.ts');
    });
    it('should be tree-shakeable if no module is set', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = runner.runSchematic('model', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.service.ts');
        expect(content).toMatch(/providedIn: 'root'/);
    });
    it('should not be tree-shakeable if module is set', () => {
        const options = Object.assign({}, defaultOptions, { module: '/app.module.ts' });
        const tree = runner.runSchematic('model', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.service.ts');
        expect(content).not.toMatch(/providedIn: 'root'/);
    });
    it('should create model interface', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = runner.runSchematic('model', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.service.ts');
        expect(content).toMatch(/interface Foo {\n  prop: string;\n}/);
    });
    it('should create model collection with items flag', () => {
        const options = Object.assign({}, defaultOptions, { items: true });
        const tree = runner.runSchematic('model', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/foo/foo.service.ts');
        expect(content).toMatch(/private model: Model<Foo\[\]>;/);
    });
    it('should not be provided by default', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = runner.runSchematic('model', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(content).not.toMatch(/import { FooService } from '.\/foo\/foo.service'/);
    });
    it('should import into a specified module', () => {
        const options = Object.assign({}, defaultOptions, { module: 'app.module.ts' });
        const tree = runner.runSchematic('model', options, appTree);
        const content = tree.readContent('/projects/bar/src/app/app.module.ts');
        expect(content).toMatch(/import { FooService } from '.\/foo\/foo.service'/);
    });
    it('should fail if specified module does not exist', () => {
        const options = Object.assign({}, defaultOptions, { module: 'app.moduleXXX.ts' });
        let thrownError = null;
        try {
            runner.runSchematic('model', options, appTree);
        }
        catch (err) {
            thrownError = err;
        }
        expect(thrownError).toBeDefined();
    });
});
//# sourceMappingURL=index_spec.js.map