import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserStore } from "../../Store/user/user";
export const Home = () => {
  const { id } = useUserStore();
  const [sessionId, setSesstionId] = useState<string | undefined>();
  const handler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSesstionId(evt.currentTarget.value);
  };

  return (
    <main>
      <header>M-Connect</header>
      <div>
        <NavLink to={"/Session?sessionId=" + id ?? ""}>
          <button disabled={!id}>Host</button>
        </NavLink>
      </div>
      <div>
        <input onChange={handler}></input>
        <NavLink to={"/Session?sessionId=" + sessionId ?? ""}>
          <button>Join</button>
        </NavLink>
      </div>
    </main>
  );
};
