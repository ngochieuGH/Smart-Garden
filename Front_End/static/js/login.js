const user = document.querySelector("input[type=text]");
const pass = document.querySelector("input[type=password]");
async function postJSON() {
    try {
        const userjs = user.value +'';
        const passjs = pass.value +'';
        const data = { 
            username: userjs, 
            password: passjs
        };
        user.value = '';
        pass.value = '';
        console.log(data);
        const response = await fetch("http://192.168.1.8:3000/login", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

        const result = await response.json();
        //console.log(result.success);
        if(result){
            console.log(result);
            localStorage.setItem('nameUser',result[0].name);
            localStorage.setItem('token', result[0].token)
            window.location.href = "dashboard.html";
        }
        else{
            alert("Sai thong tin dang nhap")
            //document.getElementById("0").innerHTML = "Sai thong tin dang nhap !";
        }
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

  