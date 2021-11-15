export default {
  type: 'object',
  properties: {
    appName: {
      title: 'Application Name',
      type: 'string'
    },
    ispublic: {
      enum: [
        'true',
        'false'
      ],
      title: 'Does the application expose web site(s) to the Internet?',
      type: 'string',
      enumNames: [
        'yes',
        'no'
      ]
    },
    hasPI: {
      enum: [
        'true',
        'false'
      ],
      title: 'Does the application store any personal information on individuals?',
      type: 'string',
      enumNames: [
        'yes',
        'no'
      ]
    }
  },
  dependencies: {
    appName: {
      properties: {
        product_code: {
          title: 'Product Code',
          type: 'string',
          description: 'product for our the new system'
        },
        techs_used: {
          items: {
            enum: [
              'js',
              'react'
            ],
            title: 'Select Tech',
            type: 'string',
            enumNames: [
              'Javascript',
              'react'
            ]
          },
          title: 'Application Technologies used',
          type: 'array'
        }
      },
      required: [
        'product_code'
      ]
    },
    ispublic: {
      properties: {
        whyYouDoThat: {
          title: 'Reasons for exposing to the internet',
          type: 'string'
        }
      },
      required: []
    }
  },
  required: [
    'appName'
  ],
  title: 'Testform'
}