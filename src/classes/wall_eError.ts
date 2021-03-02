export abstract class Wall_eError {
  public message: string | null = null;
  public beforeAction: ((serviceBundle?: any) => Promise<void>) | null = null;
  public action: ((serviceBundle?: any) => Promise<void>) | null = null;
  public afterAction: ((serviceBundle?: any) => Promise<void>) | null = null;
}
