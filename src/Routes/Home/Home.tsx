import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserStore } from "../../Store/user/user";
import cssStyles from "./Home.module.scss";
import { Button } from "../../Components/button";

export const Home = () => {
  const { id } = useUserStore();
  const [sessionId, setSesstionId] = useState<string | undefined>();
  const handler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSesstionId(evt.currentTarget.value);
  };
  return (
    <main className={cssStyles["home"]}>
      <header>
        <h2>M-Connect</h2>
      </header>
      <div className="host">
        Create a new room by clicking &nbsp;&nbsp;
        <NavLink to={"/Session?sessionId=" + id ?? ""}>
          <Button disabled={!id}>Host</Button>
        </NavLink>
      </div>
      <div className="join">
        <span>
          Or Enter the Session ID below and click join to join an exsisting room
        </span>
        <br />
        <input onChange={handler} placeholder="Enter Room ID"></input>
        <br />
        <NavLink to={"/Session?sessionId=" + sessionId ?? ""}>
          <Button>Join</Button>
        </NavLink>
      </div>
    </main>
  );
};
