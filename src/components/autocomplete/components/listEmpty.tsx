import AutocompleteOptionListItem from './listItem';

const AutocompleteListEmpty = ({
  emptyMessage = 'No results found',
}: {
  emptyMessage?: string;
}) => {
  return (
    <AutocompleteOptionListItem disabled>
      {emptyMessage}
    </AutocompleteOptionListItem>
  );
};

export default AutocompleteListEmpty;
