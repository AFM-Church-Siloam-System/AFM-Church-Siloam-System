const handleLogin = async () => {

  try {

    const response =
      await axios.post(

        `${API}/login`,

        {

          username,
          password

        }

      );

    console.log(
      response.data
    );

    if (
      response.data.success
    ) {

      localStorage.setItem(
        "loggedIn",
        "true"
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setRole(
        response.data.role
      );

      setLoggedIn(true);

    } else {

      alert(
        "Invalid login"
      );

    }

  } catch (error) {

    console.log(error);

    alert(
      "Backend connection failed"
    );

  }

};