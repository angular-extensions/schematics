"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const test_1 = require("@schematics/angular/utility/test");
describe('Pipe Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        path: 'app',
        sourceDir: 'src',
        spec: true,
        module: undefined,
        flat: false,
    };
    let appTree;
    beforeEach(() => {
        appTree = new schematics_1.VirtualTree();
        appTree = test_1.createAppModule(appTree);
    });
    it('should create a service', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('model', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/src/app/foo/foo.service.spec.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/src/app/foo/foo.service.ts')).toBeGreaterThanOrEqual(0);
    });
    it('should not be provided by default', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('model', options, appTree);
        const content = test_1.getFileContent(tree, '/src/app/app.module.ts');
        expect(content).not.toMatch(/import { FooService } from '.\/foo\/foo.service'/);
    });
    it('should import into a specified module', () => {
        const options = Object.assign({}, defaultOptions, { module: 'app.module.ts' });
        const tree = schematicRunner.runSchematic('model', options, appTree);
        const content = test_1.getFileContent(tree, '/src/app/app.module.ts');
        expect(content).toMatch(/import { FooService } from '.\/foo\/foo.service'/);
    });
    it('should fail if specified module does not exist', () => {
        const options = Object.assign({}, defaultOptions, { module: '/src/app/app.moduleXXX.ts' });
        let thrownError = null;
        try {
            schematicRunner.runSchematic('model', options, appTree);
        }
        catch (err) {
            thrownError = err;
        }
        expect(thrownError).toBeDefined();
    });
    it('should respect the spec flag', () => {
        const options = Object.assign({}, defaultOptions, { spec: false });
        const tree = schematicRunner.runSchematic('model', options, appTree);
        const files = tree.files;
        expect(files.indexOf('/src/app/foo/foo.service.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/src/app/foo/foo.service.spec.ts')).toEqual(-1);
    });
});
//# sourceMappingURL=index_spec.js.map