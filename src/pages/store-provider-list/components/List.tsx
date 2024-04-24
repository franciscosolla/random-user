export interface ListProps<T> {
  data: T[];
  children: (item: T) => React.ReactNode;
}

export function List<T>(props: ListProps<T>) {
  return (
    <ul className="list-container">
      {props.data.map(props.children)}
    </ul>
  );
}