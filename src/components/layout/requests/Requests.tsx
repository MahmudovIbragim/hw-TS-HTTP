import scss from "./Requests.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Tood {
  _id: number;
  name: string;
  email: string;
}

const link =
  "https://api.elchocrud.pro/api/v1/73eaa42fff7e79dae5f5ec091adb933d/tsTodo";

const Requests = () => {
  const [data, setData] = useState<Tood[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [UserId, setUserId] = useState<number | null>(null);

  const postRequest = async () => {
    const usersData = {
      name: name,
      email: email,
    };
    if (name === "" || email === "") {
      alert("Заполни все поли");
    } else {
      try {
        const response = (await axios.post(link, usersData)).data;
        setData(response);
        getRequest();
        toast("Успешно добавлено");
      } catch (e) {
        console.error(e);
      }
    }
    setName("");
    setEmail("");
  };

  const getRequest = async () => {
    try {
      const response = (await axios.get(link)).data;
      setData(response);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  const deleteUsers = async (id: number) => {
    try {
      const response = (await axios.delete(`${link}/${id}`)).data;
      setData(response);
      toast("Успешно Удалено");
    } catch (e) {
      console.error(e);
    }
  };

  const putRequest = async (id: number) => {
    const newDataUsers = {
      name: newName,
      email: newEmail,
    };

    if (newName === "" || newEmail === "") {
      alert("напиши обновленные данные");
    } else {
      try {
        await (
          await axios.patch(`${link}/${id}`, newDataUsers)
        ).data;
        getRequest();
        toast("Успешно Обновлено");
        setUserId(null);
      } catch (e) {
        console.error(e);
      }
    }

    setNewName("");
    setNewEmail("");
  };

  return (
    <div className={scss.Requests}>
      <div className="container">
        <div className={scss.Content}>
          <nav>
            <h1>Todo List</h1>
          </nav>
          <div className={scss.forms}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={postRequest}>Добавить</button>
            <ToastContainer
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              transition={Slide}
            />
          </div>

          <div className={scss.rendering}>
            {data.map((item, index) => (
              <div className={scss.card} key={index}>
                <h2>User: {item._id}</h2>
                {item._id === UserId ? (
                  <>
                    <div className={scss.new_input}>
                      <input
                        type="text"
                        placeholder="New Name "
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="New Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <div className={scss.new_btn}>
                        <button onClick={() => putRequest(item._id)}>
                          Сохранить
                        </button>
                        <button onClick={() => setUserId(null)}>Отмена</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Name: {item.name}</h3>
                    <h4>email: {item.email}</h4>
                  </>
                )}
                <div className={scss.card_btn}>
                  <button onClick={() => deleteUsers(item._id)}>Удалить</button>
                  <button
                    onClick={() => {
                      setUserId(item._id);
                      setNewName(item.name);
                      setNewEmail(item.email);
                    }}
                  >
                    Изменить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
