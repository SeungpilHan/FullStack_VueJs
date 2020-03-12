import { LoanModel } from '@/modules/loan/loan-model';

const { fields } = LoanModel;

export default [
  fields.id,
  fields.book,
  fields.member,
  fields.issueDate,
  fields.duoData,
  fields.returnDate,
  fields.status,
  fields.createdAt
];
