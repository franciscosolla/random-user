import { useEffect, useState } from "react";
import { User } from "../../shared/types/RandomUserApi";
import "./LocalStateList.css";

export const LocalStateList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=5000')
      .then(response => response.json())
      .then(data => setUsers(data.results));
  }, []);
  
  return (
    <div>
      <ul className="list-container">
        {users.map(user => (
          <UserCard user={user} />
        ))}
      </ul>
    </div>
  )
}

interface UserProps {
  user: User;
}

const UserCard: React.FC<UserProps> = ({ user }) => {
  const [firstName, setFirstName] = useState(user.name.first);

  return (
    <li className="list-item" key={user.login.uuid}>
      <img className="user-picture" src={user.picture.thumbnail} alt="thumbnail" />
      <input
        className="user-name"
        type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
    </li>
  )
}