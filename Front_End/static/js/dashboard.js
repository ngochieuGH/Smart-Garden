const token = localStorage.getItem('token');
const mode = document.getElementById("mode");
const LedL = document.getElementById("LedL");
const LedH = document.getElementById("LedH");
const water = document.getElementById("water");
const temp = document.getElementById("sliderTemp");
const min = document.getElementById("sliderMin");
const max = document.getElementById("sliderMax");
const x = localStorage.getItem('nameUser');

// --ControlButton v2:DieuKhienMode, v1: DieukhienLed, v6: DieuKhienDenSuoi, v7: DieuKhienMayBom
// --ShowValue     v8: NhietDo, v9: DoAm, v10: DoAmDat
// --SetValue      v3: NhietDo, v4:Max, v5:Min
setInterval(function(){ ren(),SetTemp(),SetMin(),SetMax(),Show() },1000)
async function getData(url){
    const respon = await fetch(url)
    return respon.json()
}
async function ren(){
    if(x){
        document.getElementById("nameuser").innerHTML = x;
        const data = await getData("https://blynk.cloud/external/api/getAll?token="+ token);
        //document.getElementById('noidung').innerHTML = data.name; 
        document.getElementById("tempValue").innerHTML = (data.v8).substring(0,2);
        document.getElementById("humValue").innerHTML = (data.v9).substring(0,2);
        document.getElementById("soilValue").innerHTML = (data.v10).substring(0,2);
        mode.checked = data.v2;
        if(data.v2 !== 0){ // Tu dong
            // document.getElementById("Control").style.visibility = 'hidden'
            // document.getElementById("setvalue").style.visibility = 'visible'
            document.getElementById("Control").style.display = "none"
            document.getElementById("setvalue").style.display = "block"
            document.getElementById("voice controll").style.display = "none"
            temp.value = data.v3;
            min.value = data.v5;
            max.value = data.v4;
            //Show();
        }
        else{ // Thu cong
            // document.getElementById("Control").style.visibility = 'visible'
            // document.getElementById("setvalue").style.visibility = 'hidden'
            document.getElementById("Control").style.display = "block"
            document.getElementById("setvalue").style.display = "none"
            document.getElementById("voice controll").style.display = "block"
            LedL.checked = data.v1;
            LedH.checked = data.v6;
            water.checked = data.v7;
        }
    }
    else{
        window.location.href="login.html";
    }
}
async function ControlMode() {
    if(mode.checked === true){
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v2=1");
    }
    else{
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v2=0");
    }
}
async function ControlLedL() {
    if(LedL.checked === true){
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v1=1");
    }
    else{
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v1=0");
    }
}
async function ControlLedH() {
    if(LedH.checked === true){
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v6=1");
    }
    else{
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v6=0");
    }
}
async function ControlWater() {
    if(water.checked === true){
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v7=1");
    }
    else{
        const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v7=0");
    }
}
async function Show(){
    document.getElementById("tempset").innerHTML = temp.value;
    document.getElementById("minset").innerHTML = min.value;
    document.getElementById("maxset").innerHTML = max.value;
}
async function SetTemp(){
    const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v3=" + temp.value);
    //document.getElementById("tempset").innerHTML = temp.value;
}
async function SetMin(){
    const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v5=" + min.value);
    //document.getElementById("minset").innerHTML = min.value;
}
async function SetMax(){
    const data = await getData("https://blynk.cloud/external/api/update?token=" + token + "&v4=" + max.value);
    //document.getElementById("maxset").innerHTML = max.value;
}
temp.addEventListener("input",function(){
    document.getElementById("tempset").innerHTML = temp.value;
})
min.addEventListener("input",function(){
    document.getElementById("minset").innerHTML = min.value;
})
max.addEventListener("input",function(){
    document.getElementById("maxset").innerHTML = max.value;
})



// Kiểm tra xem trình duyệt có hỗ trợ Web Speech API không
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang = 'vi-VN'; // Đặt ngôn ngữ

// Sự kiện khi nhận diện giọng nói thành công
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Transcription:', transcript);
    if(transcript === 'bật đèn sưởi'){
        LedH.checked = true;
        const data = getData("https://blynk.cloud/external/api/update?token=" + token + "&v6=1");
        
        // alert(" Đã Bật đèn sưởi");
    }
    if(transcript === 'tắt đèn sưởi'){
        LedH.checked = false;
        const data = getData("https://blynk.cloud/external/api/update?token=" + token + "&v6=0");
        
        // alert("Đã tắt đèn sưởi");
        
    }
    if(transcript === 'Bật đèn chiếu sáng'){
        LedL.checked = true;
        const data = getData("https://blynk.cloud/external/api/update?token=" + token + "&v1=1");
        
        // alert("Đã " + transcript);
    }
    if(transcript === 'tắt đèn chiếu sáng'){
        LedL.checked = false;
        const data = getData("https://blynk.cloud/external/api/update?token=" + token + "&v1=0");
        
        // alert("Đã " + transcript);
    }
    if(transcript === 'bật máy bơm'){
        water.checked = true;
        const data = getData("https://blynk.cloud/external/api/update?token=" + token + "&v7=1");
        // alert("Đã " + transcript);
    }
    if(transcript === 'tắt máy bơm'){
        water.checked = false;
        const data = getData("https://blynk.cloud/external/api/update?token=" + token + "&v7=0");
        
        // alert("Đã " + transcript);
    }
    // Xử lý văn bản theo ý muốn của bạn, có thể gửi lên server, hiển thị trên giao diện, vv.
};

// Sự kiện khi kết thúc nhận diện giọng nói
recognition.onend = () => {
    console.log('Speech recognition ended.');
};

// Bắt đầu nhận diện giọng nói khi gọi hàm start
document.getElementById('startButton').addEventListener('click', () => {
    recognition.start();
});
} else {
console.error('Trình duyệt không hỗ trợ Web Speech API.');
}
  