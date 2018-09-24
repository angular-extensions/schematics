"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("typescript");
const core_1 = require("@angular-devkit/core");
const config_1 = require("@schematics/angular/utility/config");
const project_1 = require("@schematics/angular/utility/project");
const find_module_1 = require("@schematics/angular/utility/find-module");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const lint_fix_1 = require("@schematics/angular/utility/lint-fix");
const change_1 = require("@schematics/angular/utility/change");
function modelService(options) {
    return (host, _context) => {
        const workspace = config_1.getWorkspace(host);
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        const project = workspace.projects[options.project];
        if (options.path === undefined) {
            options.path = project_1.buildDefaultPath(project);
        }
        const parsedPath = parse_name_1.parseName(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            options.spec ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('.spec.ts')),
            schematics_1.template(Object.assign({}, core_1.strings, { 'if-flat': (s) => (options.flat ? '' : s) }, options)),
            schematics_1.move(parsedPath.path)
        ]);
        return schematics_1.chain([
            schematics_1.branchAndMerge(schematics_1.chain([
                addToNgModuleProviders(options),
                schematics_1.mergeWith(templateSource, schematics_1.MergeStrategy.Default)
            ])),
            options.lintFix ? lint_fix_1.applyLintFix(options.path) : schematics_1.noop()
        ]);
        return schematics_1.chain([
            schematics_1.mergeWith(templateSource, schematics_1.MergeStrategy.Default),
            options.lintFix ? lint_fix_1.applyLintFix(options.path) : schematics_1.noop()
        ])(host, _context);
    };
}
exports.modelService = modelService;
function addToNgModuleProviders(options) {
    return (host) => {
        if (!options.module) {
            return host;
        }
        const modulePath = `${options.path}/${options.module}`;
        const moduleSource = readIntoSourceFile(host, modulePath);
        const servicePath = `${options.path}/` +
            (options.flat ? '' : core_1.strings.dasherize(options.name) + '/') +
            core_1.strings.dasherize(options.name) +
            '.service';
        const relativePath = find_module_1.buildRelativePath(modulePath, servicePath);
        const classifiedName = core_1.strings.classify(`${options.name}Service`);
        const providersChanges = ast_utils_1.addProviderToModule(moduleSource, modulePath, classifiedName, relativePath);
        const providersRecorder = host.beginUpdate(modulePath);
        for (const change of providersChanges) {
            if (change instanceof change_1.InsertChange) {
                providersRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(providersRecorder);
        return host;
    };
}
function readIntoSourceFile(host, modulePath) {
    const text = host.read(modulePath);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}
//# sourceMappingURL=index.js.map