export type Migration = {
  name: string;
  up: string;
  down: string | null;
};
