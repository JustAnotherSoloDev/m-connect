import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "../../Store/user/user";
import cssStyles from "./Home.module.scss";
import { Button } from "../../Components/button";

const uuidregex = new RegExp(
  "^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$"
);

export const Home = () => {
  const navigate = useNavigate();

  const { id } = useUserStore();
  const [sessionId, setSesstionId] = useState<string | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSesstionId(evt.currentTarget.value);
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const value = inputRef.current?.value;
    if (!value) {
      setErrorMessage("Value cannot be empty");
      return;
    }
    if (!uuidregex.test(value)) {
      setErrorMessage("Please enter correct room id");
      return;
    }
    navigate("/Session?sessionId=" + value);
  };

  return (
    <main className={cssStyles["home"]}>
      <header>
        <h2>M-Connect</h2>
      </header>
      <div>
        <div className="host">
          Create a new room by clicking &nbsp;&nbsp;
          <NavLink to={"/Session?sessionId=" + id ?? ""}>
            <Button disabled={!id}>Host</Button>
          </NavLink>
        </div>
        <div className="join">
          <div>
            Or Enter the Room ID below to join an existing
            room
          </div>
          <form onSubmit={handleSubmit}>
            <input
              name="roomId"
              onChange={handler}
              placeholder="Enter Room ID"
              className="input text"
              ref={inputRef}
            ></input>
            {errorMessage ? (
              <div className="form-error">{errorMessage}</div>
            ) : null}
            <Button type="submit">Join</Button>
          </form>
        </div>
      </div>
    </main>
  );
};
