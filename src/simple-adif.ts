/**
 * A minimal interface for describing ADIF data.
 */
export interface SimpleAdif {
  header?: { [field: string]: string };
  records?: Array<{ [field: string]: string }>;
}
