import { Report } from '@/types/report';

const getRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

export const reportData: Report[] = [
  {
    id: '1',
    reportNo: 'REP00001',
    orderName: 'Campaign X',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-01-01',
    toDate: '2023-01-31',
    paymentStatus: 'Completed',
    reportName: 'REP00001_Campaign X.xlsx',
  },
  {
    id: '2',
    reportNo: 'REP00002',
    orderName: 'Campaign Y',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-02-01',
    toDate: '2023-02-28',
    paymentStatus: 'Pending',
    reportName: 'REP00002_Campaign Y.xlsx',
  },
  {
    id: '3',
    reportNo: 'REP00003',
    orderName: 'Campaign Z',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-03-01',
    toDate: '2023-03-31',
    paymentStatus: 'Completed',
    reportName: 'REP00003_Campaign Z.xlsx',
  },
  {
    id: '4',
    reportNo: 'REP00004',
    orderName: 'Campaign A',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-04-01',
    toDate: '2023-04-30',
    paymentStatus: 'Pending',
    reportName: 'REP00004_Campaign A.xlsx',
  },
  {
    id: '5',
    reportNo: 'REP00005',
    orderName: 'Campaign B',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-05-01',
    toDate: '2023-05-31',
    paymentStatus: 'Completed',
    reportName: 'REP00005_Campaign B.xlsx',
  },
  {
    id: '6',
    reportNo: 'REP00006',
    orderName: 'Campaign C',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-06-01',
    toDate: '2023-06-30',
    paymentStatus: 'Pending',
    reportName: 'REP00006_Campaign C.xlsx',
  },
  {
    id: '7',
    reportNo: 'REP00007',
    orderName: 'Campaign D',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-07-01',
    toDate: '2023-07-31',
    paymentStatus: 'Completed',
    reportName: 'REP00007_Campaign D.xlsx',
  },
  {
    id: '8',
    reportNo: 'REP00008',
    orderName: 'Campaign E',
    orderPlacedDate: getRandomDate(),
    fromDate: '2023-08-01',
    toDate: '2023-08-31',
    paymentStatus: 'Pending',
    reportName: 'REP00008_Campaign E.xlsx',
    reportStatus: 'Request Pending',
  },
];
