export type Report = {
  id: string;
  reportNo: string;
  orderName: string;
  orderPlacedDate: string;
  fromDate: string;
  toDate: string;
  paymentStatus: "Pending" | "Completed";
  reportName: string;
  reportStatus?: "Request Pending";
};
