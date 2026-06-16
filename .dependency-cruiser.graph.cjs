/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [],
  options: {
    doNotFollow: {
      path: ['node_modules', 'dist', 'coverage'],
    },
    exclude: {
      path: ['node_modules', 'dist', 'coverage', 'backend-fastapi'],
    },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      mainFields: ['module', 'main', 'types', 'typings'],
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
    },
    reporterOptions: {
      dot: {
        collapsePattern:
          '^(?:frontend|backend)/src/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)',
        theme: {
          graph: {
            splines: 'true',
            rankdir: 'LR',
          },
          modules: [
            {
              criteria: { source: '^frontend/src/pages' },
              attributes: { fillcolor: '#dfff22', color: '#dfff22' },
            },
            {
              criteria: { source: '^frontend/src/modules' },
              attributes: { fillcolor: '#22f5ff', color: '#22f5ff' },
            },
            {
              criteria: { source: '^frontend/src/api' },
              attributes: { fillcolor: '#ffb020', color: '#ffb020' },
            },
            {
              criteria: { source: '^backend/src' },
              attributes: { fillcolor: '#ff8aa1', color: '#ff8aa1' },
            },
          ],
        },
      },
    },
  },
};
