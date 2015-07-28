/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  azkdemo: {
    // Dependent systems
    depends: ['redis'],
    // More images:  http://images.azk.io
    image: {'docker': 'azukiapp/node:0.12'},
    // Steps to execute before running instances
    provision: [
      'npm install',
    ],
    workdir: '/azk/#{manifest.dir}',
    shell: '/bin/bash',
    command: 'npm start',
    wait: {"retry": 30, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}': path('.'),
    },
    scalable: {'default': 1},
    http: {
      domains: [
        '#{system.name}.#{azk.default_domain}',
        '#{process.env.AZK_HOST_IP}'
      ]
    },
    ports: {
      'http': '3000/tcp'
    },
    envs: {
      // set instances variables
      NODE_ENV: 'dev',
    },
  },
  // Adds the 'redis' system
  redis: {
    image: {docker: 'redis'},
    // <-- add command and mounts
    command: 'redis-server --appendonly yes',
    mounts: {
      '/data': persistent('data'),
    },
    export_envs: {
      'DATABASE_URL': 'redis://#{net.host}:#{net.port[6379]}'
    }
  },


  /**
   * deploys
   */
  deploy: {
    image: {'docker': 'azukiapp/deploy'},
    mounts: {
      '/azk/deploy/src' : path('.'),
      '/azk/deploy/.ssh': path('#{process.env.HOME}/.ssh'),
    },
    scalable: {'default': 0, 'limit': 0},
  },
  'deploy-fast': {
    extends: 'deploy',
    envs: {
      RUN_SETUP: 'false',
      //RUN_DEPLOY: 'false',
    }
  },

});



