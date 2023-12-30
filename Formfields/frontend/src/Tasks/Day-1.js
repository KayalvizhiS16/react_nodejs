import React from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = React.useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    age: "",
    active: "",
  });
  const [list, setList] = React.useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnClick = () => {
    if (!data.name && !data.id) return;

    //post

    axios
      .post("http://localhost:4000/postData", {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        gender: data.gender,
        age: data.age,
        active: data.active,
      })
      .then((res) => {
        setList((prev) => {
          const arr = [...prev];
          arr.push({
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            gender: data.gender,
            age: data.age,
            active: data.active,
          });
          return arr;
        });
        setData({
          id: "",
          firstname: "",
          lastname: "",
          email: "",
          gender: "",
          age: "",
          active: "",
        });
        console.log(res.data);

        if (res.data.message) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        }
      });
  };

  //get

  React.useEffect(() => {
    axios
      .get("http://localhost:4000/getData")
      .then((res) => {
        // const { data = [] } = res?.data.Data || {};
        console.log(res.data.Data);
        const data = [...res.data.Data];
        console.log(data);
        if (data && data?.length) {
          setList(data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        }
      });
  }, []);

  //delete

  const handleDelete = (index) => {
    const id = index;
    console.log("Index :" + index);
    axios
      .delete(`http://localhost:4000/deleteData/${id}`)
      .then((response) => {
        console.log(`Deleted post with ID ${id}`);
        const data = [...response.data.Data];
        setList(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  console.log(list);
  return (
    <div>
      <input
        value={data.id}
        onChange={(e) => handleChange(e)}
        placeholder="id"
        name="id"
      />
      <input
        placeholder="Name"
        value={data.name}
        name="name"
        onChange={(e) => handleChange(e)}
      />
      <input
        value={data.id}
        onChange={(e) => handleChange(e)}
        placeholder="id"
        name="id"
      />
      <input
        value={data.id}
        onChange={(e) => handleChange(e)}
        placeholder="id"
        name="id"
      />
      <input
        value={data.id}
        onChange={(e) => handleChange(e)}
        placeholder="id"
        name="id"
      />
      <input
        value={data.id}
        onChange={(e) => handleChange(e)}
        placeholder="id"
        name="id"
      />
      <input
        value={data.id}
        onChange={(e) => handleChange(e)}
        placeholder="id"
        name="id"
      />
      <button style={{ margin: "10px" }} onClick={() => handleOnClick()}>
        Add
      </button>
      {list.length ? (
        list.map((x, index) => (
          <div style={{ margin: "10px", display: "flex" }}>
            <div key={index} style={{ margin: "10px" }}>
              {x.id}||{x.name}
            </div>
            <button
              style={{ margin: "10px" }}
              onClick={() => handleDelete(list[index].id)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <h4>No data found</h4>
      )}
    </div>
  );
};

export default App;
