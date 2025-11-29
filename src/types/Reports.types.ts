export type ReportFormat = "csv" | "pdf";

export interface ReportRequestParams {
  fromUtc?: string;
  toUtc?: string;
  format?: ReportFormat;
}

export interface ReportDownload {
  blob: Blob;
  filename: string;
  contentType: string;
}
