import routes from '@/modules/book/book-routes';
import store from '@/modules/book/book-store';
import BookAutocompleteInput from '@/modules/book/components/book-autocomplete-input';

export default {
  components: [BookAutocompleteInput],
  routes,
  store,
};
