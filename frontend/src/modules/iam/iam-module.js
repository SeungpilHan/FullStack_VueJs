import routes from '@/modules/iam/iam-routes';
import store from '@/modules/iam/iam-store';
import IamUserAutocompleteInput from '@/modules/iam/components/iam-user-autocomplete-input';

export default {
  components: [IamUserAutocompleteInput],
  routes,
  store,
};
