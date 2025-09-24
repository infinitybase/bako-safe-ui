import AutocompleteInput from './input';
import AutocompleteOptionList from './list';
import AutocompleteListEmpty from './listEmpty';
import AutocompleteOptionListItem from './listItem';
import AutocompleteRoot from './root';

const Autocomplete = {
  Root: AutocompleteRoot,
  Input: AutocompleteInput,
  List: AutocompleteOptionList,
  ListItem: AutocompleteOptionListItem,
  ListEmpty: AutocompleteListEmpty,
};

export default Autocomplete;
