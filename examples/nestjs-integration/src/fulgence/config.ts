export const config = {
  transport_client: "./transport-client.js",
  transport_server: "./transport-server.js",
  tasks_lifecycle: "./tasks-lifecycle.js",
  tasks: {
    AccountsService: {
      file: "../accounts/accounts.service.js",
      url: "http://accounts:3000"
    },
    BaseService: {
      file: "../base/base.service.js",
      url: "http://base:3000"
    },
    LeadsService: {
      file: "../leads/leads.service.js",
      url: "http://leads:3000"
    },
  },
};

// TODO export config_path from here
