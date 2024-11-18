const gateway_host = 'http://localhost:8888';

export const environment = {
  kc_url: "http://localhost:8080",
  kc_realm: "dev-test-realm",
  kc_client_id: "dev_client_angular",
  account_service_host: `${gateway_host}/account-service`,
  client_service_host: `${gateway_host}/client-service`,
  transaction_service_host: `${gateway_host}/transaction-service`,
};
