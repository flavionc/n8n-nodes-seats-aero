module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'n8n-nodes-base'],
    extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/nodes',
  ],
  rules: {
    'n8n-nodes-base/node-class-description-name-miscased': 'off',
    'n8n-nodes-base/node-class-description-missing-subtitle': 'off',
    'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
    'n8n-nodes-base/node-param-default-missing': 'off',
    'n8n-nodes-base/node-param-description-miscased-id': 'off',
    'n8n-nodes-base/node-param-description-unneeded-backticks': 'off',
    'n8n-nodes-base/node-param-description-weak': 'off',
    'n8n-nodes-base/node-param-display-name-miscased': 'off',
    'n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'off',
    'n8n-nodes-base/node-param-operation-option-action-miscased': 'off',
    'n8n-nodes-base/node-param-operation-option-description-wrong-for-get-many': 'off',
    'n8n-nodes-base/node-param-operation-option-no-data-type': 'off',
    'n8n-nodes-base/node-param-option-name-wrong-for-get-many': 'off',
    'n8n-nodes-base/node-param-option-value-wrong-for-get-many': 'off',
  },
};
