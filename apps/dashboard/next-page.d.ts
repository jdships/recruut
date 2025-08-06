export {};

declare global {
  export type NextPageProps = {
    params: Promise<NextParams>;
    searchParams: Promise<NextSearchParams>;
  };
}
