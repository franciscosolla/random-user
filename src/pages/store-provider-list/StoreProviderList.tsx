import React, { useEffect } from "react";
import { List } from "./components/List";
import { UserID, UserProvider, UserSelector, useUserFirstName, useUserIds } from "./components/UserStore";
import "./StoreProviderList.css";
import { useOptimistic } from "../../shared/hooks/useOptimistic";

export const StoreProviderList: React.FC = () => {
  return (
    <div className="content-container">
      <UserProvider>
        <Content />
        <Content />
      </UserProvider>
    </div>
  );
}

const Content: React.FC = () => {
  const userIds = useUserIds();

  return (
    <List data={userIds}>
        {(userId) => (
          <li
            className="list-item"
            key={userId}
          >
            <UserSelector userId={userId} selector={user => user.picture.thumbnail}>
              {src => <img className="user-picture" src={src} alt="thumbnail" />}
            </UserSelector>
            <UserFirstName userId={userId}/>
          </li>
        )}
    </List>
  );
}

const UserFirstName: React.FC<{ userId: UserID }> = ({ userId }) => {
  const [userFirstName, setUserFirstName] = useUserFirstName(userId);
  const [optmisticText, setOptimisticText] = useOptimistic(userFirstName)
  const [text, setText] = React.useState(userFirstName);

  useEffect(() => {
    setText(optmisticText);
  }, [optmisticText]);

  return (
    <input
      className="user-name"
      type="text"
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && text?.length) {
          setOptimisticText(text);
          setUserFirstName(text);
        }
      }}
    />
  )
}
