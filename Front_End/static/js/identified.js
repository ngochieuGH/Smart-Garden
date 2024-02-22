document.querySelector('button[id=button]').onclick = function sendIdentification() {
    const files = [...document.querySelector('input[type=file]').files];
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = event.target.result;
            console.log(res);
            resolve(res);
          }
          reader.readAsDataURL(file)
      })
    })
    
    Promise.all(promises).then((base64files) => {
      console.log(base64files)
            
      const data = {
        api_key: "a92Nh4Mftecrl9JtqzbbG1ajyzBzUa9RF8PeHGllaeX8YBK9iG",
        images: base64files,
        // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
        modifiers: ["crops_medium"],
        language: "en",
        // disease details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Disease-details
        plant_details: ["common_names",
                        "name_authority",
                        "wiki_description",
                        "taxonomy",
                        "synonyms"],
      };
      
      fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(jsonData => {
        // const data1 = JSON.stringify(jsonData);
        // console.log("data1: " + data1);
        // const result = JSON.parse(data1);
        // console.log("data: " + result);
        const plantName = jsonData.suggestions[0].plant_name;
        const data = {
          name: plantName,
        }
        const response = await fetch("http://192.168.1.8:3000/identified", {
          method: "POST", // or 'PUT'
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          });

        const result = await response.json();
        document.getElementById("name").innerHTML = result[0].name;
        document.getElementById("temp").innerHTML = result[0].temp;
        document.getElementById("water").innerHTML = result[0].water;
        document.getElementById("soil").innerHTML = result[0].soil;
        document.getElementById("light").innerHTML = result[0].light;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    })
  
};