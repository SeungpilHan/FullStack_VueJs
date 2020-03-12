import routes from '@/modules/loan/loan-routes';
import store from '@/modules/loan/loan-store';
import LoanAutocompleteInput from '@/modules/loan/components/loan-autocomplete-input';

export default {
  components: [LoanAutocompleteInput],
  routes,
  store,
};
