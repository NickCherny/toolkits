import { camelCase, kebabCase } from 'lodash';

export default function (plop: any) {
  plop.setHelper('normalize', (value: string): string => {
    return `${value[0].toUpperCase()}${camelCase(value).substr(1)}`;
  });

  plop.setHelper('kebabCase', kebabCase);

  // controller generator
  plop.setGenerator('component', {
    description: 'React Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Write description for package'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/README.md',
        templateFile: 'plop-templates/readme.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/package.json',
        templateFile: 'plop-templates/package.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/tsconfig.json',
        templateFile: 'plop-templates/tsconfig.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/index.ts',
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/{{normalize name}}.tsx'
      },
      {
        type: 'add',
        path: 'packages/{{kebabCase name}}/src/{{normalize name}}.test.tsx'
      }
    ]
  });
};
