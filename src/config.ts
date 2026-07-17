export class ApplicationConfig {
  public static readonly http = {
    port: 5001,
  };

  public static readonly addresses = {
    web: process.env.ADDR_WEB!,
  };

  public static readonly cors = {
    allowedOrigins: [this.addresses.web],
  };
}
