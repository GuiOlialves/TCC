const loginForm = document.getElementById('form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        user:document.getElementById('userInput').value,
        password:document.getElementById('passwordInput').value,
    }
    const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
  
      if (response.redirected) {
        window.location.href = response.url;
      } else if (response.ok) {
        console.log("Login OK, mas sem redirecionamento");
      } else {
        console.error("Erro no login");
      }
});